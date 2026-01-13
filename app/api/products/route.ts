import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

// --- CONFIGURATION SÉCURITÉ ---
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.webm'];
const UPLOAD_BASE_PATH = 'public/uploads';

/**
 * Sauvegarde sécurisée d'un fichier sur le disque
 */
async function saveFile(file: File, folder: string) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const originalExt = path.extname(file.name).toLowerCase();
    const extension = ALLOWED_EXTENSIONS.includes(originalExt) 
      ? originalExt 
      : (file.type === 'audio/webm' ? '.webm' : '.jpg');

    const uniqueId = Math.random().toString(36).substring(2, 10);
    const fileName = `${Date.now()}-${uniqueId}${extension}`;
    
    const uploadDir = path.join(process.cwd(), UPLOAD_BASE_PATH, folder);
    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(path.join(uploadDir, fileName), buffer);
    return fileName;
  } catch (error) {
    console.error(`Erreur sauvegarde fichier (${folder}):`, error);
    throw new Error("Échec de l'écriture du fichier.");
  }
}

/**
 * RÉCUPÉRATION DU PRODUCTEUR PAR USERID
 */
async function getProducerByUserId(userId: string) {
  if (!userId) return null;
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { producer: true }
  });
}

// ==========================================
// 1. RÉCUPÉRATION (GET) - AJOUTÉ
// ==========================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Cas A : On veut les produits d'un producteur précis (Dashboard)
    if (userId) {
      const user = await getProducerByUserId(userId);
      if (!user || !user.producer) {
        return NextResponse.json({ error: "Producteur non trouvé" }, { status: 404 });
      }

      const products = await prisma.product.findMany({
        where: { producerId: user.producer.id },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(products);
    }

    // Cas B : On veut tous les produits (Marché public)
    const allProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        producer: {
          include: { user: { select: { name: true, image: true } } }
        }
      }
    });

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des produits." }, { status: 500 });
  }
}

// ==========================================
// 2. CRÉATION (POST)
// ==========================================
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId') as string;
    
    const user = await getProducerByUserId(userId);
    if (!user || !user.producer) {
      return NextResponse.json({ error: "Profil producteur non trouvé." }, { status: 403 });
    }

    const imageFiles = formData.getAll('images') as File[];
    const imageNames = await Promise.all(
      imageFiles.filter(f => f.size > 0).map(file => saveFile(file, 'products'))
    );

    let audioName = null;
    const audioFile = formData.get('audio') as File;
    if (audioFile && audioFile.size > 0) {
      audioName = await saveFile(audioFile, 'audio');
    }

    const product = await prisma.product.create({
      data: {
        // category: formData.get('category') as string, // Removed as it is not in schema
        name: formData.get('name') as string,
        categoryLabel: formData.get('categoryLabel') as string,
        description: formData.get('description') as string || null,
        price: parseFloat(formData.get('price') as string) || 0,
        quantityForSale: parseFloat(formData.get('quantity') as string) || 0,
        unit: formData.get('unit') as string || 'KG',
        images: imageNames,
        audioUrl: audioName,
        producerId: user.producer.id,
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Échec de la création." }, { status: 500 });
  }
}

// ==========================================
// 3. MODIFICATION (PUT)
// ==========================================
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const productId = formData.get('id') as string;
    const userId = formData.get('userId') as string;

    const user = await getProducerByUserId(userId);
    if (!user || !user.producer) {
      return NextResponse.json({ error: "Action non autorisée." }, { status: 403 });
    }

    const oldProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!oldProduct) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    if (oldProduct.producerId !== user.producer.id) {
        return NextResponse.json({ error: "Vous n'êtes pas propriétaire" }, { status: 403 });
    }

    let existingImages: string[] = [];
    try {
      existingImages = JSON.parse(formData.get('existingImages') as string || '[]');
    } catch (e) { existingImages = oldProduct.images; }

    const newFiles = formData.getAll('images') as File[];
    const newImageNames = await Promise.all(
      newFiles.filter(f => f.size > 0).map(file => saveFile(file, 'products'))
    );
    
    const finalImages = [...existingImages, ...newImageNames];

    // Nettoyage disque
    const imagesToRemove = oldProduct.images.filter(img => !existingImages.includes(img));
    for (const img of imagesToRemove) {
      const filePath = path.join(process.cwd(), UPLOAD_BASE_PATH, 'products', img);
      try { await unlink(filePath); } catch (e) {}
    }

    let audioName = oldProduct.audioUrl;
    const newAudioFile = formData.get('audio') as File;
    if (newAudioFile && newAudioFile.size > 0) {
      audioName = await saveFile(newAudioFile, 'audio');
      if (oldProduct.audioUrl) {
        const oldPath = path.join(process.cwd(), UPLOAD_BASE_PATH, 'audio', oldProduct.audioUrl);
        try { await unlink(oldPath); } catch (e) {}
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        // category: formData.get('category') as string, // Removed as it is not in schema
        name: formData.get('name') as string,
        categoryLabel: formData.get('categoryLabel') as string,
        description: formData.get('description') as string || null,
        price: parseFloat(formData.get('price') as string) || 0,
        quantityForSale: parseFloat(formData.get('quantity') as string) || 0,
        unit: formData.get('unit') as string,
        images: finalImages,
        audioUrl: audioName,
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Erreur de mise à jour." }, { status: 500 });
  }
}