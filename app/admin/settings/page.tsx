'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    FaCog, FaUserShield, FaPalette, FaLock, 
    FaSignOutAlt, FaChevronRight, FaDatabase, FaExchangeAlt,
    FaRegTimesCircle
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// --- TYPES ---
type AdminProfile = {
    name: string;
    role: string;
    theme: 'light' | 'dark';
};

// --- DONNÉES FICTIVES ---
const mockAdminProfile: AdminProfile = {
    name: 'Amadou Diagne (Super Admin)',
    role: 'Superviseur Général',
    theme: 'light',
};

// --- COMPOSANT DE LA PAGE ---

export default function AdminSettingsPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<AdminProfile>(mockAdminProfile);
    const [isLoading, setIsLoading] = useState(false);

    // Simuler le changement de thème
    const toggleTheme = () => {
        const newTheme = profile.theme === 'light' ? 'dark' : 'light';
        setProfile(prev => ({ ...prev, theme: newTheme }));
        alert(`Thème passé à : ${newTheme} (Simulé)`);
    };

    // Simuler une action de maintenance de base de données
    const handleDatabaseMaintenance = () => {
        setIsLoading(true);
        alert("Lancement de l'optimisation des index de la base de données... (Simulé)");
        
        setTimeout(() => {
            alert("Maintenance terminée. 120MB de logs purgés.");
            setIsLoading(false);
        }, 2000);
    };

    // Simuler l'effacement du cache local (utile pour les mises à jour forcées)
    const handleClearLocalCache = () => {
        if (window.confirm("Voulez-vous effacer le cache local (IndexéDB/Service Worker) ? Cela force le re-téléchargement de toutes les données.")) {
             // Dans une implémentation réelle : db.delete() et/ou vider le cache du Service Worker
            alert("Cache local effacé. La page va se recharger. (Simulé)");
            window.location.reload();
        }
    };

    // Simuler la déconnexion
    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter de la console Admin ?")) {
            alert("Déconnexion Admin réussie !");
            router.push('/login'); 
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            
            {/* 1. HEADER */}
            <div className="bg-white p-4 sticky top-16 md:top-20 z-10 shadow-sm border-b border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-2">
                    <FaCog className="text-green-700" /> Paramètres Admin
                </h1>
                <p className="text-gray-500 text-sm">Gestion du compte superviseur et maintenance système</p>
            </div>

            <div className="p-4 space-y-8">

                {/* 2. SECTION PROFIL ADMIN */}
                <Section title="Profil de l'Administrateur" icon={FaUserShield}>
                    <InfoRow icon={FaUserShield} label="Nom/Rôle" value={`${profile.name} (${profile.role})`} />
                    <InfoRow icon={FaLock} label="Sécurité" value="Changer le mot de passe" isLink='/admin/password-reset' />
                </Section>
                
                {/* 3. SECTION PRÉFÉRENCES D'AFFICHAGE */}
                <Section title="Affichage" icon={FaPalette}>
                    <div className="flex justify-between items-center py-3">
                        <span className="text-gray-700 font-medium">Mode Sombre (Dark Mode)</span>
                        <ToggleSwitch checked={profile.theme === 'dark'} onChange={toggleTheme} />
                    </div>
                </Section>

                {/* 4. MAINTENANCE ET OUTILS SYSTÈMES */}
                <Section title="Outils de Résilience et Maintenance" icon={FaDatabase}>
                    <SettingItem 
                        label="Lancer la Maintenance Serveur"
                        onClick={handleDatabaseMaintenance}
                        icon={FaExchangeAlt}
                        disabled={isLoading}
                        description={isLoading ? 'Optimisation en cours...' : 'Optimisation des tables et purge des logs non critiques.'}
                    />
                    <SettingItem 
                        label="Vider le Cache Local"
                        onClick={handleClearLocalCache}
                        icon={FaRegTimesCircle}
                        color="text-red-600"
                        description="Force le re-téléchargement de tous les catalogues et images."
                    />
                </Section>

                {/* 5. ACTIONS DANGEREUSES / DÉCONNEXION */}
                <Section title="Session" icon={FaSignOutAlt}>
                    <SettingItem 
                        label="Déconnexion de la Console"
                        onClick={handleLogout}
                        icon={FaSignOutAlt}
                        color="text-red-600"
                    />
                </Section>

            </div>
        </div>
    );
}

// --- COMPOSANTS UTILITAIRES ---

type SectionProps = {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3 border-gray-100">
            <Icon className="text-green-600" /> {title}
        </h2>
        {children}
    </div>
);

type InfoRowProps = {
    icon: React.ElementType;
    label: string;
    value: string;
    isLink?: string;
};

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, isLink }) => (
    <div className="flex items-center border-b pb-3 border-gray-100 last:border-b-0">
        <Icon className="text-lg text-gray-400 w-8" />
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            {isLink ? (
                <Link href={isLink} className="text-base font-semibold text-green-700 hover:underline">
                    {value}
                </Link>
            ) : (
                <p className="text-base font-semibold text-gray-800">{value}</p>
            )}
        </div>
    </div>
);

type SettingItemProps = {
    label: string;
    onClick: () => void;
    icon: React.ElementType;
    color?: string;
    disabled?: boolean;
    description?: string;
};

const SettingItem: React.FC<SettingItemProps> = ({ label, onClick, icon: Icon, color = 'text-gray-700', disabled = false, description }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex justify-between items-center py-3 transition-colors rounded-lg -mx-3 px-3 
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-[0.99]'} 
            ${color}`}
    >
        <div className="flex items-center gap-3">
            <Icon className="text-lg" /> 
            <div>
                 <span className={`font-medium block ${color}`}>{label}</span>
                 {description && <span className="text-xs text-left block text-gray-500">{description}</span>}
            </div>
        </div>
        {!disabled && <FaChevronRight className="text-gray-400 text-sm" />}
    </button>
);

type ToggleSwitchProps = {
    checked: boolean;
    onChange: () => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div 
            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] peer-checked:after:bg-white after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
        ></div>
    </label>
);