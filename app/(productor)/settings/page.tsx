'use client';

import React, { useState } from 'react';
import { 
    FaCog, FaUser, FaPhone, FaMapMarkerAlt, 
    FaLock, FaPalette, FaSignOutAlt, FaChevronRight,
    FaEnvelope
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

// --- TYPES ---
type ProducerProfile = {
    name: string;
    email: string;
    phone: string;
    location: string;
    theme: 'light' | 'dark';
};

// --- DONNÉES FICTIVES ---
const mockProfile: ProducerProfile = {
    name: 'Ferme Bio Alpha',
    email: 'contact@fermebioalpha.com',
    phone: '+221 77 987 65 43',
    location: 'Zone Agricole de Thiès, Lot 10',
    theme: 'light',
};

// --- COMPOSANT DE LA PAGE ---

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm<ProducerProfile>({
        defaultValues: mockProfile
    });

    const theme = watch('theme');

    // Simuler la sauvegarde des modifications du profil
    const onSubmit: SubmitHandler<ProducerProfile> = (data) => {
        setIsLoading(true);
        // Simuler un appel API avec data
        console.log("Saving data:", data);
        setTimeout(() => {
            alert("Profil mis à jour avec succès !");
            setIsLoading(false);
        }, 1500);
    };

    // Simuler le changement de thème
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setValue('theme', newTheme);
        // En réalité, vous appliqueriez ici la classe de thème au body/html
        alert(`Thème passé à : ${newTheme}`);
    };

    // Simuler la déconnexion
    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            // Logique de déconnexion (Supprimer le token d'authentification)
            alert("Déconnexion réussie !");
            router.push('/login'); // Rediriger vers la page de connexion
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            
            {/* 1. HEADER */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-2">
                    <FaCog className="text-green-700" /> Paramètres
                </h1>
                <p className="text-gray-500 text-sm">Gérez votre profil et les préférences de l'application</p>
            </div>

            <div className="p-4 space-y-8">

                {/* 2. SECTION PROFIL ET INFORMATIONS */}
                <Section title="Informations du Compte" icon={FaUser}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <InputGroup 
                            label="Nom du producteur/de la ferme" 
                            icon={FaUser} 
                            {...register('name')}
                        />
                         <InputGroup 
                            label="Email" 
                            icon={FaEnvelope} 
                            type="email"
                            {...register('email')}
                        />
                        <InputGroup 
                            label="Téléphone" 
                            icon={FaPhone} 
                            type="tel"
                            {...register('phone')}
                        />
                        <InputGroup 
                            label="Adresse / Localisation" 
                            icon={FaMapMarkerAlt} 
                            {...register('location')}
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-green-700 text-white font-bold rounded-xl shadow-md active:bg-green-800 transition-colors disabled:bg-gray-400"
                        >
                            {isLoading ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
                        </button>
                    </form>
                </Section>
                
                {/* 3. SECTION SÉCURITÉ */}
                <Section title="Sécurité" icon={FaLock}>
                    <SettingItem 
                        label="Changer le mot de passe"
                        onClick={() => alert("Redirection vers la page de changement de mot de passe...")}
                        icon={FaLock}
                    />
                </Section>

                {/* 4. SECTION PRÉFÉRENCES D'AFFICHAGE */}
                <Section title="Affichage" icon={FaPalette}>
                    <div className="flex justify-between items-center py-3">
                        <span className="text-gray-700 font-medium">Mode Sombre (Dark Mode)</span>
                        <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
                    </div>
                </Section>

                {/* 5. ACTIONS DANGEREUSES / DÉCONNEXION */}
                <Section title="Actions" icon={FaSignOutAlt}>
                    <SettingItem 
                        label="Déconnexion"
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

// Composant pour en-tête de section
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

// Composant pour élément de paramètre cliquable
type SettingItemProps = {
    label: string;
    onClick: () => void;
    icon: React.ElementType;
    color?: string;
};

const SettingItem: React.FC<SettingItemProps> = ({ label, onClick, icon: Icon, color = 'text-gray-700' }) => (
    <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-3 transition-colors active:bg-gray-50 rounded-lg -mx-3 px-3"
    >
        <span className={`flex items-center gap-3 font-medium ${color}`}>
            <Icon className="text-lg" /> {label}
        </span>
        <FaChevronRight className="text-gray-400 text-sm" />
    </button>
);

// Composant pour champ de formulaire simple
interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ElementType;
}

const InputGroup = React.forwardRef<HTMLInputElement, InputGroupProps>(({ label, icon: Icon, className, ...props }, ref) => (
    <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
            <Icon className="text-green-600" /> {label}
        </label>
        <input
            ref={ref}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 ${className || ''}`}
            {...props}
        />
    </div>
));
InputGroup.displayName = 'InputGroup';

// Composant pour l'interrupteur (Toggle Switch)
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