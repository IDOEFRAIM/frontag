import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Récupérer les catégories uniques utilisées par les produits actifs
        // Note: groupBy n'est pas toujours dispo pour toutes les DBs avec Prisma, mais findMany avec distinct l'est
        const productsCategories = await prisma.product.findMany({
            where: { quantityForSale: { gt: 0 } },
            select: { categoryLabel: true },
            distinct: ['categoryLabel']
        });

        // 2. Récupérer les régions uniques des producteurs ayant des produits actifs
        const producersRegions = await prisma.producer.findMany({
            where: {
                products: {
                    some: { quantityForSale: { gt: 0 } }
                }
            },
            select: { region: true },
            distinct: ['region']
        });

        const categories = productsCategories
            .map(p => p.categoryLabel)
            .filter(Boolean)
            .sort();

        const regions = producersRegions
            .map(p => p.region)
            .filter(Boolean)
            .sort();

        return NextResponse.json({
            categories,
            regions
        });

    } catch (error) {
        console.error("Filter API Error:", error);
        return NextResponse.json({ categories: [], regions: [] }, { status: 500 });
    }
}
