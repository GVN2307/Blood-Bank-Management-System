import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2'; // Assumes chart.js installed or we mock visual
import 'chart.js/auto'; // Mocking or basic implementation

const socket = io('http://localhost:3000');

function BloodBankDashboard() {
    const [inventory, setInventory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [activeTab, setActiveTab] = useState('inventory');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.type !== 'bloodbank') navigate('/login');
        fetchInventory();
        socket.emit('join_room', 'bloodbank');

        socket.on('emergency_alert', (data) => {
            setAlerts(prev => [data, ...prev]);
            alert('NEW EMERGENCY REQUEST RECEIVED!');
        });

        return () => socket.off('emergency_alert');
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/inventory/${user.id}`);
            setInventory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStock = async (bloodGroup, units) => {
        const newUnits = prompt(`Update stock for ${bloodGroup}:`, units);
        if (newUnits !== null) {
            await axios.post('http://localhost:3000/api/inventory', {
                bloodbankId: user.id,
                bloodGroup,
                units: newUnits
            });
            fetchInventory();
        }
    };

    // Mock Data for Reports
    const reportData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Units Collected',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Units Distributed',
                data: [45, 49, 60, 71, 46, 35],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <div className="dashboard-header" style={{ height: '250px' }}>
                <img src="/assets/donate.jpeg" alt="Header" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(50,0,0,0.3), #020204)' }}></div>
                <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', paddingBottom: '60px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ margin: 0, opacity: 0.7 }}>Blood Bank Console</h2>
                            <h1 style={{ fontSize: '3rem', margin: 0 }}>{user?.name}</h1>
                        </div>
                        <button onClick={() => navigate('/')} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content-wrapper">
                {/* Navigation Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {['inventory', 'requests', 'history', 'reports', 'events'].map(tab => (
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
                                textTransform: 'capitalize',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab: Inventory */}
                {activeTab === 'inventory' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <h3>Live Stock Levels</h3>
                            <button className="btn" style={{ fontSize: '0.8rem', padding: '8px 16px' }} onClick={fetchInventory}>Sync Database</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => {
                                const item = inventory.find(i => i.blood_group === bg);
                                const count = item ? item.units : 0;
                                return (
                                    <div
                                        key={bg}
                                        onClick={() => updateStock(bg, count)}
                                        style={{
                                            position: 'relative',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 5px 0' }}>{count}</h2>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#888' }}>{bg}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Tab: Requests (Live Tracking) */}
                {activeTab === 'requests' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3>Incoming Requests & Tracking</h3>
                            {alerts.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No active emergency requests.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {alerts.map((alert, idx) => (
                                        <div key={idx} style={{ background: 'rgba(255,0,0,0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid red' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <h4 style={{ margin: 0 }}>🚨 Emergency from {alert.hospitalName}</h4>
                                                <span style={{ color: '#ff6b6b' }}>Live</span>
                                            </div>
                                            <p>Requires <b>{alert.units} units</b> of <b>{alert.bloodGroup}</b></p>
                                            <div style={{ marginTop: '10px', height: '10px', background: '#333', borderRadius: '5px' }}>
                                                <div style={{ width: '60%', height: '100%', background: 'var(--primary)', borderRadius: '5px' }}></div>
                                            </div>
                                            <small style={{ color: 'var(--text-muted)' }}>Drone dispatched... 60% en route</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3>Fulfilled Requests</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontWeight: 'bold' }}>NIMS Hyderabad</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>2 units O+ (Yesterday)</div>
                                </li>
                                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontWeight: 'bold' }}>Apollo Jubilee</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>5 units AB- (Last Week)</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Tab: Reports */}
                {activeTab === 'reports' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h3>Annual Reports</h3>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>[Chart Visual: Collected vs Distributed]</p>
                            {/* In real implementation, render <Bar data={reportData} /> here */}
                        </div>
                        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h1>1,240</h1>
                                <p style={{ color: 'var(--text-muted)' }}>Total Donors (Year)</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ color: 'var(--secondary)' }}>850</h1>
                                <p style={{ color: 'var(--text-muted)' }}>Units Issued</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h1 style={{ color: '#ffd700' }}>12</h1>
                                <p style={{ color: 'var(--text-muted)' }}>Camps Conducted</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Events */}
                {activeTab === 'events' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3>Upcoming Events</h3>
                            <button className="btn btn-primary">Create Event</button>
                        </div>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <h4>Mega Blood Donation Camp</h4>
                                <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>📅 Dec 15, 2025 • 📍 Hitech City</p>
                                <p>Expected Donors: 500+</p>
                            </div>
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <h4>Awareness Run</h4>
                                <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>📅 Jan 20, 2026 • 📍 KBR Park</p>
                                <p>Sponsors: 5</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: History */}
                {activeTab === 'history' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h3>Past Supplements</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Date</th>
                                    <th style={{ padding: '15px' }}>Requested By</th>
                                    <th style={{ padding: '15px' }}>Type</th>
                                    <th style={{ padding: '15px' }}>Qty</th>
                                    <th style={{ padding: '15px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>2025-10-12</td>
                                    <td style={{ padding: '15px' }}>NIMS</td>
                                    <td style={{ padding: '15px' }}>A+</td>
                                    <td style={{ padding: '15px' }}>2</td>
                                    <td style={{ padding: '15px', color: '#00ff00' }}>Delivered</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>2025-10-10</td>
                                    <td style={{ padding: '15px' }}>Apollo</td>
                                    <td style={{ padding: '15px' }}>O-</td>
                                    <td style={{ padding: '15px' }}>1</td>
                                    <td style={{ padding: '15px', color: '#00ff00' }}>Delivered</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}

export default BloodBankDashboard;
