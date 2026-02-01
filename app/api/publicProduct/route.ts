import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const category = searchParams.get('category');
        const region = searchParams.get('region');
        const search = searchParams.get('search');

        const where: any = {};

        // Filtre Category
        if (category && category !== 'all') {
             where.categoryLabel = {
                contains: category, 
                mode: 'insensitive'
             };
        }

        // Filtre Region
        if (region && region !== 'all') {
            where.producer = {
                region: {
                    contains: region,
                    mode: 'insensitive',
                },
            };
        }

        // Recherche
        if (search) {
            where.OR = [
                { categoryLabel: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Execution de la requete
        const products = await prisma.product.findMany({
            where,
            include: {
                producer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                phone: true,
                            }
                        }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Mapping Data
        const formattedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.categoryLabel, 
            categoryLabel: p.categoryLabel,
            price: p.price,
            unit: p.unit,
            quantity: p.quantityForSale,
            images: p.images,
            location: { 
                address: [p.producer.commune, p.producer.region].filter(Boolean).join(', ') || 'Localisation inconnue',
                latitude: 0,
                longitude: 0 // Placeholder
            },
            producer: {
                name: p.producer.businessName || p.producer.user.name || "Producteur",
                phone: p.producer.user.phone,
            },
            stock: p.quantityForSale,
            status: p.quantityForSale > 0 ? 'active' : 'sold_out',
            createdAt: p.createdAt
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("[API_PUBLIC_PRODUCTS_ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
