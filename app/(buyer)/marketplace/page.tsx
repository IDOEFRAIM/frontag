// app/(buyer)/market/page.tsx

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FaSeedling, FaTag, FaShoppingCart } from 'react-icons/fa';

export default function MarketPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <header className="bg-white shadow rounded-xl p-6 border-l-4 border-green-600">
                <h1 className="text-3xl font-bold text-gray-800">
                    Bienvenue sur le Marché, {user?.name || 'Acheteur'} !
                </h1>
                <p className="text-gray-600 mt-1">
                    Découvrez les produits frais de nos agriculteurs locaux.
                </p>
            </header>

            <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <FaSeedling size={30} className="text-green-600 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Explorer les Produits</h2>
                    <p className="text-gray-600">Parcourez les cultures disponibles et les offres du moment.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <FaTag size={30} className="text-yellow-600 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Offres Spéciales</h2>
                    <p className="text-gray-600">Ne manquez pas les meilleures réductions de la semaine.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <FaShoppingCart size={30} className="text-blue-600 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Mes Commandes</h2>
                    <p className="text-gray-600">Consultez l'historique et le statut de vos achats.</p>
                </div>
            </section>
            
            {/* Ici viendra la liste des produits (Catalogue) */}
            {/* <ProductList /> */}

        </div>
    );
}