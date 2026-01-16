import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    { id: 5, name: 'Yashoda Hospitals', distance: '6.1 km', price: '₹900' } // Mock ID
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
            const user = JSON.parse(localStorage.getItem('user'));
            // In real app: Calls API
            // await axios.post('/api/user/tests', {
            //     userId: user.id,
            //     hospitalId: selectedHospital.id,
            //     testType: selectedTest
            // });

            // Simulate delay
            setTimeout(() => {
                setLoading(false);
                setStep(3); // Success
            }, 1500);
        } catch (error) {
            setLoading(false);
            alert('Failed to book test');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <nav className="navbar container">
                <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/user-dashboard')}>
                    <span className="logo-text">&larr; Dashboard</span>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '800px', marginTop: '40px' }}>
                <div className="glass-panel" style={{ padding: '40px' }}>
                    <h1 style={{ marginBottom: '30px' }}>Schedule a Lab Test</h1>

                    {/* Step 1: Select Test */}
                    {step === 1 && (
                        <div>
                            <h3 style={{ color: 'var(--text-muted)' }}>Step 1: Choose Test Type</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                                {TESTS.map(test => (
                                    <button
                                        key={test}
                                        onClick={() => setSelectedTest(test)}
                                        style={{
                                            padding: '20px',
                                            borderRadius: '12px',
                                            background: selectedTest === test ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            color: 'white',
                                            border: 'none',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            border: selectedTest === test ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {test}
                                    </button>
                                ))}
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '30px' }}>
                                <button
                                    className="btn btn-primary"
                                    disabled={!selectedTest}
                                    onClick={() => setStep(2)}
                                    style={{ opacity: !selectedTest ? 0.5 : 1 }}
                                >
                                    Next: Select Hospital &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Hospital */}
                    {step === 2 && (
                        <div>
                            <h3 style={{ color: 'var(--text-muted)' }}>Step 2: Choose Facility</h3>
                            <p>Test: <b>{selectedTest}</b> <span style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setStep(1)}>(Change)</span></p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                                {NEARBY_HOSPITALS.map(hospital => (
                                    <div
                                        key={hospital.id}
                                        onClick={() => setSelectedHospital(hospital)}
                                        style={{
                                            padding: '20px',
                                            borderRadius: '12px',
                                            background: selectedHospital?.id === hospital.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                            border: selectedHospital?.id === hospital.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{hospital.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📍 {hospital.distance} away</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--secondary)', display: 'block' }}>{hospital.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '30px' }}>
                                <button
                                    className="btn btn-primary"
                                    disabled={!selectedHospital || loading}
                                    onClick={handleBook}
                                    style={{ opacity: !selectedHospital ? 0.5 : 1 }}
                                >
                                    {loading ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                            <h2>Appointment Confirmed!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                                Your request for <b>{selectedTest}</b> at <b>{selectedHospital?.name}</b> has been sent.
                                You will receive a confirmation shortly.
                            </p>
                            <button onClick={() => navigate('/user-dashboard')} className="btn btn-primary">Back to Dashboard</button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default TestSchedule;
