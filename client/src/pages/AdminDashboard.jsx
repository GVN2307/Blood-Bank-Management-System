import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const statsRes = await axios.get('http://localhost:3000/api/admin/stats', { headers });
                // Process users array into object
                const uCounts = { hospital: 0, bloodbank: 0, user: 0, admin: 0 };
                statsRes.data.users.forEach(item => { uCounts[item.type] = item.count; });

                const reqCounts = { pending: 0, fulfilled: 0, cancelled: 0 };
                statsRes.data.requests.forEach(item => { reqCounts[item.status] = item.count; });

                setStats({
                    users: uCounts,
                    blood_units: statsRes.data.blood_units,
                    requests: reqCounts
                });

                const usersRes = await axios.get('http://localhost:3000/api/admin/users', { headers });
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Admin Fetch Error:', err);
                if (err.response?.status === 403) {
                    alert('Forbidden: Admin access required');
                    navigate('/login');
                }
            }
        };

        fetchAdminData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <nav className="navbar container">
                <div className="logo-container">
                    <span className="logo-text">LifeLink <span style={{ color: 'var(--primary)', fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin</span></span>
                </div>
                <button onClick={handleLogout} className="btn" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Logout</button>
            </nav>

            <div className="container" style={{ marginTop: '40px' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{ background: activeTab === 'overview' ? 'var(--primary)' : 'transparent', color: 'white', padding: '10px 20px', border: '1px solid var(--primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        System Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{ background: activeTab === 'users' ? 'var(--primary)' : 'transparent', color: 'white', padding: '10px 20px', border: '1px solid var(--primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        User Management
                    </button>
                </div>

                {activeTab === 'overview' && stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>Total Users</h3>
                            <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>{stats.users.hospital + stats.users.bloodbank + stats.users.user}</h1>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Hospitals: {stats.users.hospital} | Blood Banks: {stats.users.bloodbank}
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>Total Blood Units</h3>
                            <h1 style={{ fontSize: '3rem', margin: '10px 0', color: 'var(--secondary)' }}>{stats.blood_units}</h1>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Across all banks
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '30px' }}>
                            <h3 style={{ color: 'var(--text-muted)' }}>Active Requests</h3>
                            <h1 style={{ fontSize: '3rem', margin: '10px 0', color: '#ffd700' }}>{stats.requests.pending}</h1>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {stats.requests.fulfilled} fulfilled lifetime
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h2>Registered Entities</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>ID</th>
                                    <th style={{ padding: '15px' }}>Name</th>
                                    <th style={{ padding: '15px' }}>Type</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px' }}>#{u.id}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.name}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase',
                                                background: u.type === 'hospital' ? 'blue' : (u.type === 'bloodbank' ? 'red' : 'green')
                                            }}>
                                                {u.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>{u.email}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button style={{ background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
