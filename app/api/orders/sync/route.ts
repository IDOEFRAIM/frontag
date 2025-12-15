import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Lire le formulaire Multipart (Fichier + Texte)
    const formData = await req.formData();
    
    // Récupérer les champs
    const rawData = formData.get('data') as string;
    const voiceFile = formData.get('voiceNote') as File | null;

    if (!rawData) {
      return NextResponse.json(
        { error: 'Données JSON manquantes' }, 
        { status: 400 }
      );
    }

    // Parser le JSON (détails de la commande, client, GPS)
    const orderDetails = JSON.parse(rawData);

    console.log("----- 📦 NOUVELLE COMMANDE REÇUE -----");
    console.log("Client :", orderDetails.customer.name);
    console.log("Téléphone :", orderDetails.customer.phone);
    console.log("Total :", orderDetails.totalAmount, "FCFA");
    console.log("GPS :", orderDetails.delivery.lat, orderDetails.delivery.lng);

    // 2. Traitement de l'Audio (Note Vocale)
    if (voiceFile) {
      console.log(`🎙️ Note vocale détectée : ${voiceFile.name}`);
      console.log(`💾 Taille : ${(voiceFile.size / 1024).toFixed(2)} KB`);
      
      // --- C'EST ICI QUE TU SAUVEGARDERAIS LE FICHIER ---
      // Exemple Pseudo-code pour plus tard (AWS S3 ou UploadThing) :
      // const buffer = Buffer.from(await voiceFile.arrayBuffer());
      // await uploadToS3(buffer, voiceFile.name);
    } else {
      console.log("❌ Pas de note vocale jointe.");
    }

    console.log("--------------------------------------");

    // 3. Réponse (Succès)
    // On renvoie un ID fictif pour dire "C'est bon, j'ai enregistré"
    return NextResponse.json({ 
      success: true, 
      message: 'Commande synchronisée avec succès',
      orderId: Math.floor(Math.random() * 100000) 
    });

  } catch (error) {
    console.error("Erreur API Sync:", error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}