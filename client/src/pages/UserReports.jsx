import React from 'react';
import { useNavigate } from 'react-router-dom';

const TEST_DATA = [
    {
        category: 'Blood Telemetry',
        tests: [
            {
                name: 'Complete Blood Count (CBC)',
                description: 'Evaluates overall health and detects specific disorders like anemia, infection, and leukemia.',
                details: [
                    { param: 'Red Blood Cells (RBC)', normal: '4.5 - 5.5 million/mcL', meaning: 'Oxygen transmission. Low = Anemia; High = Polycythemia.' },
                    { param: 'White Blood Cells (WBC)', normal: '4.5k - 11k/mcL', meaning: 'Immune response. High = Infection; Low = Weak immunity.' },
                    { param: 'Hemoglobin', normal: '13.8 - 17.2 g/dL', meaning: 'Protein efficiency. Low = Anemia.' },
                    { param: 'Platelets', normal: '150k - 450k/mcL', meaning: 'Coagulation efficiency. Low = Bleeding risk.' }
                ]
            }
        ]
    },
    {
        category: 'Metabolic Matrix',
        tests: [
            {
                name: 'Basic Metabolic Panel (BMP)',
                description: 'Measures sugar level, electrolyte balance, and kidney function.',
                details: [
                    { param: 'Glucose', normal: '70 - 99 mg/dL', meaning: 'System fuel. High = Diabetes risk.' },
                    { param: 'Calcium', normal: '8.5 - 10.2 mg/dL', meaning: 'Structural health.' },
                    { param: 'Creatinine', normal: '0.6 - 1.3 mg/dL', meaning: 'Filtration efficiency.' }
                ]
            }
        ]
    }
];

function UserReports() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper" style={{ padding: 0 }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            <div className="container animate-in" style={{ padding: '4rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <button 
                        onClick={() => navigate('/user-dashboard')} 
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid var(--border-glass)', 
                            color: 'white', 
                            padding: '0.7rem 1.4rem', 
                            borderRadius: '30px', 
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s',
                            backdropFilter: 'blur(10px)'
                        }}
                        className="hover-lift"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        BACK TO HUB
                    </button>

                    <div 
                        className="flex-center hover-lift" 
                        style={{ gap: '12px', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            background: 'var(--accent-primary)', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 0 15px rgba(255, 59, 59, 0.3)'
                        }}>
                            <span style={{ color: 'white', fontWeight: '900', fontSize: '1rem' }}>L</span>
                        </div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, letterSpacing: '-0.03em' }}>
                            Life<span style={{ color: 'var(--accent-primary)' }}>Link</span>
                        </h2>
                    </div>
                </div>

                <div style={{ marginBottom: '5rem' }}>
                    <h1 className="title-gradient" style={{ fontSize: '4rem', marginBottom: '1rem' }}>Health Intelligence</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px' }}>
                        Deciphering the telemetry of your biological system for proactive care.
                    </p>
                </div>

                {TEST_DATA.map((category, catIndex) => (
                    <div key={catIndex} style={{ marginBottom: '6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0, whiteSpace: 'nowrap' }} className="title-accent">{category.category.toUpperCase()}</h2>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, var(--border-glass), transparent)' }}></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {category.tests.map((test, testIndex) => (
                                <div key={testIndex}>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem' }}>{test.name}</h3>
                                        <p style={{ color: 'var(--text-dim)', maxWidth: '800px' }}>{test.description}</p>
                                    </div>

                                    <div className="grid-cols-4" style={{ gap: '1.5rem' }}>
                                        {test.details.map((detail, dIndex) => (
                                            <div key={dIndex} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'white', marginBottom: '1rem' }}>{detail.param}</div>
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Normal Range</p>
                                                    <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: 'bold' }}>{detail.normal}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Diagnostic Insight</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', lineHeight: '1.4' }}>{detail.meaning}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="glass-card flex-center" style={{ padding: '5rem', flexDirection: 'column', border: '1px dashed var(--border-glass)' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Ready for a screening?</h2>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem' }}>Book your prioritized appointment at a certified regional facility.</p>
                    <button onClick={() => navigate('/test-schedule')} className="premium-btn btn-accent" style={{ padding: '1.2rem 4rem' }}>INITIALIZE BOOKING</button>
                </div>
            </div>
        </div>
    );
}

export default UserReports;

