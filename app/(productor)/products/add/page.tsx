'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaCamera, FaCheck, FaTrash,
  FaSeedling, FaCarrot, FaDrumstickBite, FaBoxOpen, FaTractor, FaPlay, FaSpinner
} from 'react-icons/fa';

// Import du composant enfant
import AudioRecorder from '@/components/audio/voiceRecorder'; 

// --- CONFIGURATION ---
const MAX_IMAGES = 3; 
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

type Step = 1 | 2 | 3 | 4 | 5;

const CATEGORIES = [
  { id: 'cereales', label: 'Céréales', icon: <FaSeedling />, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'legumes', label: 'Légumes', icon: <FaCarrot />, color: 'bg-green-100 text-green-700' },
  { id: 'animaux', label: 'Animaux', icon: <FaDrumstickBite />, color: 'bg-red-100 text-red-700' },
  { id: 'transforme', label: 'Transformé', icon: <FaBoxOpen />, color: 'bg-purple-100 text-purple-700' },
  { id: 'outils', label: 'Outils', icon: <FaTractor />, color: 'bg-blue-100 text-blue-700' },
];

export default function AddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Nouvel état pour gérer le chargement pendant l'envoi
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ÉTAT DU FORMULAIRE ---
  const [formData, setFormData] = useState({
    category: '',
    categoryLabel: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    price: '',
    unit: 'sac',
    quantity: '',
    audioBlob: null as Blob | null,
  });

  // --- HANDLERS ---

  const handleCategorySelect = (id: string, label: string) => {
    setFormData({ ...formData, category: id, categoryLabel: label });
    setStep(2);
  };

  // Gestion sécurisée des Images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Format non supporté. Utilisez JPG ou PNG.");
        return;
      }

      if (formData.images.length >= MAX_IMAGES) {
        setErrorMsg(`Maximum ${MAX_IMAGES} photos autorisées.`);
        return;
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, file],
        imagePreviews: [...prev.imagePreviews, URL.createObjectURL(file)]
      }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const newPreviews = [...formData.imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Nettoyage mémoire
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, images: newImages, imagePreviews: newPreviews });
  };

  // Sécurité Inputs Numériques
  const preventNegativeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', 'e', '+'].includes(e.key)) e.preventDefault();
  };

  // --- MISE EN VENTE RÉELLE ---
  const handleSave = async () => {
    if (isSubmitting) return; // Empêche le double-clic
    setIsSubmitting(true);

    try {
        const dataToSend = new FormData();
        
        // Ajout des champs texte
        dataToSend.append('category', formData.category);
        dataToSend.append('categoryLabel', formData.categoryLabel);
        dataToSend.append('price', formData.price);
        dataToSend.append('quantity', formData.quantity);
        dataToSend.append('unit', formData.unit);

        // Ajout des images
        formData.images.forEach((file) => {
            dataToSend.append('images', file);
        });

        // Ajout de l'audio (s'il existe)
        if (formData.audioBlob) {
            // On nomme le fichier audio explicitement
            dataToSend.append('audio', formData.audioBlob, 'voice_description.webm');
        }

        // Appel API
        const response = await fetch('/api/products/create', {
            method: 'POST',
            body: dataToSend,
        });

        if (response.ok) {
            // ✅ Succès : Redirection vers la bonne page (productor/products)
            router.push('/products');
        } else {
            throw new Error("Erreur lors de l'enregistrement");
        }

    } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de la mise en ligne.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- RENDU DES ÉTAPES ---

  // ÉTAPE 1 : CATEGORIE
  const renderStep1 = () => (
    <div className="grid grid-cols-2 gap-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategorySelect(cat.id, cat.label)}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 ${
            formData.category === cat.id 
              ? 'border-green-600 bg-green-50 ring-2 ring-green-200' 
              : 'border-gray-100 bg-white hover:border-green-200'
          }`}
        >
          <div className={`text-3xl mb-3 p-3 rounded-full ${cat.color}`}>{cat.icon}</div>
          <span className="font-bold text-gray-700 text-sm">{cat.label}</span>
        </button>
      ))}
    </div>
  );

  // ÉTAPE 2 : PHOTOS
  const renderStep2 = () => (
    <div className="flex flex-col items-center">
      {errorMsg && (
        <div className="w-full bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold text-center">
          {errorMsg}
        </div>
      )}

      {formData.images.length < MAX_IMAGES && (
        <div className="w-full h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden mb-6 active:bg-gray-200 transition-colors">
            <FaCamera className="text-4xl text-gray-300 mb-2" />
            <p className="text-gray-400 text-sm">Ajouter une photo ({formData.images.length}/{MAX_IMAGES})</p>
            <input 
              type="file" 
              accept="image/png, image/jpeg"
              capture="environment" 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
        </div>
      )}

      <div className="w-full grid grid-cols-3 gap-2 mb-6">
        {formData.imagePreviews.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-white/80 p-1.5 rounded-full text-red-500 shadow-sm backdrop-blur-sm"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>

      <button
        disabled={formData.images.length === 0}
        onClick={() => setStep(3)}
        className="w-full bg-green-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
      >
        Continuer ({formData.images.length} photos)
      </button>
    </div>
  );

  // ÉTAPE 3 : PRIX & QUANTITÉ (✅ Corrigé)
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-500 mb-2">Quantité disponible</label>
        <div className="flex gap-2">
            <input 
              type="number" 
              min="1"
              onKeyDown={preventNegativeInput}
              value={formData.quantity}
              // ✅ CORRECTION : Autoriser champ vide pour modification
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseInt(val) >= 0) {
                    setFormData({...formData, quantity: val});
                }
              }}
              placeholder="0"
              className="flex-1 text-3xl font-bold p-4 text-center border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <select 
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="bg-gray-100 font-bold rounded-xl px-4 border-r-8 border-transparent"
            >
                <option value="sac">Sacs</option>
                <option value="kg">Kilos</option>
                <option value="tonnes">Tonnes</option>
                <option value="unite">Unités</option>
            </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-500 mb-2">Prix par {formData.unit}</label>
        <div className="relative">
            <input 
              type="number" 
              min="100"
              onKeyDown={preventNegativeInput}
              value={formData.price}
              // ✅ CORRECTION : Autoriser champ vide pour modification
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseInt(val) >= 0) {
                    setFormData({...formData, price: val});
                }
              }}
              placeholder="0"
              className="w-full text-3xl font-bold p-4 text-center border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">FCFA</span>
        </div>
      </div>

      <button
        // On vérifie que les champs ne sont ni vides, ni à zéro
        disabled={!formData.price || !formData.quantity || parseInt(formData.quantity) <= 0}
        onClick={() => setStep(4)}
        className="w-full bg-green-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg mt-4"
      >
        Continuer
      </button>
    </div>
  );

  // ÉTAPE 4 : AUDIO
  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center text-center py-6">
      <div className="mb-6">
        <p className="text-lg font-bold text-gray-800 mb-2">Parlez de votre produit</p>
        <p className="text-gray-500 text-sm">"C'est du maïs blanc bien sec..."</p>
      </div>

      <div className="w-full flex justify-center mb-8">
        <AudioRecorder 
          onRecordingComplete={(blob) => setFormData(prev => ({ ...prev, audioBlob: blob }))} 
        />
      </div>

      {formData.audioBlob && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold mb-6 flex items-center gap-2">
            <FaCheck /> Note vocale prête à l'envoi
        </div>
      )}

      <div className="flex gap-4 w-full mt-4">
        <button 
            onClick={() => {
                setFormData(prev => ({ ...prev, audioBlob: null }));
                setStep(5);
            }} 
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold"
        >
            Passer
        </button>
        
        {formData.audioBlob && (
            <button 
                onClick={() => setStep(5)} 
                className="flex-1 bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg"
            >
                Valider
            </button>
        )}
      </div>
    </div>
  );

  // ÉTAPE 5 : RÉSUMÉ & ENVOI
  const renderStep5 = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Galerie Photos */}
        <div className="h-48 bg-gray-200 flex overflow-x-auto snap-x">
            {formData.imagePreviews.map((src, i) => (
                <img key={i} src={src} className="w-full h-full object-cover flex-shrink-0 snap-center" />
            ))}
        </div>
        
        {formData.images.length > 1 && (
             <p className="text-center text-xs text-gray-400 py-1 bg-gray-50">{formData.images.length} photos</p>
        )}

        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{formData.categoryLabel}</span>
                    <h2 className="text-2xl font-black text-gray-800">
                        {formData.quantity} {formData.unit}
                    </h2>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-green-700">{parseInt(formData.price).toLocaleString()} F</p>
                    <p className="text-xs text-gray-400">l'unité</p>
                </div>
            </div>

            {formData.audioBlob ? (
                <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2 mb-6 text-green-800 text-sm border border-green-200">
                    <FaPlay /> Note vocale incluse
                </div>
            ) : (
                <div className="bg-gray-50 p-3 rounded-lg mb-6 text-gray-500 text-sm italic text-center">
                   Pas de description vocale
                </div>
            )}

            {/* Bouton avec état de chargement */}
            <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-colors
                    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-gray-100' : 'bg-green-700 hover:bg-green-800 text-white'}
                `}
            >
                {isSubmitting ? (
                    <>
                        <FaSpinner className="animate-spin" /> Envoi en cours...
                    </>
                ) : (
                    <>
                        <FaCheck /> Mettre en vente
                    </>
                )}
            </button>
        </div>
    </div>
  );

  // --- RENDU GLOBAL ---
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
            {step > 1 && (
                <button onClick={() => setStep(prev => (prev - 1) as Step)} className="text-gray-500" disabled={isSubmitting}>
                    <FaArrowLeft />
                </button>
            )}
            <h1 className="font-bold text-lg text-gray-800">Nouveau Produityo</h1>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {step === 1 && "Qu'est-ce que vous vendez ?"}
            {step === 2 && "Photos du produit"}
            {step === 3 && "Prix et Quantité"}
            {step === 4 && "Description Vocale"}
            {step === 5 && "Vérifiez avant de publier"}
        </h2>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>
    </div>
  );
}