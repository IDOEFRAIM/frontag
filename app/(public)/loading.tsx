// app/checkout/success/loading.tsx
'use client'
export default function Loading() {
    return (
        <div style={{ 
            minHeight: '100vh', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDFCFB' 
        }}>
            {/* Un loader simple et élégant qui respecte ton thème Ocre */}
            <div style={{ 
                width: '40px', height: '40px', 
                border: '3px solid #F1EDE9', borderTop: '3px solid #A63C06', 
                borderRadius: '50%', animation: 'spin 1s linear infinite' 
            }} />
            <p style={{ marginTop: '15px', color: '#A63C06', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Finalisation de votre commande...
            </p>
            <style jsx>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}