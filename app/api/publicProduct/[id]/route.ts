// app/api/publicProduct/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Type correct pour Next.js 15
) {
    try {
        // 1. IL FAUT ATTENDRE LES PARAMS
        const { id } = await params;

        // 2. Vérification de sécurité (pour éviter le "where id: undefined")
        if (!id) {
            return NextResponse.json({ error: "ID manquant" }, { status: 400 });
        }

        // 3. Appel Prisma avec l'ID extrait
        const product = await prisma.product.findUnique({
            where: { id: id }, // Maintenant id est garanti d'être une string
            include: {
                producer: {
                    select: {
                        name: true,
                        location: true,
                        phone: true,
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
    }
}