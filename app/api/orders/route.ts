import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { OrderSchema } from '@/lib/validators';
import { createOrderService } from '@/services/orders.service';
import { prisma } from '@/lib/prisma';

// --- GET: RÉCUPÉRER LES COMMANDES DU PRODUCTEUR ---
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "UserId requis" }, { status: 400 });
        }

        // 1. Trouver le producteur associé au User
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { producer: true }
        });

        if (!user || !user.producer) {
            return NextResponse.json({ error: "Producteur introuvable" }, { status: 404 });
        }

        // 2. Trouver toutes les lignes de commandes (OrderItem) liées aux produits de ce producteur
        // Prisma ne permet pas de query directe "Donne moi les Orders qui contiennent mes produits"
        // On passe donc par les OrderItem
        const orderItems = await prisma.orderItem.findMany({
            where: {
                product: {
                    producerId: user.producer.id
                }
            },
            include: {
                order: {
                    include: {
                        buyer: {
                            select: { name: true, phone: true } // Récupérer infos acheteur
                        }
                    }
                },
                product: {
                    select: { name: true, unit: true } // Récupérer nom produit
                }
            },
            orderBy: {
                order: { createdAt: 'desc' }
            }
        });

        // 3. Regrouper par Commande (car un Order peut avoir plusieurs OrderItems du même producteur)
        const ordersMap = new Map();

        for (const item of orderItems) {
            const orderId = item.orderId;
            
            if (!ordersMap.has(orderId)) {
                ordersMap.set(orderId, {
                    id: orderId,
                    customerName: item.order.buyer?.name || "Client inconnu",
                    customerPhone: item.order.buyer?.phone || "Non renseigné",
                    location: "Point de retrait", // Localisation à implémenter plus tard dans Order
                    date: item.order.createdAt,
                    total: 0, // Sera recalculé sur la somme des items du producteur
                    status: item.order.status.toLowerCase(), // 'pending', 'confirmed'...
                    items: []
                });
            }

            const currentOrder = ordersMap.get(orderId);
            currentOrder.items.push({
                name: item.product.name,
                quantity: item.quantity,
                unit: item.product.unit,
                price: item.priceAtSale
            });
            currentOrder.total += (item.quantity * item.priceAtSale);
        }

        // Convertir Map en Array
        const ordersList = Array.from(ordersMap.values());

        return NextResponse.json(ordersList);

    } catch (error) {
        console.error("GET Orders Error:", error);
        return NextResponse.json({ error: "Erreur récupération commandes" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawData = formData.get('data') as string;
    const voiceFile = formData.get('voiceNote') as File | null;

    if (!rawData) return NextResponse.json({ error: "Data manquant" }, { status: 400 });
    
    // Validation Zod
    const json = JSON.parse(rawData);
    // console.log("Incoming Order Data:", JSON.stringify(json, null, 2)); // Debug Log

    const validation = OrderSchema.safeParse(json);

    if (!validation.success) {
      console.error("Validation Errors:", validation.error);
      // Return a structured error string for the frontend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors = (validation.error as any).errors || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessages = errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      
      return NextResponse.json({ error: `Erreur de validation: ${errorMessages}` }, { status: 400 });
    }

    const orderData = validation.data;

    // --- GESTION AUDIO (À améliorer avec S3/UploadThing) ---
    let savedAudioUrl: string | null = null;
    if (voiceFile && voiceFile.size > 0) {
       const fileName = `${Date.now()}_order.webm`;
       const uploadDir = join(process.cwd(), 'public', 'uploads', 'audio');
       await mkdir(uploadDir, { recursive: true });
       await writeFile(join(uploadDir, fileName), Buffer.from(await voiceFile.arrayBuffer()));
       savedAudioUrl = `/uploads/audio/${fileName}`;
    }

    console.log("Attempting to create order with service...", { customer: orderData.customer.name });

    // --- APPEL DU SERVICE ---
    const newOrder = await createOrderService({
      customerName: orderData.customer.name,
      customerPhone: orderData.customer.phone,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      city: orderData.delivery.city,
      gpsLat: orderData.delivery.lat,
      gpsLng: orderData.delivery.lng,
      deliveryDesc: orderData.delivery.description,
      audioUrl: savedAudioUrl,
      items: orderData.items.map(item => ({
        productId: item.id,
        quantity: item.qty,
        price: item.price
      }))
    });

    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });

  } catch (error: any) {
    console.error("❌ ERREUR API POST /api/orders:", error);
    return NextResponse.json({ error: error?.message || "Erreur serveur inconnue" }, { status: 500 });
  }
}