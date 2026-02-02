import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const socket = io('http://localhost:3000');

function HospitalDashboard() {
    const [bloodBanks, setBloodBanks] = useState([]);
    const [request, setRequest] = useState({ bloodGroup: 'A+', units: 1 });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('console');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.type !== 'hospital') navigate('/login');

        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/api/bloodbanks', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBloodBanks(res.data))
            .catch(err => console.error(err));

        socket.emit('join_room', 'hospital');
    }, []);

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:3000/api/request', {
                bloodGroup: request.bloodGroup,
                units: request.units
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Broadcast Successful');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <div className="dashboard-header">
                <img src="/assets/dashboard.jpeg" alt="Header" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), #020204)' }}></div>
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ margin: 0, opacity: 0.7 }}>Hospital Console</h2>
                            <h1 style={{ fontSize: '3rem', margin: 0 }}>{user?.name}</h1>
                        </div>
                        <button onClick={() => navigate('/')} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content-wrapper">
                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                    {['console', 'patients', 'history', 'needs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '30px',
                                border: '1px solid var(--glass-border)',
                                background: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'console' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
                        {/* Main Area */}
                        <div>
                            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '20px', borderBottom: 'var(--glass-border)' }}>
                                    <h3 style={{ margin: 0 }}>Active Blood Bank Reconnaissance</h3>
                                </div>
                                <MapContainer center={[17.3850, 78.4867]} zoom={12} scrollWheelZoom={false} style={{ flex: 1, width: '100%' }}>
                                    <TileLayer
                                        attribution='&copy; OpenStreetMap'
                                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    />
                                    {user?.latitude && (
                                        <Marker position={[user.latitude, user.longitude]}>
                                            <Popup>Your Location: {user.name}</Popup>
                                        </Marker>
                                    )}
                                    {bloodBanks.map(bb => (
                                        <Marker key={bb.id} position={[bb.latitude, bb.longitude]}>
                                            <Popup>
                                                <strong>{bb.name}</strong><br />
                                                {bb.phone}
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>

                        {/* Sidebar Controls */}
                        <div className="glass-panel" style={{ padding: '30px', height: 'fit-content' }}>
                            <h3 className="gradient-text-primary" style={{ marginTop: 0 }}>INITIATE SOS</h3>
                            <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '30px' }}>
                                This action will trigger an Immediate Response Alert to all {bloodBanks.length} connected blood banks.
                            </p>

                            <form onSubmit={handleRequest}>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>Blood Type</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                            <div
                                                key={bg}
                                                onClick={() => setRequest({ ...request, bloodGroup: bg })}
                                                style={{
                                                    padding: '10px 0',
                                                    textAlign: 'center',
                                                    background: request.bloodGroup === bg ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {bg}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="input-group">
                                    <input
                                        className="styled-input"
                                        type="number"
                                        value={request.units}
                                        onChange={e => setRequest({ ...request, units: e.target.value })}
                                        placeholder=" "
                                    />
                                    <label className="input-label">Units Required</label>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                                    {loading ? 'BROADCASTING...' : 'TRANSMIT ALERT'}
                                </button>
                            </form>

                            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: 'var(--glass-border)' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: 0.6 }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0f0' }}></div>
                                    <small>System Operational</small>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2>Patient List</h2>
                            <button className="btn btn-primary">Add Patient</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '15px' }}>Name</th>
                                    <th style={{ padding: '15px' }}>Condition</th>
                                    <th style={{ padding: '15px' }}>Blood Group</th>
                                    <th style={{ padding: '15px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'John Doe', condition: 'Surgery', bg: 'A+', status: 'Stable' },
                                    { name: 'Jane Smith', condition: 'Trauma', bg: 'O-', status: 'Critical' },
                                    { name: 'Robert B', condition: 'Anemia', bg: 'B+', status: 'Stable' }
                                ].map((p, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>{p.name}</td>
                                        <td style={{ padding: '15px' }}>{p.condition}</td>
                                        <td style={{ padding: '15px', color: 'var(--primary)', fontWeight: 'bold' }}>{p.bg}</td>
                                        <td style={{ padding: '15px' }}>{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h2>Request History</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '15px' }}>Date</th>
                                    <th style={{ padding: '15px' }}>Blood Group</th>
                                    <th style={{ padding: '15px' }}>Units</th>
                                    <th style={{ padding: '15px' }}>Fulfilled By</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>2025-10-12</td>
                                    <td style={{ padding: '15px' }}>A+</td>
                                    <td style={{ padding: '15px' }}>2</td>
                                    <td style={{ padding: '15px' }}>Indian Red Cross</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'needs' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h2>Annual Blood Needs</h2>
                        <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
                            <div style={{ flex: 1, textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                <h1 style={{ color: 'var(--primary)', fontSize: '3rem' }}>1,500 <span style={{ fontSize: '1rem', color: '#888' }}>units</span></h1>
                                <p>Projected Requirement (2026)</p>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                                <h1 style={{ color: 'var(--secondary)', fontSize: '3rem' }}>450 <span style={{ fontSize: '1rem', color: '#888' }}>units</span></h1>
                                <p>Current Stock (In-House)</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default HospitalDashboard;
