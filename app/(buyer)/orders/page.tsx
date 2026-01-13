'use client';

import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';

export default function OrdersPage() {
  // TODO: Récupérer les commandes réelles via API ou Server Action
  const orders = []; 

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes Commandes</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBoxOpen className="text-green-600 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Aucune commande</h3>
          <p className="text-gray-500 mt-1">Vous n'avez pas encore passé de commande.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Liste des commandes ici */}
          <p>Liste des commandes...</p>
        </div>
      )}
    </div>
  );
}
