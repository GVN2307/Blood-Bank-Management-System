import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TEST_DATA = [
    {
        category: 'Blood Tests',
        tests: [
            {
                name: 'Complete Blood Count (CBC)',
                description: 'Evaluates overall health and detects specific disorders like anemia, infection, and leukemia.',
                details: [
                    { param: 'Red Blood Cells (RBC)', normal: '4.5 - 5.5 million/mcL', meaning: 'Carries oxygen. Low = Anemia; High = Polycythemia.' },
                    { param: 'White Blood Cells (WBC)', normal: '4,500 - 11,000/mcL', meaning: 'Fights infection. High = Infection/Inflammation; Low = Weak Immune System.' },
                    { param: 'Hemoglobin', normal: '13.8 - 17.2 g/dL (Men), 12.1 - 15.1 g/dL (Women)', meaning: 'Oxygen-carrying protein. Low = Anemia.' },
                    { param: 'Platelets', normal: '150,000 - 450,000/mcL', meaning: 'Helps clotting. Low = Bleeding risk; High = Clotting risk.' }
                ]
            },
            {
                name: 'Basic Metabolic Panel (BMP)',
                description: 'Measures sugar (glucose) level, electrolyte and fluid balance, and kidney function.',
                details: [
                    { param: 'Glucose', normal: '70 - 99 mg/dL (Fasting)', meaning: 'Blood sugar. High = Diabetes risk.' },
                    { param: 'Calcium', normal: '8.5 - 10.2 mg/dL', meaning: 'Bone/Muscle health.' },
                    { param: 'Creatinine', normal: '0.6 - 1.3 mg/dL', meaning: 'Kidney function indicator. High = Kidney issues.' }
                ]
            },
            {
                name: 'Lipid Panel',
                description: 'Measures fats and fatty substances in your body.',
                details: [
                    { param: 'Total Cholesterol', normal: '< 200 mg/dL', meaning: 'Overall heart health.' },
                    { param: 'LDL (Bad)', normal: '< 100 mg/dL', meaning: 'High levels increase heart disease risk.' },
                    { param: 'HDL (Good)', normal: '> 60 mg/dL', meaning: 'Protects against heart disease.' }
                ]
            }
        ]
    },
    {
        category: 'Urine Tests',
        tests: [
            {
                name: 'Urinalysis',
                description: 'Detects and manages a wide range of disorders, such as urinary tract infections, kidney disease and diabetes.',
                details: [
                    { param: 'Color', normal: 'Pale yellow to amber', meaning: 'Dark = Dehydration; Red/Brown = Blood.' },
                    { param: 'Clarity', normal: 'Clear', meaning: 'Cloudy = Infection.' },
                    { param: 'pH', normal: '4.5 - 8.0', meaning: 'Acidity level.' },
                    { param: 'Glucose', normal: 'Negative', meaning: 'Presence suggests diabetes.' },
                    { param: 'Protein', normal: 'Negative or Trace', meaning: 'Positive suggests kidney stress.' }
                ]
            }
        ]
    }
];

function UserReports() {
    const navigate = useNavigate();
    const [activeOriginalTab, setActiveOriginalTab] = useState(0);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <nav className="navbar container">
                <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/user-dashboard')}>
                    <span className="logo-text">&larr; Dashboard</span>
                </div>
            </nav>

            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '10px' }}>Medical Knowledge Base</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Understanding your test results is the first step to better health. Browse our comprehensive guide below.
                    </p>
                </div>

                {TEST_DATA.map((category, catIndex) => (
                    <div key={catIndex} style={{ marginBottom: '60px' }}>
                        <h2 style={{ borderBottom: '1px solid var(--primary)', paddingBottom: '10px', display: 'inline-block', marginBottom: '30px' }}>
                            {category.category}
                        </h2>

                        <div style={{ display: 'grid', gap: '30px' }}>
                            {category.tests.map((test, testIndex) => (
                                <div key={testIndex} className="glass-panel" style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--secondary)' }}>{test.name}</h3>
                                    </div>
                                    <p style={{ color: 'white', marginBottom: '30px', fontSize: '1.1rem' }}>{test.description}</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                        {test.details.map((detail, dIndex) => (
                                            <div key={dIndex} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{detail.param}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Normal: <span style={{ color: 'white' }}>{detail.normal}</span></div>
                                                <div style={{ fontSize: '0.85rem', color: '#ff6b6b' }}>{detail.meaning}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div style={{ textAlign: 'center', marginTop: '60px', padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px' }}>
                    <h3>Need to schedule a test?</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Find nearest certified labs and hospitals instantly.</p>
                    <button onClick={() => navigate('/test-schedule')} className="btn btn-primary">Book Now</button>
                </div>
            </div>
        </div>
    );
}

export default UserReports;
