import React, { useState, useEffect } from 'react';
import api from '../api';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function HospitalDashboard() {
    const [bloodBanks, setBloodBanks] = useState([]);
    const [request, setRequest] = useState({ bloodGroup: 'A+', units: 1 });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('console');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        api.get('/bloodbanks')
            .then(res => setBloodBanks(res.data))
            .catch(err => console.error('Fetch Banks Error:', err));

        if (window.location.hostname === 'localhost') {
            try {
                const socket = io('http://localhost:3000');
                socket.emit('join_room', 'hospital');
                return () => socket.disconnect();
            } catch (err) {
                console.warn('Real-time alert grid disconnected. Operating in manual telemetry mode.');
            }
        }
    }, []);

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/request', {
                bloodGroup: request.bloodGroup,
                units: request.units
            });
            alert('Emergency Broadcast Transmitted');
        } catch (err) {
            alert(err.response?.data?.error || 'Transmission failed');
        }
        setLoading(false);
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
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Hospital node</p>
                </div>

                <div style={{ flex: 1 }}>
                    {['console', 'patients', 'history', 'needs'].map(tab => (
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
                    <p style={{ fontSize: '0.8rem', color: 'white', marginBottom: '0.2rem', fontWeight: '500' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Grid ID: {user?.id?.toString().slice(0, 8)}</p>
                    <button onClick={handleLogout} className="premium-btn" style={{ width: '100%', padding: '0.5rem', fontSize: '0.7rem' }}>Disconnect</button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, height: '100vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}>
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="title-gradient" style={{ fontSize: '2.5rem', fontWeight: '500' }}>Tactical overview</h2>
                        <p style={{ color: 'var(--text-dim)' }}>Real-time coordination and resource management.</p>
                    </div>
                </div>

                {activeTab === 'console' && (
                    <div className="grid-cols-2" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '600px' }}>
                            <MapContainer center={[17.3850, 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                {bloodBanks.map(bb => (
                                    <Marker key={bb.id} position={[bb.lat || 17.3850, bb.lng || 78.4867]}>
                                        <Popup>
                                            <div style={{ color: '#000' }}>
                                                <strong>{bb.name}</strong><br />
                                                {bb.phone}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        <div className="glass-card">
                            <h3 className="title-gradient" style={{ marginBottom: '1.5rem', fontWeight: '500' }}>Emergency broadcast</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '2rem' }}>
                                Deploy an SOS to all connected blood banks within the Telangana Health Grid.
                            </p>

                            <form onSubmit={handleRequest}>
                                <div className="input-container">
                                    <label>Blood classification</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                            <button
                                                key={bg}
                                                type="button"
                                                onClick={() => setRequest({ ...request, bloodGroup: bg })}
                                                style={{
                                                    padding: '0.75rem 0',
                                                    background: request.bloodGroup === bg ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                                    border: '1px solid',
                                                    borderColor: request.bloodGroup === bg ? 'var(--accent-primary)' : 'var(--border-glass)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {bg}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-container">
                                    <label>Required quantity (units)</label>
                                    <input
                                        className="premium-input"
                                        type="number"
                                        value={request.units}
                                        onChange={e => setRequest({ ...request, units: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="premium-btn btn-accent" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                                    {loading ? 'Transmitting...' : 'Initiate SOS'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="animate-in">
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Patient ID</th>
                                        <th>Name</th>
                                        <th>Blood type</th>
                                        <th>Status</th>
                                        <th>Admission date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'P-1024', name: 'Rahul Sharma', group: 'O+', status: 'CRITICAL', date: '2024-05-01' },
                                        { id: 'P-1025', name: 'Sita Devi', group: 'AB-', status: 'STABLE', date: '2024-05-03' },
                                        { id: 'P-1026', name: 'John Doe', group: 'B+', status: 'WAITING', date: '2024-05-06' }
                                    ].map(p => (
                                        <tr key={p.id}>
                                            <td style={{ opacity: 0.5 }}>{p.id}</td>
                                            <td>{p.name}</td>
                                            <td style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>{p.group}</td>
                                            <td>
                                                <span style={{ 
                                                    padding: '2px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.7rem', 
                                                    background: p.status === 'CRITICAL' ? 'rgba(255, 59, 59, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                    color: p.status === 'CRITICAL' ? '#ff3b3b' : '#10b981',
                                                    border: `1px solid ${p.status === 'CRITICAL' ? 'rgba(255, 59, 59, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                                }}>
                                                    {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-dim)' }}>{p.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="animate-in">
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Type</th>
                                        <th>Units</th>
                                        <th>Dispatch node</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'REQ-001', type: 'A+', units: 2, node: 'Red Cross IRCS', status: 'Fulfilled' },
                                        { id: 'REQ-002', type: 'O-', units: 5, node: 'Apollo Central', status: 'Pending' },
                                        { id: 'REQ-003', type: 'B+', units: 1, node: 'NIMS Blood Bank', status: 'Cancelled' }
                                    ].map(r => (
                                        <tr key={r.id}>
                                            <td style={{ opacity: 0.5 }}>{r.id}</td>
                                            <td>{r.type}</td>
                                            <td>{r.units}</td>
                                            <td>{r.node}</td>
                                            <td>{r.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'needs' && (
                    <div className="grid-cols-2 animate-in" style={{ gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Forecasting Analytics</h3>
                            <div style={{ height: '240px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--border-glass)', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
                                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Grid lines */}
                                    {[0, 50, 100, 150].map(y => (
                                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                    ))}
                                    {/* Area chart */}
                                    <path d="M0,180 Q50,140 100,160 T200,80 T300,100 T400,40 L400,200 L0,200 Z" fill="url(#chartGradient)" />
                                    {/* Line chart */}
                                    <path d="M0,180 Q50,140 100,160 T200,80 T300,100 T400,40" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" />
                                    {/* Dots */}
                                    {[
                                        { x: 0, y: 180 }, { x: 100, y: 160 }, { x: 200, y: 80 }, { x: 300, y: 100 }, { x: 400, y: 40 }
                                    ].map((p, i) => (
                                        <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" />
                                    ))}
                                </svg>
                                <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.6rem', color: 'var(--text-dim)' }}>Projected demand increasing</div>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Strategic Shortage Alerts</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { type: 'O-', level: 'CRITICAL', req: 12 },
                                    { type: 'AB-', level: 'LOW', req: 5 },
                                    { type: 'B-', level: 'URGENT', req: 8 }
                                ].map(item => (
                                    <div key={item.type} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        padding: '1.25rem', 
                                        background: 'rgba(255, 59, 59, 0.05)', 
                                        borderRadius: '8px', 
                                        border: `1px solid ${item.level === 'CRITICAL' ? 'rgba(255, 59, 59, 0.2)' : 'rgba(255, 59, 59, 0.1)'}`
                                    }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 59, 59, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{item.type}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.level.charAt(0) + item.level.slice(1).toLowerCase()} shortage</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requirement: {item.req} Units</div>
                                        </div>
                                        <button className="premium-btn btn-accent" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>Dispatch</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HospitalDashboard;

