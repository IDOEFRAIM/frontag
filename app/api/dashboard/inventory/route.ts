import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AgrobusinessAsset } from '@/types/dashboard.index';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    // 1. Trouver le producteur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        producer: {
            include: {
                farms: {
                    include: {
                        inventory: true
                    }
                },
                products: true
            }
        } 
      }
    });

    if (!user || !user.producer) {
      // Pas encore producteur ou pas trouvé -> Renvoie tableau vide pour inviter à créer
      return NextResponse.json([]);
    }

    const { producer } = user;
    const assets: AgrobusinessAsset[] = [];

    // 2. Mapper les Produits (Catalogue) vers Assets
    // Les produits en vente sont considérés comme du stock 'DORMANT' (en entrepôt)
    producer.products.forEach(p => {
        if (p.quantityForSale > 0) {
            assets.push({
                id: `prod-${p.id}`,
                unitId: normalizeCategory(p.categoryLabel), // Helper pour grouper (mais, tomate...)
                nature: 'CROP', // Par défaut
                lifecycle: 'DORMANT',
                name: p.name,
                quantity: p.quantityForSale,
                unit: p.unit as any,
                // Prix de vente défini par le user = marketPrice estimé
                // purchasePrice inconnu ici, on met 0 ou une estimation
                purchasePrice: p.price * 0.7, 
                marketPrice: p.price,
                entryDate: p.updatedAt.toISOString(),
                isPerishable: ['tomate', 'légume', 'fruit'].some(k => p.categoryLabel.toLowerCase().includes(k)),
                storage: 'VENTILÉ'
            });
        }
    });

    // 3. Mapper les Stocks (Fermes) vers Assets
    producer.farms.forEach(farm => {
        farm.inventory.forEach(stock => {
            assets.push({
                id: `stock-${stock.id}`,
                unitId: normalizeCategory(stock.itemName),
                nature: stock.type === 'HARVEST' ? 'CROP' : 'LIVESTOCK', // Approx
                lifecycle: 'DORMANT',
                name: stock.itemName,
                quantity: stock.quantity,
                unit: stock.unit as any,
                purchasePrice: 0, 
                marketPrice: 0, // À déterminer ou récupérer d'une table de référence marché
                entryDate: stock.updatedAt.toISOString(),
                isPerishable: false,
                storage: 'PLEIN_AIR'
            });
        });
    });

    return NextResponse.json(assets);

  } catch (error) {
    console.error("Dashboard Inventory Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Fonction utilitaire pour essayer de deviner l'ID de catégorie (unitId) pour le filtrage
function normalizeCategory(label: string): string {
    const lower = label.toLowerCase();
    if (lower.includes('maïs') || lower.includes('mais')) return 'mais';
    if (lower.includes('tomate')) return 'tomate';
    if (lower.includes('oignon')) return 'igname'; // ou autre mapping
    if (lower.includes('volaille') || lower.includes('poule') || lower.includes('poulet')) return 'elevage';
    return 'global';
}
