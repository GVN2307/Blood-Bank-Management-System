import React, { useState, useEffect } from 'react';
import api from '../api';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

function BloodBankDashboard() {
    const [inventory, setInventory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.type !== 'bloodbank') {
            navigate('/login');
            return;
        }
        fetchInventory();

        if (window.location.hostname === 'localhost') {
            try {
                const socket = io('http://localhost:3000');
                socket.emit('join_room', 'bloodbank');
                socket.on('emergency_alert', (data) => {
                    setAlerts(prev => [data, ...prev]);
                });
                return () => socket.disconnect();
            } catch (err) {
                console.warn('Real-time alert grid disconnected. Operating in manual telemetry mode.');
            }
        }
    }, [navigate]);

    const fetchInventory = async () => {
        try {
            const res = await api.get(`/inventory/${user.id}`);
            setInventory(res.data);
        } catch (err) {
            console.error('Fetch Inventory Error:', err);
        }
    };

    const updateStock = async (bloodGroup, currentUnits) => {
        const newUnits = prompt(`Update stock for ${bloodGroup}:`, currentUnits);
        if (newUnits !== null && !isNaN(newUnits)) {
            try {
                await api.post('/inventory', {
                    bloodGroup,
                    units: parseInt(newUnits)
                });
                fetchInventory();
            } catch (err) {
                alert(err.response?.data?.error || 'Update failed');
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="page-wrapper" style={{ padding: 0, display: 'flex' }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            {/* Sidebar */}
            <div style={{ width: '300px', background: 'rgba(5, 7, 10, 0.8)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border-glass)', z_index: 100, height: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div 
                        className="flex-center hover-lift" 
                        style={{ gap: '12px', cursor: 'pointer', justifyContent: 'flex-start' }}
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
                        <h2 style={{ fontSize: '1.4rem', margin: 0, letterSpacing: '-0.03em' }}>
                            Life<span style={{ color: 'var(--accent-primary)' }}>Link</span>
                        </h2>
                    </div>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--accent-primary)', fontWeight: 'bold', marginTop: '0.5rem' }}>SUPPLY NODE</p>
                </div>

                <div style={{ flex: 1 }}>
                    {['inventory', 'requests', 'history', 'reports'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="premium-btn"
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                marginBottom: '0.5rem',
                                background: activeTab === tab ? 'rgba(255, 59, 59, 0.1)' : 'transparent',
                                borderColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                                color: activeTab === tab ? 'white' : 'var(--text-dim)'
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: '1rem', marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'white', marginBottom: '0.2rem', fontWeight: 'bold' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>TELANGANA_GRID_ID: {user?.id?.toString().slice(0, 8)}</p>
                    <button onClick={handleLogout} className="premium-btn" style={{ width: '100%', padding: '0.5rem', fontSize: '0.7rem' }}>DISCONNECT</button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="title-gradient" style={{ fontSize: '2.5rem' }}>Inventory Matrix</h2>
                    <p style={{ color: 'var(--text-dim)' }}>Monitor and manage critical blood supplies for the region.</p>
                </div>

                {activeTab === 'inventory' && (
                    <div className="grid-cols-4" style={{ gap: '1.5rem' }}>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => {
                            const item = inventory.find(i => i.blood_group === bg);
                            const count = item ? item.units : 0;
                            return (
                                <div
                                    key={bg}
                                    onClick={() => updateStock(bg, count)}
                                    className="glass-card flex-center"
                                    style={{
                                        flexDirection: 'column',
                                        padding: '2rem',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: count < 5 ? '1px solid rgba(255, 59, 59, 0.3)' : '1px solid var(--border-glass)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <h3 style={{ fontSize: '3rem', margin: 0 }} className={count < 5 ? 'title-gradient' : ''}>{count}</h3>
                                    <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>{bg}</p>
                                    {count < 5 && <p style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>CRITICAL STOCK</p>}
                                </div>
                            )
                        })}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div style={{ maxWidth: '800px' }}>
                        <h3 className="title-gradient" style={{ marginBottom: '2rem' }}>Live Emergency Feed</h3>
                        {alerts.length === 0 ? (
                            <div className="glass-card flex-center" style={{ padding: '4rem', flexDirection: 'column' }}>
                                <p style={{ color: 'var(--text-dim)' }}>Scanning for emergency broadcasts...</p>
                                <div style={{ width: '40px', height: '40px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginTop: '1rem' }}></div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {alerts.map((alert, idx) => (
                                    <div key={idx} className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: 0, color: 'white' }}>🚨 {alert.hospitalName}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Requires {alert.units} units of {alert.bloodGroup}</p>
                                        </div>
                                        <button className="premium-btn btn-accent" style={{ fontSize: '0.7rem' }}>DEPLOY SUPPLY</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="animate-in">
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>DISPATCH ID</th>
                                        <th>DESTINATION</th>
                                        <th>TYPE</th>
                                        <th>UNITS</th>
                                        <th>DATE</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'D-8821', hospital: 'Apollo Jubilee Hills', type: 'O+', units: 4, date: '2024-05-02', status: 'DELIVERED' },
                                        { id: 'D-8822', hospital: 'Care Hospitals', type: 'A-', units: 2, date: '2024-05-04', status: 'IN_TRANSIT' },
                                        { id: 'D-8823', hospital: 'Yashoda Secunderabad', type: 'B+', units: 1, date: '2024-05-06', status: 'SCHEDULED' }
                                    ].map(d => (
                                        <tr key={d.id}>
                                            <td style={{ opacity: 0.5 }}>{d.id}</td>
                                            <td>{d.hospital}</td>
                                            <td style={{ fontWeight: 'bold' }}>{d.type}</td>
                                            <td>{d.units} Units</td>
                                            <td style={{ color: 'var(--text-dim)' }}>{d.date}</td>
                                            <td>
                                                <span style={{ 
                                                    padding: '2px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.6rem',
                                                    background: d.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                                                    color: d.status === 'DELIVERED' ? '#10b981' : '#38bdf8'
                                                }}>
                                                    {d.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="grid-cols-2 animate-in" style={{ gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3>Supply vs Demand Delta</h3>
                            <div style={{ height: '240px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-glass)', padding: '1.5rem', marginTop: '1.5rem', position: 'relative' }}>
                                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                                    <path d="M0,150 Q100,100 200,120 T400,50" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
                                    <path d="M0,130 Q100,160 200,110 T400,140" fill="none" stroke="var(--accent-secondary)" strokeWidth="3" />
                                    <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.1)" strokeDasharray="5,5" />
                                </svg>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.6rem' }}>
                                    <span><span style={{ color: 'var(--accent-primary)' }}>●</span> SUPPLY TREND</span>
                                    <span><span style={{ color: 'var(--accent-secondary)' }}>●</span> DEMAND TREND</span>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3>Operational Efficiency</h3>
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {[
                                    { label: 'Dispatch Precision', value: 94, color: 'var(--accent-primary)' },
                                    { label: 'Inventory Fluidity', value: 82, color: 'var(--accent-secondary)' },
                                    { label: 'Cold-Chain Integrity', value: 99, color: '#10b981' }
                                ].map(stat => (
                                    <div key={stat.label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                                            <span style={{ color: 'var(--text-dim)' }}>{stat.label}</span>
                                            <span style={{ fontWeight: 'bold' }}>{stat.value}%</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                width: `${stat.value}%`, 
                                                height: '100%', 
                                                background: stat.color,
                                                boxShadow: `0 0 15px ${stat.color}66`
                                            }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default BloodBankDashboard;

