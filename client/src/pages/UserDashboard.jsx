import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activity, setActivity] = useState([]);
    const [activeTab, setActiveTab] = useState('hub');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const fetchData = async () => {
            try {
                const profileRes = await api.get(`/user/profile/${storedUser.id}`);
                setUser(profileRes.data);

                const donationsRes = await api.get(`/user/donations/${storedUser.id}`);
                setActivity(donationsRes.data);
            } catch (err) {
                console.error('User Dashboard Fetch Error:', err);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="page-wrapper" style={{ padding: 0, display: 'flex' }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            {/* Sidebar */}
            <div style={{ width: '300px', background: 'rgba(5, 7, 10, 0.8)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border-glass)', zIndex: 100, height: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
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
                        <h2 style={{ fontSize: '1.4rem', margin: 0, letterSpacing: '-0.02em', fontWeight: '500' }}>
                            Life<span style={{ color: 'var(--accent-primary)' }}>Link</span>
                        </h2>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Citizen hub</p>
                </div>

                <div style={{ flex: 1 }}>
                    {['hub', 'donations', 'health-vault', 'network'].map(tab => (
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
                            {tab.toUpperCase().replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="glass-card" style={{ padding: '1rem', marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'white', marginBottom: '0.2rem', fontWeight: '500' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Grid ID: {user?.id?.toString().slice(0, 8)}</p>
                    <button onClick={handleLogout} className="premium-btn" style={{ width: '100%', padding: '0.5rem', fontSize: '0.7rem' }}>Disconnect</button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}>
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="title-gradient" style={{ fontSize: '2.5rem' }}>Welcome back, {user.name.split(' ')[0]}</h2>
                        <p style={{ color: 'var(--text-dim)' }}>Your health contributions are strengthening the regional grid.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem 2.5rem', textAlign: 'center', borderColor: 'var(--accent-primary)' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>Blood group</p>
                        <h3 style={{ fontSize: '2rem', margin: 0 }}>{user.bloodGroup || 'O+'}</h3>
                    </div>
                </div>

                {activeTab === 'hub' && (
                    <div className="grid-cols-3" style={{ gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>💉 Schedule Test</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', flex: 1, marginBottom: '2rem' }}>
                                Find nearby accredited nodes and book prioritized diagnostic screenings.
                            </p>
                            <button onClick={() => navigate('/test-schedule')} className="premium-btn btn-accent" style={{ width: '100%', padding: '0.75rem' }}>Book scan</button>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📄 Health Vault</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', flex: 1, marginBottom: '2rem' }}>
                                Secure access to your encrypted medical history and donation records.
                            </p>
                            <button onClick={() => navigate('/user-reports')} className="premium-btn" style={{ width: '100%', padding: '0.75rem' }}>Open vault</button>
                        </div>

                        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🌍 Grid Impact</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', flex: 1, marginBottom: '2rem' }}>
                                View how your contributions are being utilized in emergency sectors.
                            </p>
                            <button onClick={() => navigate('/community')} className="premium-btn" style={{ width: '100%', padding: '0.75rem' }}>View stats</button>
                        </div>
                    </div>
                )}

                {activeTab === 'donations' && (
                    <div className="animate-in">
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Batch ID</th>
                                        <th>Center</th>
                                        <th>Quantity</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.length > 0 ? activity.map(d => (
                                        <tr key={d.id}>
                                            <td style={{ opacity: 0.5 }}>BT-{d.id.toString().padStart(4, '0')}</td>
                                            <td>{d.bloodbank_name}</td>
                                            <td>{d.units} Unit(s)</td>
                                            <td>{new Date(d.donation_date).toLocaleDateString()}</td>
                                            <td>
                                                <span className="stat-pill" style={{ fontSize: '0.6rem', color: '#10B981' }}>Verified</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                                No verified transmissions found in your primary ledger.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'health-vault' && (
                    <div className="animate-in">
                        <div className="grid-cols-2" style={{ gap: '2rem' }}>
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3>Medical Intelligence</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '1rem' }}>
                                    Your latest blood work and diagnostic reports are encrypted and stored in the decentralized vault.
                                </p>
                                <button onClick={() => navigate('/user-reports')} className="premium-btn btn-outline" style={{ marginTop: '2rem', width: '100%' }}>View Full Reports</button>
                            </div>
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3>Eligibility Status</h3>
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                    <p style={{ color: '#10b981', fontWeight: '500' }}>Ready for donation</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Next window opens in 12 days.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'network' && (
                    <div className="animate-in">
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 className="title-gradient">Regional Impact Network</h3>
                            <div style={{ 
                                height: '300px', 
                                marginTop: '2rem', 
                                background: 'rgba(0,0,0,0.2)', 
                                borderRadius: '12px', 
                                border: '1px solid var(--border-glass)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Grid background */}
                                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                
                                {/* SVG Map / Network */}
                                <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ position: 'relative', zIndex: 1 }}>
                                    <circle cx="200" cy="100" r="4" fill="var(--accent-primary)">
                                        <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="200" cy="100" r="40" fill="none" stroke="var(--accent-primary)" strokeOpacity="0.2" strokeWidth="1">
                                        <animate attributeName="r" values="0;80" dur="3s" repeatCount="indefinite" />
                                        <animate attributeName="stroke-opacity" values="0.5;0" dur="3s" repeatCount="indefinite" />
                                    </circle>
                                    {[
                                        { x: 120, y: 60 }, { x: 280, y: 140 }, { x: 150, y: 150 }, { x: 300, y: 50 }
                                    ].map((node, i) => (
                                        <g key={i}>
                                            <line x1="200" y1="100" x2={node.x} y2={node.y} stroke="var(--accent-primary)" strokeWidth="0.5" strokeDasharray="4,4" />
                                            <circle cx={node.x} cy={node.y} r="3" fill="var(--text-dim)" />
                                        </g>
                                    ))}
                                </svg>
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>1,402</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>Lives impacted in region</div>
                                </div>
                            </div>
                            <div className="grid-cols-3" style={{ gap: '1rem', marginTop: '2rem' }}>
                                {[
                                    { label: 'Active Donors', val: '12.4k', color: 'var(--accent-primary)' },
                                    { label: 'Emergency Nodes', val: '148', color: 'var(--accent-secondary)' },
                                    { label: 'Network Health', val: '99.9%', color: '#10b981' }
                                ].map(stat => (
                                    <div key={stat.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '500', color: stat.color }}>{stat.val}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/community')} className="premium-btn btn-accent" style={{ marginTop: '2rem', width: '100%' }}>Enter community hub</button>
                        </div>
                    </div>
                )}

                <div className="glass-card" style={{ marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Log</h3>
                    <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-glass)', borderRadius: '12px' }}>
                        <p style={{ color: 'var(--text-dim)' }}>No recent transmissions found in your primary ledger.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;

