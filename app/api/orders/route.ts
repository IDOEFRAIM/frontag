import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { OrderSchema } from '@/lib/validators';
import { createOrderService } from '@/services/orders.service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawData = formData.get('data') as string;
    const voiceFile = formData.get('voiceNote') as File | null;

    if (!rawData) return NextResponse.json({ error: "Data manquant" }, { status: 400 });
    
    // Validation Zod
    const json = JSON.parse(rawData);
    const validation = OrderSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
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
    console.error("❌ ERREUR API:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}