import { Config } from 'tailwindcss';

export const themeConfig = {
  colors: {
    // Vert Agricole (Croissance, Succès)
    primary: {
      DEFAULT: '#15803d', // green-700
      light: '#dcfce7',   // green-100
      dark: '#14532d',    // green-900
    },
    // Ardoise Logistique (Sérieux, Structure)
    secondary: {
      DEFAULT: '#0f172a', // slate-900
      light: '#f8fafc',   // slate-50
      muted: '#94a3b8',   // slate-400
    },
    // Indigo Tech (Audio, Numérique)
    accent: {
      DEFAULT: '#4f46e5', // indigo-600
      light: '#e0e7ff',   // indigo-100
    },
    // Alertes
    danger: '#ef4444',    // red-500
    warning: '#f59e0b',   // amber-500
  },
  borderRadius: {
    'organic': '2rem',    // Pour les cartes et conteneurs principaux
    'button': '0.75rem',  // Pour les boutons d'action
  },
  typography: {
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
    },
    fontWeight: {
      black: '900', // Utilisé pour les titres "Industriels"
    }
  }
};

// Guide d'utilisation pour les développeurs
export const StyleGuide = {
  components: {
    card: "bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300",
    button: {
      primary: "bg-slate-900 text-white py-3 px-6 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-green-600 transition-colors",
      secondary: "bg-slate-100 text-slate-900 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors",
      icon: "p-2 rounded-full hover:bg-slate-100 transition-colors",
    },
    badge: {
      success: "bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
      warning: "bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
    },
    text: {
      hero: "text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.8]",
      label: "text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]",
    }
  }
};
