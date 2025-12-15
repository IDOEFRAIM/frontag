'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    FaChevronLeft, FaWarehouse, FaBoxOpen, FaUser, 
    FaTag, FaDollarSign, FaWeight, FaCalendarAlt,
    FaCheckCircle, FaTimesCircle, FaEye, FaToggleOn,
    FaTrashAlt, FaEllipsisV, FaSyncAlt, FaExclamationTriangle,
    FaHistory, FaBalanceScale, FaChevronRight 
} from 'react-icons/fa';

// --- TYPES (Cohérence) ---
type ProductStatus = 'live' | 'archived' | 'draft' | 'pending';

type ProductItem = {
    id: string;
    name: string;
    producerId: string;
    producerName: string;
    description: string;
    stockLevel: number; // Quantité en stock
    price: number;
    referencePrice: number; // Nouveau: Prix de référence pour vérification
    unit: string;
    status: ProductStatus;
    lastUpdate: string;
    imageUrl: string; 
    creationDate: string;
    auditLog: AuditEntry[]; // Nouveau: Historique des actions
};

type AuditEntry = {
    action: string;
    admin: string;
    date: string;
};

// --- DONNÉES FICTIVES ENRICHIES ---
const mockProducts: ProductItem[] = [
    {
        id: 'ITM-001',
        name: 'Tomates Fraîches de Thiès (Bio)',
        producerId: 'PROD-001',
        producerName: 'Ferme Bio Alpha',
        description: "Belles tomates rouges, cueillies à la main ce matin. Variété locale, garantie sans pesticides. Idéales pour les salades et les sauces. Conditionnées en cagettes de 10 kg.",
        stockLevel: 150,
        price: 500,
        referencePrice: 450, // Prix de référence
        unit: 'Kg',
        status: 'live',
        lastUpdate: '2025-12-15 10:30',
        imageUrl: '/images/tomates_bio.jpg',
        creationDate: '2025-10-01',
        auditLog: [
            { action: 'Création du produit', admin: 'Ferme Bio Alpha', date: '2025-10-01' },
            { action: 'Validation Initiale', admin: 'Admin Y', date: '2025-10-02' },
            { action: 'MAJ Stock: 150 unités', admin: 'Ferme Bio Alpha', date: '2025-12-15' },
        ],
    },
    {
        id: 'ITM-004',
        name: 'Mangues Séchées (Validation)',
        producerId: 'PROD-004',
        producerName: 'AgriTech X',
        description: "Mangues séchées naturellement au soleil, sans sucres ajoutés. Parfait pour les snacks énergétiques. Produit soumis à vérification des normes d'hygiène.",
        stockLevel: 20,
        price: 1500,
        referencePrice: 1300,
        unit: 'sachet',
        status: 'pending', // En attente de validation
        lastUpdate: '2025-12-14 15:00',
        imageUrl: '/images/mangues_sechees.jpg',
        creationDate: '2025-12-10',
        auditLog: [
            { action: 'Création du produit', admin: 'AgriTech X', date: '2025-12-10' },
            { action: 'Soumission pour validation', admin: 'AgriTech X', date: '2025-12-14' },
        ],
    },
];

// --- HELPERS ---
const formatCurrency = (amount: number) => amount.toLocaleString('fr-FR') + ' F';

const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
        case 'live':
            return <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1"><FaToggleOn /> EN LIGNE</span>;
        case 'pending':
            return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1"><FaEye /> À VALIDER</span>;
        case 'archived':
            return <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1"><FaBoxOpen /> ARCHIVÉ</span>;
        case 'draft':
            return <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1"><FaEllipsisV /> BROUILLON</span>;
    }
};

// --- MODALE POUR LA RAISON DU REJET/ARCHIVAGE ---
const RejectModal: React.FC<{
    action: 'archived' | 'live';
    productName: string;
    onConfirm: (reason: string) => void;
    onClose: () => void;
}> = ({ action, productName, onConfirm, onClose }) => {
    const [reason, setReason] = useState('');

    const isReject = action === 'archived';
    const actionText = isReject ? 'Rejet/Archivage' : 'Réactivation (Optionnel)';
    const buttonClass = isReject ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{actionText} du Produit</h3>
                <p className="text-gray-600 mb-4">
                    {isReject ? `Veuillez fournir une raison pour le **rejet/l'archivage** du produit "${productName}". Cette raison sera envoyée au producteur.` : `Ajouter une note de réactivation (optionnel) pour le produit "${productName}".`}
                </p>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder={isReject ? "Raison de rejet (Ex: Image floue, Prix trop élevé, Manque de certification...)" : "Note de réactivation"}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Annuler
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={isReject && reason.length < 10}
                        className={`px-4 py-2 text-white font-bold rounded-lg transition-colors disabled:opacity-50 ${buttonClass}`}
                    >
                        Confirmer {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPOSANT DE LA PAGE ---

export default function StockDetailPage({ params }: { params: Promise<{ stockId: string }> }) {
    const router = useRouter();
    
    // Utilisation de React.use() pour déballer la Promise params
    const { stockId } = use(params);

    // Simuler la recherche du produit
    const initialProduct = mockProducts.find(p => p.id === stockId);
    const [product, setProduct] = useState(initialProduct);
    const [modal, setModal] = useState<'archived' | 'live' | null>(null);

    if (!product) {
        return (
            <div className="p-6 text-center text-gray-500">
                <FaWarehouse className="text-6xl mx-auto mb-4" />
                <h1 className="text-xl font-bold">Produit non trouvé</h1>
                <button onClick={() => router.back()} className="mt-4 text-green-700 flex items-center mx-auto">
                    <FaChevronLeft className="mr-1" /> Retour au stock
                </button>
            </div>
        );
    }

    // --- LOGIQUE D'ACTION D'ADMIN ---

    const handleConfirmStatusChange = (newStatus: ProductStatus, reason: string = '') => {
        // 1. Logique API pour mettre à jour le statut du produit
        console.log(`[API CALL] Update product status for ${product.id} to ${newStatus.toUpperCase()}. Note: ${reason}`);
        
        // 2. Mise à jour de l'état local
        const newAuditEntry: AuditEntry = {
            action: newStatus === 'live' ? `Validation et publication` : `Rejet/Archivage: ${reason.substring(0, 30)}...`,
            admin: 'Admin Current',
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        };

        setProduct(p => p ? { 
            ...p, 
            status: newStatus,
            auditLog: [newAuditEntry, ...p.auditLog] // Ajouter au début de l'historique
        } : null);
        
        alert(`Statut de ${product.name} mis à jour vers ${newStatus.toUpperCase()} (Simulé).`);
        setModal(null);
    };

    const handleDelete = () => {
        if (window.confirm(`Voulez-vous vraiment SUPPRIMER le produit "${product.name}" de la base de données? Cette action est irréversible.`)) {
            // Logique API de suppression
            alert(`Produit ${product.name} supprimé (Simulé).`);
            router.push('/admin/stock');
        }
    };
    
    // --- RENDU DES ACTIONS D'ADMIN ---
    const renderAdminActions = () => {
        if (product.status === 'pending') {
            return (
                <div className="flex gap-3 mt-4 flex-wrap">
                    <button 
                        onClick={() => handleConfirmStatusChange('live', 'Validation Administrative.')}
                        className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all"
                    >
                        <FaCheckCircle /> Valider & Publier
                    </button>
                    <button 
                        onClick={() => setModal('archived')}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 active:scale-[0.98] transition-all"
                    >
                        <FaTimesCircle /> Rejeter/Archiver
                    </button>
                </div>
            );
        }

        return (
             <div className="mt-4 text-center">
                 {product.status === 'live' && (
                     <button 
                         onClick={() => setModal('archived')}
                         className="text-red-600 font-medium hover:underline text-sm flex items-center justify-center gap-1 mx-auto"
                     >
                         <FaBoxOpen className="text-xs" /> Archiver ce produit (le rendre indisponible)
                     </button>
                 )}
                 {product.status === 'archived' && (
                     <button 
                         onClick={() => setModal('live')}
                         className="text-green-600 font-medium hover:underline text-sm flex items-center justify-center gap-1 mx-auto"
                     >
                         <FaToggleOn className="text-xs" /> Remettre ce produit en ligne (Publier)
                     </button>
                 )}
             </div>
         )
    };
    
    // Alerte pour les prix élevés
    const isPriceHigh = product.price > product.referencePrice * 1.5;

    return (
        <div className="bg-gray-50 pb-6">
            
            {/* MODAL */}
            {modal && (
                <RejectModal
                    action={modal}
                    productName={product.name}
                    onClose={() => setModal(null)}
                    onConfirm={(reason) => handleConfirmStatusChange(modal, reason)}
                />
            )}

            {/* 1. HEADER & STATUT */}
            <div className="bg-white p-4 sticky top-16 md:top-20 z-10 shadow-sm border-b border-gray-100">
                <button 
                    onClick={() => router.back()} 
                    className="text-green-700 font-medium flex items-center mb-4 active:scale-95 transition-transform"
                >
                    <FaChevronLeft className="mr-1" /> Retour au stock
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">{product.name}</h1>
                        <p className="text-gray-500 text-sm">ID: {product.id}</p>
                    </div>
                    {getStatusBadge(product.status)}
                </div>
                {renderAdminActions()}
            </div>

            <div className="p-4 space-y-6">

                {/* 2. PROFIL DU PRODUCTEUR */}
                <Section title="Informations Producteur" icon={FaUser}>
                     <Link 
                        href={`/admin/producers/${product.producerId}`}
                        className="flex justify-between items-center py-2 transition-colors hover:bg-gray-50 -mx-3 px-3 rounded-lg"
                    >
                        <span className="text-base font-semibold text-green-700 hover:underline">
                            {product.producerName}
                        </span>
                        <FaChevronLeft className="rotate-180 text-gray-400" />
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">Cliquez pour voir les détails du compte producteur.</p>
                </Section>

                {/* 3. DÉTAILS DU PRODUIT ET PRIX */}
                <Section title="Détails du Catalogue et Conformité" icon={FaTag}>
                    <InfoRow icon={FaDollarSign} label="Prix Unitaire (Déclaré)" value={`${formatCurrency(product.price)} / ${product.unit}`} />
                    <InfoRow icon={FaBalanceScale} label="Prix de Référence" value={formatCurrency(product.referencePrice)} />
                    
                    {isPriceHigh && (
                        <div className="flex items-center p-3 my-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <FaExclamationTriangle className="text-yellow-600 mr-3 min-w-[20px]" />
                            <span className="text-sm text-yellow-800 font-medium">
                                **Alerte Prix:** Le prix déclaré ({formatCurrency(product.price)}) est supérieur à 1.5x le prix de référence ({formatCurrency(product.referencePrice)}).
                            </span>
                        </div>
                    )}
                    
                    <InfoRow icon={FaWeight} label="Stock Disponible" value={`${product.stockLevel} ${product.unit}`} status={product.stockLevel === 0 ? 'red' : 'green'} />
                    <InfoRow icon={FaCalendarAlt} label="Créé le" value={new Date(product.creationDate).toLocaleDateString('fr-FR')} />
                    <InfoRow icon={FaSyncAlt} label="Dernière MAJ" value={new Date(product.lastUpdate).toLocaleDateString('fr-FR')} />
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2">Description complète:</p>
                        <blockquote className="text-gray-600 text-sm italic border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                            {product.description}
                        </blockquote>
                    </div>
                </Section>
                
                {/* 4. VUE DU MEDIA (Fictif) */}
                <Section title="Vérification Média et Qualité" icon={FaEye}>
                    <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                        [Image du produit : {product.imageUrl}]
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Ici, l'Admin vérifierait la conformité de la photo (taille, clarté, absence de filigrane) et la qualité du produit si des échantillons sont requis.</p>
                    <div className="mt-4 pt-3 border-t">
                        <button className="w-full py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                            Télécharger les Documents de Certification (Simulé)
                        </button>
                    </div>
                </Section>

                {/* 5. HISTORIQUE & AUDIT */}
                <Section title="Historique des Actions et Modifications" icon={FaHistory}>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {product.auditLog.map((entry, index) => (
                            <div key={index} className="text-xs p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="font-bold text-gray-800 block">{entry.action}</span>
                                <span className="text-gray-500 italic">Par {entry.admin} le {entry.date}</span>
                            </div>
                        ))}
                    </div>
                    {product.auditLog.length === 0 && <p className="text-sm text-gray-500">Aucun historique d'action n'est disponible.</p>}
                </Section>

                {/* 6. ACTIONS DANGEREUSES */}
                <Section title="Actions Administratives" icon={FaEllipsisV}>
                    <button
                        onClick={handleDelete}
                        className="w-full flex justify-between items-center py-3 px-3 -mx-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <FaTrashAlt className="text-lg" /> Supprimer Définitivement le Produit
                        </span>
                        <FaChevronLeft className="rotate-180 text-gray-400" /> 
                    </button>
                </Section>

            </div>
        </div>
    );
}

// --- COMPOSANTS UTILITAIRES (Mis à jour) ---

type InfoRowProps = {
    icon: React.ElementType;
    label: string;
    value: string;
    isLink?: string;
    status?: 'red' | 'green';
};

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, isLink, status }) => (
    <div className="flex items-center border-b py-3 border-gray-100 last:border-b-0 first:pt-0">
        <Icon className="text-lg text-gray-400 w-8" />
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isLink ? (
                <a 
                    href={isLink} 
                    className="text-base font-semibold text-green-700 hover:underline"
                >
                    {value}
                </a>
            ) : (
                <p className={`text-base font-semibold ${status === 'red' ? 'text-red-700' : 'text-gray-800'}`}>{value}</p>
            )}
        </div>
    </div>
);

type SectionProps = {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3 border-gray-100">
            <Icon className="text-green-600" /> {title}
        </h2>
        {children}
    </div>
);