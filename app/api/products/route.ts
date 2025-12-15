import { NextResponse } from 'next/server';

// Simulation d'une base de données
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Maïs Blanc (100kg)',
    price: 18000,
    category: 'Céréales',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500&q=60',
    description: 'Sac de 100kg de maïs blanc sec, récolte 2024.'
  },
  {
    id: '2',
    name: 'Engrais NPK 15-15-15',
    price: 22500,
    category: 'Intrants',
    image: 'https://plus.unsplash.com/premium_photo-1661962692059-55d5a4319814?auto=format&fit=crop&w=500&q=60',
    description: 'Sac de 50kg, idéal pour le démarrage des cultures.'
  },
  {
    id: '3',
    name: 'Mil Local (Tô)',
    price: 19500,
    category: 'Céréales',
    image: 'https://images.unsplash.com/photo-1644336067644-3a783ce459d2?auto=format&fit=crop&w=500&q=60',
    description: 'Mil de qualité supérieure pour la préparation du tô.'
  },
  {
    id: '4',
    name: 'Pelle Ronde Manche Bois',
    price: 4500,
    category: 'Outils',
    image: 'https://images.unsplash.com/photo-1622289694738-4e8979e2c65f?auto=format&fit=crop&w=500&q=60',
    description: 'Outil robuste pour les travaux de champ.'
  },
  {
    id: '5',
    name: 'Semences Tomate (Boîte)',
    price: 3000,
    category: 'Semences',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=500&q=60',
    description: 'Variété résistante à la chaleur.'
  }
];

export async function GET() {
  // Petite pause artificielle pour simuler le réseau (facultatif)
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(MOCK_PRODUCTS);
}