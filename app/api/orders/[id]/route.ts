import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) { // Updated to match Next.js 15+ async params
    try {
        const { id } = await params; // Await params in newer Next.js versions
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "UserId requis" }, { status: 400 });
        }

        // 1. Check Producer
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { producer: true }
        });

        if (!user || !user.producer) {
            return NextResponse.json({ error: "Producteur introuvable" }, { status: 404 });
        }

        // 2. Fetch specific Order
        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                buyer: {
                    select: { name: true, phone: true }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
        }

        // 3. Fetch Items *only for this producer* in this order
        const orderItems = await prisma.orderItem.findMany({
            where: {
                orderId: id,
                product: {
                    producerId: user.producer.id
                }
            },
            include: {
                product: { select: { name: true, unit: true } }
            }
        });

        if (orderItems.length === 0) {
             return NextResponse.json({ error: "Aucun article de ce producteur dans cette commande" }, { status: 403 });
        }

        // 4. Calculate stats specific to this producer
        let subtotal = 0;
        const items = orderItems.map(item => {
            subtotal += (item.quantity * item.priceAtSale);
            return {
                id: item.id,
                name: item.product.name,
                quantity: item.quantity,
                unit: item.product.unit,
                price: item.priceAtSale
            };
        });

        // 5. Build Response
        const orderDetails = {
            id: order.id,
            customerName: order.buyer?.name || "Client inconnu",
            customerPhone: order.buyer?.phone || "Non renseigné",
            location: "Point de retrait standard", // Placeholder
            date: order.createdAt,
            total: subtotal,
            status: order.status.toLowerCase(),
            items: items,
            deliveryFee: 1500 // Can be dynamic later
        };

        return NextResponse.json(orderDetails);

    } catch (error) {
        console.error("GET Order Details Error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status requis" }, { status: 400 });
        }

        const validStatuses = ['pending', 'confirmed', 'delivering', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Status invalide" }, { status: 400 });
        }

        // Update Order
        const updatedOrder = await prisma.order.update({
            where: { id: id },
            data: { status: status.toUpperCase() } // Prisma enum is usually uppercase, check schema if needed
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("PATCH Order Error:", error);
        return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }
}
