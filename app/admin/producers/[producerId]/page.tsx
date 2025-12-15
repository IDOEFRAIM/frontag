'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    FaChevronLeft, FaUserCog, FaPhone, FaMapMarkerAlt, 
    FaEnvelope, FaCalendarAlt, FaWarehouse, FaShoppingCart,
    FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff, 
    FaTrashAlt, FaEllipsisV, FaChartLine, FaChevronRight,
    FaLockOpen, FaReceipt, FaMoneyBillWave, FaHistory 
} from 'react-icons/fa';

// --- TYPES (Cohérence) ---
type ProducerStatus = 'active' | 'pending' | 'suspended' | 'verified';

type Producer = {
    id: string;
    name: string;
    location: string;
    email: string;
    phone: string;
    status: ProducerStatus;
    productsCount: number;
    totalOrders: number;
    registrationDate: string;
    lastProfileUpdate: string; // Ajout
    totalRevenue: number; // Ajout
    bankInfoMasked: string; // Ajout
    suspensionReason?: string; // Ajout pour l'état initial
};

type ProductListing = {
    id: string;
    name: string;
    stock: number;
    price: number;
    lastUpdate: string;
    status: 'live' | 'archived' | 'draft';
};

type AuditEntry = {
    action: string;
    admin: string;
    date: string;
};

// --- DONNÉES FICTIVES ENRICHIES ---
const mockProducers: Producer[] = [
    {
        id: 'PROD-001',
        name: 'Ferme Bio Alpha',
        location: 'Thiès, Zone Agricole, Lot 10',
        email: 'alpha@ferme.com',
        phone: '+221 77 987 65 43',
        status: 'active',
        productsCount: 15,
        totalOrders: 120,
        registrationDate: '12/01/2024',
        lastProfileUpdate: '10/12/2025', // Nouveau
        totalRevenue: 5250000, // Nouveau
        bankInfoMasked: 'RIB: **** 1234 5678', // Nouveau
    },
    {
        id: 'PROD-002',
        name: 'Coopérative Niayes',
        location: 'Dakar, Grande Niaye',
        email: 'niayes@coop.org',
        phone: '+221 70 123 45 67',
        status: 'pending',
        productsCount: 0,
        totalOrders: 0,
        registrationDate: '25/11/2025',
        lastProfileUpdate: '25/11/2025', // Nouveau
        totalRevenue: 0, // Nouveau
        bankInfoMasked: 'RIB: **** 9012 3456', // Nouveau
    },
];

const mockProducts: ProductListing[] = [
    { id: 'PROD_ITM-01', name: 'Tomates Fraîches', stock: 150, price: 500, lastUpdate: 'Il y a 2h', status: 'live' },
    { id: 'PROD_ITM-02', name: 'Sacs de Maïs', stock: 50, price: 12500, lastUpdate: 'Hier', status: 'live' },
];

const mockAudit: AuditEntry[] = [
    { action: 'Création du compte', admin: 'Système', date: '12/01/2024 09:00' },
    { action: 'Validation email', admin: 'Système', date: '12/01/2024 09:05' },
    { action: 'Changement de statut: PENDING -> ACTIVE', admin: 'Admin Alpha', date: '15/01/2024 14:30' },
    { action: 'Mise à jour des coordonnées bancaires', admin: 'Ferme Bio Alpha', date: '01/12/2025 11:45' },
];

// --- HELPERS (maintenus pour le style) ---

const getStatusBadge = (status: ProducerStatus) => {
    switch (status) {
        case 'active':
            return <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">ACTIF</span>;
        case 'pending':
            return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-sm">EN ATTENTE</span>;
        case 'suspended':
            return <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm">SUSPENDU</span>;
        case 'verified':
            return <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">VÉRIFIÉ</span>;
    }
};

const getProductStatusBadge = (status: ProductListing['status']) => {
    switch (status) {
        case 'live':
            return <span className="text-xs font-medium text-green-600">En ligne</span>;
        case 'archived':
            return <span className="text-xs font-medium text-red-600">Stock épuisé</span>;
        case 'draft':
            return <span className="text-xs font-medium text-gray-500">Brouillon</span>;
    }
}

// --- MODALE POUR L'ACTION DE STATUT ---

const StatusActionModal: React.FC<{
    action: 'suspend' | 'reject';
    producerName: string;
    onConfirm: (reason: string) => void;
    onClose: () => void;
}> = ({ action, producerName, onConfirm, onClose }) => {
    const [reason, setReason] = useState('');

    const actionText = action === 'suspend' ? 'Suspension' : 'Rejet/Résiliation';
    const buttonClass = action === 'suspend' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{actionText} du Compte</h3>
                <p className="text-gray-600 mb-4">Veuillez fournir une raison obligatoire pour la **{actionText.toLowerCase()}** de {producerName}.</p>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder={`Raison de ${actionText.toLowerCase()} (Ex: Non-conformité, litige, documents manquants...)`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Annuler
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={reason.length < 10}
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

export default function ProducerDetailPage({ params }: { params: Promise<{ producerId: string }> }) {
    const router = useRouter();
    
    // Déballage de la Promise params (spécifique à l'App Router pour les Client Components)
    const { producerId } = use(params);

    const initialProducer = mockProducers.find(p => p.id === producerId);
    
    const [producer, setProducer] = useState(initialProducer);
    const [isBankInfoVisible, setIsBankInfoVisible] = useState(false); // État pour l'information sensible
    const [modal, setModal] = useState<'suspend' | 'reject' | null>(null);

    if (!producer) {
        return (
            <div className="p-6 text-center text-gray-500">
                <FaUserCog className="text-6xl mx-auto mb-4" />
                <h1 className="text-xl font-bold">Producteur non trouvé</h1>
                <button onClick={() => router.back()} className="mt-4 text-green-700 flex items-center mx-auto">
                    <FaChevronLeft className="mr-1" /> Retour à la liste
                </button>
            </div>
        );
    }

    // --- LOGIQUE D'ACTION ENRICHIE ---

    const handleConfirmStatusChange = (newStatus: 'active' | 'suspended', reason: string) => {
        if (newStatus === 'suspended' && reason.length < 10) return; 

        // 1. Simuler l'appel API de mise à jour du statut avec raison
        console.log(`[API CALL] Update status for ${producer.id} to ${newStatus.toUpperCase()}. Reason: ${reason}`);
        
        // 2. Mise à jour de l'état local
        setProducer(p => p ? { 
            ...p, 
            status: newStatus,
            suspensionReason: newStatus === 'suspended' ? reason : undefined
        } : null);
        
        // 3. Simuler l'ajout à l'audit
        const auditAction = newStatus === 'active' ? 'Activation du compte' : `Suspension du compte (Raison: ${reason.substring(0, 30)}...)`;
        mockAudit.push({
            action: auditAction, 
            admin: 'Admin Current', 
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        });

        alert(`Statut de ${producer.name} mis à jour vers ${newStatus.toUpperCase()} (Simulé).`);
        setModal(null);
    };


    const handleDelete = () => {
        if (window.confirm(`ATTENTION : Voulez-vous vraiment SUPPRIMER le compte de ${producer.name} ? Cette action est irréversible et entrainera la suppression de tous les produits associés.`)) {
            // Logique API de suppression
            alert(`Compte ${producer.name} supprimé (Simulé).`);
            router.push('/admin/producers');
        }
    };
    
    const handlePasswordReset = () => {
        if (window.confirm(`Confirmer la réinitialisation du mot de passe pour ${producer.name} ? Un email sera envoyé au producteur.`)) {
            alert(`Réinitialisation du mot de passe de ${producer.name} initiée (Simulée).`);
        }
    };


    // --- RENDU DES ACTIONS DE STATUT ---
    const renderStatusActions = () => {
        return (
            <div className="flex gap-3 mt-4 flex-wrap">
                {/* ACTIVER/VÉRIFIER */}
                {(producer.status !== 'active' && producer.status !== 'verified') && (
                    <button 
                        onClick={() => handleConfirmStatusChange('active', 'Validation administrative du compte.')}
                        className="flex-1 min-w-[120px] py-2 px-3 rounded-lg bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-1 hover:bg-green-700 active:scale-[0.98]"
                    >
                        <FaCheckCircle /> Activer & Valider
                    </button>
                )}
                
                {/* SUSPENDRE */}
                {(producer.status === 'active' || producer.status === 'verified') && (
                    <button 
                        onClick={() => setModal('suspend')}
                        className="flex-1 min-w-[120px] py-2 px-3 rounded-lg bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-1 hover:bg-orange-700 active:scale-[0.98]"
                    >
                        <FaTimesCircle /> Suspendre
                    </button>
                )}
                 
                {/* RÉSILIATION/REJET (pour les comptes en attente ou suspendus) */}
                {(producer.status === 'pending' || producer.status === 'suspended') && (
                    <button 
                        onClick={() => setModal('reject')}
                        className="flex-1 min-w-[120px] py-2 px-3 rounded-lg bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-1 hover:bg-red-700 active:scale-[0.98]"
                    >
                        <FaTimesCircle /> Résilier/Rejeter
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 pb-6">
            
            {/* MODAL (s'affiche au-dessus de tout) */}
            {modal && (
                <StatusActionModal
                    action={modal}
                    producerName={producer.name}
                    onClose={() => setModal(null)}
                    onConfirm={(reason) => handleConfirmStatusChange(modal === 'reject' ? 'suspended' : 'active', reason)}
                />
            )}

            {/* 1. HEADER & STATUT */}
            <div className="bg-white p-4 sticky top-16 md:top-20 z-10 shadow-sm border-b border-gray-100">
                <button 
                    onClick={() => router.back()} 
                    className="text-green-700 font-medium flex items-center mb-4 active:scale-95 transition-transform"
                >
                    <FaChevronLeft className="mr-1" /> Retour à la liste
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-1">{producer.name}</h1>
                        <p className="text-gray-500 text-sm">ID: {producer.id}</p>
                    </div>
                    {getStatusBadge(producer.status)}
                </div>
                {producer.suspensionReason && producer.status === 'suspended' && (
                     <p className="text-sm mt-2 p-2 bg-red-50 text-red-700 border-l-4 border-red-400">
                        **Raison de la suspension :** {producer.suspensionReason}
                    </p>
                )}
                {renderStatusActions()}
            </div>

            <div className="p-4 space-y-6">

                {/* 2. SECTION INFORMATIONS DE CONTACT ET BANCAIRES */}
                <Section title="Informations de Contact et Administration" icon={FaUserCog}>
                    <InfoRow icon={FaPhone} label="Téléphone" value={producer.phone} isLink={`tel:${producer.phone}`} />
                    <InfoRow icon={FaEnvelope} label="Email" value={producer.email} isLink={`mailto:${producer.email}`} />
                    <InfoRow icon={FaMapMarkerAlt} label="Localisation" value={producer.location} />
                    <InfoRow icon={FaCalendarAlt} label="Inscrit depuis le" value={producer.registrationDate} />
                    <InfoRow icon={FaHistory} label="Dernière MAJ profil" value={producer.lastProfileUpdate} />

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center py-3">
                            <div className="flex items-center gap-3">
                                <FaReceipt className="text-lg text-gray-400 w-8" />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Informations Bancaires/Fiscales</p>
                                    <p className="text-base font-semibold text-gray-800">{isBankInfoVisible ? producer.bankInfoMasked.replace(/\*/g, '') : producer.bankInfoMasked}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsBankInfoVisible(!isBankInfoVisible)}
                                className={`text-xs px-3 py-1 rounded-full font-bold ${isBankInfoVisible ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}
                            >
                                {isBankInfoVisible ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                    </div>
                </Section>
                
                {/* 3. SECTION STATISTIQUES CLÉS ET FINANCES */}
                <Section title="Statistiques Clés et Finances" icon={FaChartLine}>
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <StatCard icon={FaWarehouse} value={producer.productsCount} label="Produits listés" color="blue" />
                        <StatCard icon={FaShoppingCart} value={producer.totalOrders} label="Commandes totales" color="green" />
                        <StatCard icon={FaMoneyBillWave} value={producer.totalRevenue.toLocaleString()} label="Chiffre d'Affaires total (F CFA)" color="purple" isCurrency={true} />
                        <StatCard icon={FaCheckCircle} value={'5/5'} label="Note Moyenne" color="yellow" />
                    </div>
                </Section>

                {/* 4. LISTE DES PRODUITS (Aperçu) */}
                <Section title={`Catalogue des Produits (${mockProducts.length})`} icon={FaWarehouse}>
                    <div className="space-y-3">
                        {mockProducts.map((product) => (
                            <Link 
                                key={product.id} 
                                href={`/admin/stock/${product.id}`}
                                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors p-1 -m-1 rounded"
                            >
                                <div className="text-gray-900">
                                    <span className="font-bold">{product.name}</span>
                                    <span className="block text-xs text-gray-500">Stock: {product.stock > 0 ? `${product.stock} unités` : 'Épuisé'}</span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                    <div>
                                        <span className="font-bold text-gray-800 block">{product.price.toLocaleString()} F</span>
                                        {getProductStatusBadge(product.status)}
                                    </div>
                                    <FaChevronRight className="text-gray-400 text-xs" />
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                           <Link href={`/admin/stock?producerId=${producer.id}`} className="text-sm text-green-700 font-medium hover:underline flex items-center justify-center gap-1">
                                Voir le catalogue complet du producteur <FaChevronRight className="text-xs" />
                            </Link>
                    </div>
                </Section>

                {/* 5. HISTORIQUE & AUDIT */}
                <Section title="Historique des Actions Administrateur" icon={FaHistory}>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {[...mockAudit].reverse().map((entry, index) => (
                            <div key={index} className="text-xs p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="font-bold text-gray-800 block">{entry.action}</span>
                                <span className="text-gray-500 italic">Par {entry.admin} le {entry.date}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 6. ACTIONS DANGEREUSES & SÉCURITÉ */}
                <Section title="Sécurité et Actions Dangereuses" icon={FaLockOpen}>
                    <ActionRow 
                        icon={FaLockOpen} 
                        label="Réinitialiser le Mot de Passe" 
                        color="blue" 
                        onClick={handlePasswordReset} 
                        description="Envoie un lien de réinitialisation sécurisé au producteur."
                    />
                    <ActionRow 
                        icon={FaTrashAlt} 
                        label="Supprimer le Compte Producteur" 
                        color="red" 
                        onClick={handleDelete} 
                        description="Action irréversible. Supprime tous les produits et données."
                    />
                </Section>

            </div>
        </div>
    );
}

// --- COMPOSANTS UTILITAIRES (Mis à jour/ajoutés) ---

type InfoRowProps = {
    icon: React.ElementType;
    label: string;
    value: string;
    isLink?: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, isLink }) => (
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
                <p className="text-base font-semibold text-gray-800">{value}</p>
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

type StatCardProps = {
    icon: React.ElementType;
    value: string | number;
    label: string;
    color: 'blue' | 'green' | 'purple' | 'yellow';
    isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, color, isCurrency = false }) => {
    const colorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        yellow: 'text-yellow-600',
    };
    return (
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <Icon className={`text-2xl ${colorClasses[color]} mx-auto mb-1`} />
            <span className={`block text-xl font-black ${isCurrency ? 'text-sm' : ''}`}>{value}</span>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    );
}

type ActionRowProps = {
    icon: React.ElementType;
    label: string;
    color: 'red' | 'blue';
    onClick: () => void;
    description: string;
}

const ActionRow: React.FC<ActionRowProps> = ({ icon: Icon, label, color, onClick, description }) => {
    const colorClasses = {
        red: 'text-red-600 hover:bg-red-50',
        blue: 'text-blue-600 hover:bg-blue-50',
    };
    return (
        <button
            onClick={onClick}
            className={`w-full text-left flex justify-between items-center py-3 px-3 -mx-3 rounded-lg font-medium transition-colors border-b border-gray-100 last:border-b-0 ${colorClasses[color]}`}
        >
            <div className="flex items-start gap-3">
                <Icon className={`text-lg mt-1 min-w-[20px] ${colorClasses[color]}`} />
                <div>
                    <span className="font-bold block text-base">{label}</span>
                    <span className="text-xs text-gray-500 block">{description}</span>
                </div>
            </div>
            <FaChevronRight className="text-gray-400 text-sm ml-4" />
        </button>
    );
}