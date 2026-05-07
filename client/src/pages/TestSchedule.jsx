import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TESTS = [
    'Complete Blood Count (CBC)',
    'Urine Analysis',
    'Lipid Profile',
    'Thyroid Profile',
    'Blood Sugar (Fasting/PP)',
    'Full Body Checkup'
];

const NEARBY_HOSPITALS = [
    { id: 1, name: 'NIMS Hyderabad', distance: '2.5 km', price: '₹500' },
    { id: 2, name: 'Apollo Hospitals Jubilee Hills', distance: '4.8 km', price: '₹1200' },
    { id: 5, name: 'Yashoda Hospitals', distance: '6.1 km', price: '₹900' }
];

function TestSchedule() {
    const navigate = useNavigate();
    const [selectedTest, setSelectedTest] = useState('');
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleBook = async () => {
        setLoading(true);
        try {
            await api.post('/user/tests', {
                hospitalId: selectedHospital.id,
                testType: selectedTest
            });
            setLoading(false);
            setStep(3);
        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.error || 'Failed to book test');
        }
    };

    return (
        <div className="page-wrapper" style={{ padding: 0 }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            <div className="container animate-in" style={{ maxWidth: '900px', padding: '4rem 2rem' }}>
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

                <div className="glass-card" style={{ padding: '3rem' }}>
                    <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Schedule Diagnostics</h1>
                            <p style={{ color: 'var(--text-dim)' }}>Step {step} of 2: {step === 1 ? 'Choose screening type' : 'Select designated facility'}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ width: '30px', height: '4px', borderRadius: '2px', background: step >= 1 ? 'var(--accent-primary)' : 'var(--border-glass)' }}></div>
                            <div style={{ width: '30px', height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--accent-primary)' : 'var(--border-glass)' }}></div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="grid-cols-2" style={{ gap: '1rem' }}>
                            {TESTS.map(test => (
                                <div
                                    key={test}
                                    onClick={() => setSelectedTest(test)}
                                    className="glass-card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        background: selectedTest === test ? 'rgba(255, 59, 59, 0.1)' : 'rgba(255,255,255,0.02)',
                                        borderColor: selectedTest === test ? 'var(--accent-primary)' : 'var(--border-glass)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}
                                >
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--accent-primary)', background: selectedTest === test ? 'var(--accent-primary)' : 'transparent' }}></div>
                                    <span style={{ fontWeight: 'bold', color: selectedTest === test ? 'white' : 'var(--text-dim)' }}>{test}</span>
                                </div>
                            ))}
                            <div style={{ gridColumn: 'span 2', marginTop: '2rem', textAlign: 'right' }}>
                                <button
                                    className="premium-btn btn-accent"
                                    disabled={!selectedTest}
                                    onClick={() => setStep(2)}
                                    style={{ padding: '1rem 3rem' }}
                                >
                                    CONTINUE &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>SELECTED TEST:</span>
                                <span style={{ fontWeight: 'bold' }}>{selectedTest}</span>
                                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>[EDIT]</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {NEARBY_HOSPITALS.map(hospital => (
                                    <div
                                        key={hospital.id}
                                        onClick={() => setSelectedHospital(hospital)}
                                        className="glass-card"
                                        style={{
                                            padding: '1.5rem 2rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: selectedHospital?.id === hospital.id ? 'rgba(255, 59, 59, 0.05)' : 'transparent',
                                            borderColor: selectedHospital?.id === hospital.id ? 'var(--accent-primary)' : 'var(--border-glass)'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>{hospital.name}</div>
                                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.25rem' }}>📍 {hospital.distance} from your location</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{hospital.price}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>BASE FEE</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                                <button
                                    className="premium-btn btn-accent"
                                    disabled={!selectedHospital || loading}
                                    onClick={handleBook}
                                    style={{ padding: '1rem 4rem' }}
                                >
                                    {loading ? 'SECURING SLOT...' : 'CONFIRM APPOINTMENT'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <span style={{ color: '#10B981', fontSize: '2.5rem' }}>✓</span>
                            </div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Slot Secured</h2>
                            <p style={{ color: 'var(--text-dim)', maxWidth: '400px', margin: '0 auto 3rem' }}>
                                Your screening for <b>{selectedTest}</b> at <b>{selectedHospital?.name}</b> has been broadcast to the facility.
                            </p>
                            <button onClick={() => navigate('/user-dashboard')} className="premium-btn btn-accent" style={{ padding: '1rem 3rem' }}>RETURN TO HUB</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TestSchedule;

