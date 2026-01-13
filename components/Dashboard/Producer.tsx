// components/Dashboard/ProducerDashboard.tsx

import React from 'react';

// Mock de données pour le Producteur
const mockProducerData = {
    newOrders: 5,
    totalStockValue: '1.2M XOF',
    iaDiagnosis: 'Risque modéré de mildiou sur le maïs.',
};

export default function ProducerDashboard() {
    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#10b981', marginBottom: '20px' }}>🌿 Espace Producteur</h1>
            
            <p style={{ marginBottom: '30px', fontSize: '1.1em' }}>
                Gérez vos ventes, vos stocks et recevez les analyses de l'IA.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Carte 1 : Nouvelles Commandes */}
                <div style={cardStyleProducer}>
                    <h3 style={cardTitleStyle}>🛍️ Nouvelles Commandes</h3>
                    <p style={cardValueStyle}>{mockProducerData.newOrders}</p>
                    <a href="/sales" style={linkStyleProducer}>Gérer les expéditions</a>
                </div>

                {/* Carte 2 : Valeur du Stock */}
                <div style={cardStyleProducer}>
                    <h3 style={cardTitleStyle}>💰 Valeur du Stock</h3>
                    <p style={cardValueStyle}>{mockProducerData.totalStockValue}</p>
                    <a href="/products/manage" style={linkStyleProducer}>Modifier le catalogue</a>
                </div>

                {/* Carte 3 : Diagnostic IA (AgroConnect) */}
                <div style={cardStyleProducer}>
                    <h3 style={cardTitleStyle}>🧠 Diagnostic IA</h3>
                    <p style={{ ...cardValueStyle, fontSize: '1.2em', fontWeight: 'normal' }}>
                        {mockProducerData.iaDiagnosis}
                    </p>
                    <a href="/ia-analysis" style={linkStyleProducer}>Voir le rapport complet</a>
                </div>

            </div>
        </div>
    );
}

// Styles simples (adaptés au Producteur)
const cardStyleProducer: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '5px solid #10b981' // Vert pour le producteur
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.2em',
    marginBottom: '10px',
    color: '#333'
};

const cardValueStyle: React.CSSProperties = {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '10px'
};

const linkStyleProducer: React.CSSProperties = {
    color: '#10b981',
    textDecoration: 'none',
    fontSize: '0.9em'
};