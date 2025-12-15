import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Lire le FormData entrant
    const formData = await request.formData();

    // 2. Extraire les données
    const category = formData.get('category');
    const price = formData.get('price');
    const images = formData.getAll('images') as File[]; // Récupère toutes les images
    const audio = formData.get('audio') as File | null;

    console.log("--- NOUVEAU PRODUIT REÇU ---");
    console.log(`Catégorie: ${category}, Prix: ${price}`);
    console.log(`Nombre d'images: ${images.length}`);
    if (audio) {
      console.log(`Audio reçu: ${audio.size} octets (Type: ${audio.type})`);
    }

    // --- ICI : CODE POUR SAUVEGARDER DANS TA BASE DE DONNÉES ---
    // Ex: await db.product.create({ ... })
    // Ex: await uploadToS3(images[0])
    
    // Simulation d'attente (comme si on écrivait en base de données)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: "Produit créé" });

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}