'use server';

import { prisma } from "@/lib/prisma";
import { StockType } from "@prisma/client";

// --- FARMS ---

export async function getFarms(userId: string) {
    try {
        const producer = await prisma.producer.findUnique({
            where: { userId },
            include: { farms: true }
        });
        return { success: true, data: producer?.farms || [] };
    } catch (error) {
        console.error("Error fetching farms:", error);
        return { success: false, error: "Failed to fetch farms" };
    }
}

export async function createFarm(userId: string, data: { 
    name: string; 
    location?: string;
    size?: number;
    soilType?: string;
    waterSource?: string;
}) {
    try {
        let producer = await prisma.producer.findUnique({ where: { userId } });
        
        // AUTO-FIX: Si le profil producteur n'existe pas, on le crée à la volée
        if (!producer) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            
            if (user && user.role === 'PRODUCER') {
                console.log("⚠️ Profil Producteur manquant détecté. Création automatique...");
                producer = await prisma.producer.create({
                    data: {
                        userId: user.id,
                        businessName: user.name || "Mon Agrobusiness",
                        status: "ACTIVE",
                        region: "À préciser",
                        province: "À préciser",
                        commune: "À préciser"
                    }
                });
            } else {
                return { success: false, error: "Compte non autorisé (Rôle Producteur requis)." };
            }
        }

        const farm = await prisma.farm.create({
            data: {
                name: data.name,
                location: data.location,
                size: data.size,
                soilType: data.soilType,
                waterSource: data.waterSource,
                producerId: producer.id
            }
        });
        return { success: true, data: farm };
    } catch (error: any) {
        console.error("❌ Error creating farm:", error);
        return { success: false, error: `Erreur technique: ${error.message}` };
    }
}

// --- STOCKS ---

export async function getStocks(farmId: string) {
    try {
        const stocks = await prisma.stock.findMany({
            where: { farmId },
            include: {
                movements: {
                    orderBy: { createdAt: 'desc' },
                    take: 5 // Get last 5 movements for quick view
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return { success: true, data: stocks };
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return { success: false, error: "Failed to fetch stocks" };
    }
}

export async function createStock(farmId: string, data: { 
    itemName: string; 
    quantity: number; 
    unit: string; 
    type: StockType 
}) {
    try {
        // Create stock and initial movement
        const result = await prisma.$transaction(async (tx) => {
            const stock = await tx.stock.create({
                data: {
                    farmId,
                    itemName: data.itemName,
                    quantity: data.quantity,
                    unit: data.unit,
                    type: data.type
                }
            });

            await tx.stockMovement.create({
                data: {
                    stockId: stock.id,
                    type: 'IN',
                    quantity: data.quantity,
                    reason: 'Initial Inventory'
                }
            });

            return stock;
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error creating stock:", error);
        return { success: false, error: "Failed to create stock" };
    }
}

// --- MOVEMENTS ---

export async function addStockMovement(stockId: string, data: {
    type: 'IN' | 'OUT' | 'WASTE';
    quantity: number;
    reason?: string;
}) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const stock = await tx.stock.findUnique({ where: { id: stockId } });
            if (!stock) throw new Error("Stock not found");

            let newQuantity = stock.quantity;
            if (data.type === 'IN') {
                newQuantity += data.quantity;
            } else {
                newQuantity -= data.quantity;
            }

            if (newQuantity < 0) throw new Error("Insufficient stock");

            // Update stock quantity
            await tx.stock.update({
                where: { id: stockId },
                data: { quantity: newQuantity }
            });

            // Create movement record
            const movement = await tx.stockMovement.create({
                data: {
                    stockId,
                    type: data.type,
                    quantity: data.quantity,
                    reason: data.reason
                }
            });

            return movement;
        });

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error adding stock movement:", error);
        return { success: false, error: error.message || "Failed to update stock" };
    }
}

export async function deleteStock(stockId: string) {
    try {
        await prisma.stock.delete({ where: { id: stockId } });
        return { success: true };
    } catch (error) {
        console.error("Error deleting stock:", error);
        return { success: false, error: "Failed to delete stock" };
    }
}
