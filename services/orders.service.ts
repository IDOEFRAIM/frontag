'use server'
import { prisma } from "@/lib/prisma";

// Type pour la création de commande (agnostique de la source)
interface CreateOrderParams {
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod?: string;
  city?: string;
  gpsLat?: number | null;
  gpsLng?: number | null;
  deliveryDesc?: string;
  audioUrl?: string | null;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

/**
 * Logique métier centralisée pour créer une commande
 */
export async function createOrderService(data: CreateOrderParams) {
  return await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod || 'cash',
      city: data.city || "Ouagadougou",
      gpsLat: data.gpsLat,
      gpsLng: data.gpsLng,
      deliveryDesc: data.deliveryDesc || "",
      audioUrl: data.audioUrl,
      status: "PENDING",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      }
    }
  });
}

export async function syncOrderWithServer(formData: FormData) {
  try {
    const rawData = formData.get('data') as string;
    const voiceFile = formData.get('voiceNote') as File | null;
    if (!rawData) throw new Error("Aucune donnée reçue");
    
    const data = JSON.parse(rawData);

    // 1. Gestion de l'audio (Simulation URL - À remplacer par un vrai upload S3/UploadThing)
    let audioUrl = null;
    if (voiceFile) {
        // Note: En production, utiliser un service de stockage externe
        audioUrl = `/uploads/audio/${Date.now()}_${voiceFile.name}`;
    }

    // 2. Appel du service centralisé
    // Mapping des données pour correspondre à l'interface unifiée
    const newOrder = await createOrderService({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      totalAmount: data.totalAmount,
      city: data.city,
      gpsLat: data.gpsLat ? parseFloat(data.gpsLat) : null,
      gpsLng: data.gpsLng ? parseFloat(data.gpsLng) : null,
      deliveryDesc: data.deliveryDesc,
      audioUrl: audioUrl,
      items: data.productIds.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }))
    });

    return { success: true, id: newOrder.id };
  } catch (error: any) {
    console.error("❌ Prisma Sync Error:", error);
    return { success: false, error: error.message };
  }
}