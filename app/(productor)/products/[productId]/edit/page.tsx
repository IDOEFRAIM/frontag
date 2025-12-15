'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaCamera, FaCheck, FaTrash,
  FaSeedling, FaCarrot, FaDrumstickBite, FaBoxOpen, FaTractor, FaPlay, FaSpinner, FaTimes, FaSave
} from 'react-icons/fa';

// Import du composant enfant (Assurez-vous que ce chemin est correct)
import AudioRecorder from '@/components/audio/voiceRecorder'; 

// --- TYPES & CONFIGURATION ---
const MAX_IMAGES = 3; 
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

type Step = 1 | 2 | 3 | 4 | 5;

interface ExistingImage {
  url: string;
  filename: string;
}

interface FormDataState {
  category: string;
  categoryLabel: string;
  existingImages: ExistingImage[]; 
  newImages: File[]; 
  newImagePreviews: string[]; 
  price: string;
  unit: string;
  quantity: string;
  audioBlob: Blob | null; 
  existingAudioUrl: string | null; 
}

// Catégories
const CATEGORIES = [
  { id: 'cereales', label: 'Céréales', icon: <FaSeedling />, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'legumes', label: 'Légumes', icon: <FaCarrot />, color: 'bg-green-100 text-green-700' },
  { id: 'animaux', label: 'Animaux', icon: <FaDrumstickBite />, color: 'bg-red-100 text-red-700' },
  { id: 'transforme', label: 'Transformé', icon: <FaBoxOpen />, color: 'bg-purple-100 text-purple-700' },
  { id: 'outils', label: 'Outils', icon: <FaTractor />, color: 'bg-blue-100 text-blue-700' },
];

// --- Simulation API ---
const fetchProductData = async (id: string): Promise<FormDataState | null> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simuler latence
  
  if (id === 'p001') {
    const categoryData = CATEGORIES.find(c => c.id === 'legumes') || CATEGORIES[0];
    return {
      category: categoryData.id,
      categoryLabel: categoryData.label,
      price: '350', 
      unit: 'kg',
      quantity: '55',
      existingImages: [
        { url: 'https://placehold.co/400x400/orange/white?text=Tomate+1', filename: 'tomate-1.jpg' },
        { url: 'https://placehold.co/400x400/red/white?text=Tomate+2', filename: 'tomate-2.jpg' },
      ],
      newImages: [],
      newImagePreviews: [],
      existingAudioUrl: null, // Mettre une URL ici pour tester le lecteur audio
      audioBlob: null,
    };
  }
  return null;
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id: productId } = params;
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation de l'état
  const [formData, setFormData] = useState<FormDataState>({
    category: '',
    categoryLabel: '',
    existingImages: [],
    newImages: [],
    newImagePreviews: [],
    price: '',
    unit: 'sac',
    quantity: '',
    audioBlob: null,
    existingAudioUrl: null,
  });

  // --- CHARGEMENT ---
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchProductData(productId).then(data => {
      if (!isMounted) return;
      if (data) {
        setFormData(data);
      } else {
        alert("Produit non trouvé.");
        router.push('/products');
      }
      setIsLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      alert("Erreur de chargement des données.");
      router.push('/products');
      setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [productId, router]);

  // --- NETTOYAGE DES URLs ---
  useEffect(() => {
    // Nettoyer les URLs locales quand le composant est démonté ou que les images changent
    return () => {
      formData.newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData.newImagePreviews]);

  // --- NAVIGATION ---
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    } else {
      router.back();
    }
  };

  // --- HANDLERS ---
  const handleCategorySelect = (id: string, label: string) => {
    setFormData(prev => ({ ...prev, category: id, categoryLabel: label }));
    setStep(2);
  };

  const preventNegativeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['-', 'e', '+'].includes(e.key)) e.preventDefault();
  };

  // Gestion Images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    const totalImages = formData.existingImages.length + formData.newImages.length;

    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg("Format non supporté (JPG, PNG, WebP).");
        return;
      }
      if (totalImages >= MAX_IMAGES) {
        setErrorMsg(`Maximum ${MAX_IMAGES} photos autorisées.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, file],
        newImagePreviews: [...prev.newImagePreviews, previewUrl]
      }));
      e.target.value = ''; // Reset input
    }
  };

  const removeNewImage = (index: number) => {
    const newImages = [...formData.newImages];
    const newPreviews = [...formData.newImagePreviews];
    
    // Important: libérer la mémoire
    URL.revokeObjectURL(newPreviews[index]); 
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData(prev => ({ ...prev, newImages: newImages, newImagePreviews: newPreviews }));
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = [...formData.existingImages];
    newExistingImages.splice(index, 1);
    setFormData(prev => ({ ...prev, existingImages: newExistingImages }));
  };

  // Gestion Audio
  const handleAudioComplete = useCallback((blob: Blob) => {
    setFormData(prev => ({ 
      ...prev, 
      audioBlob: blob, 
      // On ne met pas existingAudioUrl à null ici pour permettre à l'utilisateur de changer d'avis ("Annuler")
      // Mais visuellement, on montrera que le nouveau remplace l'ancien
    }));
  }, []);

  const clearNewAudio = () => {
     setFormData(prev => ({ ...prev, audioBlob: null }));
  }

  const deleteExistingAudio = () => {
    if(confirm("Voulez-vous vraiment supprimer la description vocale existante ?")) {
        setFormData(prev => ({ ...prev, existingAudioUrl: null }));
    }
  };

  // --- SOUMISSION ---
  const handleUpdate = async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      
      dataToSend.append('id', productId);
      dataToSend.append('category', formData.category);
      dataToSend.append('price', formData.price);
      dataToSend.append('quantity', formData.quantity);
      dataToSend.append('unit', formData.unit);
      
      // Images à garder
      const filenamesToKeep = formData.existingImages.map(img => img.filename).join(',');
      dataToSend.append('existing_images_to_keep', filenamesToKeep);

      // Nouvelles images
      formData.newImages.forEach((file) => {
        dataToSend.append('new_images', file);
      });

      // Logique Audio
      if (formData.audioBlob) {
        dataToSend.append('audio_update', 'REPLACE');
        dataToSend.append('audio_file', formData.audioBlob, 'voice_desc.webm');
      } else if (formData.existingAudioUrl) {
        dataToSend.append('audio_update', 'KEEP'); 
      } else {
        dataToSend.append('audio_update', 'DELETE');
      }

      // Simulation de l'appel API
      console.log("Données envoyées:", Object.fromEntries(dataToSend));
      await new Promise(resolve => setTimeout(resolve, 1500)); // Faux délai réseau

      // Redirection après succès
      router.push('/products');

    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDU PARTIEL ---
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <FaSpinner className="animate-spin text-5xl text-green-600 mb-4" />
        <p className="text-gray-600 font-medium">Chargement du produit...</p>
      </div>
    );
  }

  const totalImages = formData.existingImages.length + formData.newImages.length;

  // --- ÉTAPES ---

  // ÉTAPE 1
  const renderStep1 = () => (
    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategorySelect(cat.id, cat.label)}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95 ${
            formData.category === cat.id 
              ? 'border-green-600 bg-green-50 ring-2 ring-green-200 shadow-md' 
              : 'border-gray-100 bg-white hover:border-green-200 hover:shadow-sm'
          }`}
        >
          <div className={`text-3xl mb-3 p-3 rounded-full ${cat.color}`}>{cat.icon}</div>
          <span className="font-bold text-gray-700 text-sm">{cat.label}</span>
        </button>
      ))}
    </div>
  );

  // ÉTAPE 2
  const renderStep2 = () => (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-300">
      {errorMsg && (
        <div className="w-full bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold text-center flex items-center justify-center gap-2">
           <FaTimes /> {errorMsg}
        </div>
      )}
      
      <div className="w-full flex justify-between items-end mb-2">
          <label className="text-sm font-bold text-gray-700">Vos photos</label>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${totalImages === MAX_IMAGES ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
            {totalImages} / {MAX_IMAGES}
          </span>
      </div>

      <div className="w-full grid grid-cols-3 gap-3 mb-6">
        {/* Images Existantes */}
        {formData.existingImages.map((img, index) => (
          <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-500 shadow-md group">
            <img src={img.url} alt={`Produit ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <button 
              onClick={() => removeExistingImage(index)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition-colors"
            >
              <FaTimes size={10} />
            </button>
            <span className="absolute bottom-1 left-1 bg-green-600 text-[10px] text-white px-1.5 py-0.5 rounded shadow-sm">Déjà en ligne</span>
          </div>
        ))}

        {/* Nouvelles Images */}
        {formData.newImagePreviews.map((url, index) => (
          <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-400 shadow-md">
            <img src={url} alt={`New ${index}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => removeNewImage(index)}
              className="absolute top-1 right-1 bg-white text-red-500 p-1.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <FaTrash size={10} />
            </button>
            <span className="absolute bottom-1 left-1 bg-blue-500 text-[10px] text-white px-1.5 py-0.5 rounded shadow-sm">Nouveau</span>
          </div>
        ))}
        
        {/* Bouton Ajouter */}
        {totalImages < MAX_IMAGES && (
          <label className="w-full h-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer aspect-square group">
            <FaCamera className="text-2xl text-gray-400 group-hover:text-gray-600 mb-1 transition-colors" />
            <span className="text-gray-400 text-xs font-medium group-hover:text-gray-600">Ajouter</span>
            <input 
              type="file" 
              accept={ALLOWED_TYPES.join(',')}
              capture="environment" 
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      <button
        disabled={totalImages === 0}
        onClick={() => setStep(3)}
        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
      >
        Continuer
      </button>
    </div>
  );

  // ÉTAPE 3
  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Quantité</label>
        <div className="flex gap-3">
          <input 
            type="number" 
            min="0"
            onKeyDown={preventNegativeInput}
            value={formData.quantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || Number(val) >= 0) setFormData(prev => ({...prev, quantity: val}));
            }}
            placeholder="0"
            className="flex-1 text-3xl font-bold p-3 text-center border-b-2 border-gray-200 focus:border-green-500 focus:outline-none bg-transparent transition-colors"
          />
          <select 
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({...prev, unit: e.target.value}))}
            className="bg-gray-100 font-bold rounded-xl px-4 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="sac">Sacs</option>
            <option value="kg">Kilos</option>
            <option value="tonnes">Tonnes</option>
            <option value="unite">Unités</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Prix ({formData.unit})</label>
        <div className="relative">
          <input 
            type="number" 
            min="0"
            onKeyDown={preventNegativeInput}
            value={formData.price}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || Number(val) >= 0) setFormData(prev => ({...prev, price: val}));
            }}
            placeholder="0"
            className="w-full text-3xl font-bold p-3 pr-16 text-center border-b-2 border-gray-200 focus:border-green-500 focus:outline-none bg-transparent transition-colors"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">FCFA</span>
        </div>
      </div>

      <button
        disabled={!formData.price || !formData.quantity || Number(formData.quantity) <= 0 || Number(formData.price) <= 0}
        onClick={() => setStep(4)}
        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all mt-4"
      >
        Continuer
      </button>
    </div>
  );

  // ÉTAPE 4
  const renderStep4 = () => (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-8 duration-300">
      
      {/* SECTION AUDIO EXISTANT */}
      {(formData.existingAudioUrl && !formData.audioBlob) && (
        <div className="w-full bg-white border border-blue-100 p-4 rounded-xl shadow-sm mb-6">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 text-left">Description actuelle</p>
            
            <audio controls className="w-full mb-3 h-8">
                <source src={formData.existingAudioUrl} type="audio/webm" />
                <source src={formData.existingAudioUrl} type="audio/mp3" />
                Votre navigateur ne supporte pas l'audio.
            </audio>

            <button 
                onClick={deleteExistingAudio}
                className="w-full py-2 text-red-500 text-sm font-medium border border-red-100 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
            >
                <FaTrash size={12} /> Supprimer cet audio
            </button>
        </div>
      )}

      {/* SECTION NOUVEL ENREGISTREMENT */}
      <div className="w-full mb-8">
          {formData.audioBlob ? (
               <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col items-center gap-3">
                   <div className="flex items-center gap-2 text-green-700 font-bold">
                       <FaCheck className="bg-green-700 text-white rounded-full p-1 text-xl" />
                       Nouveau vocal prêt !
                   </div>
                   <button onClick={clearNewAudio} className="text-sm text-gray-500 underline">Annuler et recommencer</button>
               </div>
          ) : (
            <>
                <p className="text-lg font-bold text-gray-800 mb-2">
                    {formData.existingAudioUrl ? "Remplacer la description ?" : "Ajouter une description vocale"}
                </p>
                <p className="text-gray-500 text-sm mb-6">Parlez de la qualité, de la provenance...</p>
                
                <div className="flex justify-center">
                    <AudioRecorder onRecordingComplete={handleAudioComplete} />
                </div>
            </>
          )}
      </div>

      <div className="flex gap-3 w-full mt-auto">
        <button 
          onClick={() => setStep(5)} 
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              formData.audioBlob 
                ? 'bg-gray-100 text-gray-600' 
                : 'bg-green-700 text-white shadow-lg hover:bg-green-800'
          }`}
        >
          {formData.audioBlob ? 'Passer' : 'Terminer'}
        </button>
        
        {formData.audioBlob && (
          <button 
            onClick={() => setStep(5)} 
            className="flex-1 bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-800"
          >
            Valider
          </button>
        )}
      </div>
    </div>
  );

  // ÉTAPE 5
  const renderStep5 = () => (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        {/* Galerie Finale */}
        <div className="h-56 bg-gray-100 flex overflow-x-auto snap-x scrollbar-hide">
             {[...formData.existingImages.map(img => img.url), ...formData.newImagePreviews].map((src, i) => (
                <div key={i} className="min-w-full snap-center relative">
                    <img src={src} className="w-full h-full object-cover" alt={`Produit ${i}`}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
            ))}
            {totalImages === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FaCamera className="text-4xl mb-2 opacity-50" />
                    <span>Pas de photo</span>
                </div>
            )}
        </div>
        
        {/* Indicateur nombre photos */}
        {totalImages > 1 && (
             <div className="flex justify-center gap-1 -mt-4 relative z-10 pb-4">
                 {[...Array(totalImages)].map((_, i) => (
                     <div key={i} className="w-2 h-2 rounded-full bg-white/80 shadow-sm" />
                 ))}
             </div>
        )}

        <div className="p-6 pt-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-1 ${
                  CATEGORIES.find(c => c.id === formData.category)?.color
              }`}>
                  {formData.categoryLabel}
              </span>
              <h2 className="text-3xl font-black text-gray-800">
                {formData.quantity} <span className="text-lg text-gray-500 font-medium">{formData.unit}</span>
              </h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">{Number(formData.price || '0').toLocaleString()} F</p>
              <p className="text-xs text-gray-400">l'unité</p>
            </div>
          </div>

          <div className="space-y-3">
              {/* Récap Audio */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className={`p-2 rounded-full ${
                      formData.audioBlob ? 'bg-green-100 text-green-600' : 
                      formData.existingAudioUrl ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'
                  }`}>
                      {formData.audioBlob || formData.existingAudioUrl ? <FaPlay size={12} /> : <FaTimes size={12} />}
                  </div>
                  <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700">Description vocale</p>
                      <p className="text-xs text-gray-500">
                          {formData.audioBlob ? "Nouvel enregistrement prêt" : 
                           formData.existingAudioUrl ? "Audio original conservé" : "Aucune description"}
                      </p>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleUpdate}
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
            ${isSubmitting 
                ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }
        `}
      >
        {isSubmitting ? (
          <>
            <FaSpinner className="animate-spin" /> Mise à jour en cours...
          </>
        ) : (
          <>
            <FaSave /> Enregistrer les modifications
          </>
        )}
      </button>
    </div>
  );

  // --- RENDU PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header Sticky */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4 mb-3">
          <button 
            onClick={handleBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            disabled={isSubmitting}
            aria-label="Retour"
          >
            <FaArrowLeft />
          </button>
          <h1 className="font-bold text-lg text-gray-800 line-clamp-1">
            Modifier Produit
          </h1>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto min-h-[calc(100vh-100px)] flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {step === 1 && "Choisir la catégorie"}
          {step === 2 && "Gérer les photos"}
          {step === 3 && "Définir Prix & Stock"}
          {step === 4 && "Description vocale"}
          {step === 5 && "Récapitulatif"}
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