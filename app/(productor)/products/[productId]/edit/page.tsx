'use client';
import ProductFlow from '@/components/utils/productorProductFlow';
// Ici tu récupères les données de ton produit (via fetch ou ton store)

export default function EditPage({ params }: { params: { id: string } }) {
  // Simulation de récupération de donnée
  const productData = { id: params.id, category: 'cereales', price: '5000', images: ['url1.jpg'] };

  return <ProductFlow mode="edit" initialData={productData} />;
}