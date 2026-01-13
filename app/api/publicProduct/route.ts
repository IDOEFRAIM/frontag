import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Extraction des filtres depuis l'URL
        const category = searchParams.get('category');
        const region = searchParams.get('region');
        const search = searchParams.get('search');

        // Construction dynamique de la clause WHERE pour Prisma
        const where: any = {
            status: 'active', // On ne montre que les produits actifs au public
        };

        if (category && category !== 'all') {
            where.category = category;
        }

        if (region && region !== 'all') {
            // On filtre sur la localisation du producteur lié
            where.producer = {
                location: {
                    contains: region,
                    mode: 'insensitive',
                },
            };
        }

        if (search) {
            where.OR = [
                { categoryLabel: { contains: search, mode: 'insensitive' } },
                // Tu pourrais ajouter ici un champ 'description' si présent dans ton Prisma
            ];
        }

        // Exécution de la requête avec jointure Producer
        const products = await prisma.product.findMany({
            where,
            include: {
                producer: {
                    select: {
                        name: true,
                        location: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("[API_PUBLIC_PRODUCTS_ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}