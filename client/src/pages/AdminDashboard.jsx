import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const statsRes = await api.get('/admin/stats');
                const uCounts = { hospital: 0, bloodbank: 0, user: 0, admin: 0 };
                statsRes.data.users.forEach(item => { uCounts[item.type] = item.count; });

                const reqCounts = { pending: 0, fulfilled: 0, cancelled: 0 };
                statsRes.data.requests.forEach(item => { reqCounts[item.status] = item.count; });

                setStats({
                    users: uCounts,
                    blood_units: statsRes.data.blood_units,
                    requests: reqCounts
                });

                const usersRes = await api.get('/admin/users');
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Admin Fetch Error:', err);
                if (err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };
        fetchAdminData();
    }, [navigate]);


    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleDeleteUser = async (id, name) => {
        if (window.confirm(`Are you sure you want to terminate access for ${name}?`)) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
                alert('Entity access revoked successfully.');
            } catch (err) {
                console.error('Termination Error:', err);
                alert('Failed to terminate entity. Error: ' + (err.response?.data?.error || err.message));
            }
        }
    };

    return (
        <div className="page-wrapper" style={{ padding: 0, maxWidth: 'none', display: 'flex' }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            {/* Admin Sidebar */}
            <aside style={{ 
                width: '280px', 
                height: '100vh', 
                background: 'rgba(5, 7, 10, 0.4)', 
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--border-glass)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0
            }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Life<span style={{ color: 'var(--accent-primary)' }}>Link</span></h2>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.2em' }}>ADMINISTRATIVE CONSOLE</p>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`premium-btn ${activeTab === 'overview' ? 'btn-accent' : 'btn-outline'}`}
                        style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.9rem' }}
                    >
                        📊 Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`premium-btn ${activeTab === 'users' ? 'btn-accent' : 'btn-outline'}`}
                        style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.9rem' }}
                    >
                        👥 User Registry
                    </button>
                </nav>

                <button onClick={handleLogout} className="premium-btn btn-outline" style={{ marginTop: 'auto', width: '100%' }}>
                    Secure Logout
                </button>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '3rem', position: 'relative' }}>
                <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem' }} className="title-gradient">
                            {activeTab === 'overview' ? 'Network Intelligence' : 'User Ecosystem'}
                        </h1>
                        <p style={{ color: 'var(--text-dim)' }}>Real-time telemetry from across the state.</p>
                    </div>
                    <div className="stat-pill">
                        System Status: <span style={{ color: '#10B981' }}>OPTIMAL</span>
                    </div>
                </header>

                {activeTab === 'overview' && stats && (
                    <div className="animate-in">
                        <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
                            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-secondary)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>TOTAL ENTITIES</p>
                                <h2 style={{ fontSize: '3rem' }}>{stats.users.hospital + stats.users.bloodbank + stats.users.user}</h2>
                                <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-dim)' }}>
                                    <span style={{ color: 'var(--accent-secondary)' }}>●</span> {stats.users.hospital} Hospitals | <span style={{ color: 'var(--accent-primary)' }}>●</span> {stats.users.bloodbank} Blood Banks
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>GLOBAL INVENTORY</p>
                                <h2 style={{ fontSize: '3rem', color: 'var(--accent-primary)' }}>{stats.blood_units}</h2>
                                <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-dim)' }}>
                                    Total units available in regional storage
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-tertiary)' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>ACTIVE DISPATCHES</p>
                                <h2 style={{ fontSize: '3rem', color: 'var(--accent-tertiary)' }}>{stats.requests.pending}</h2>
                                <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-dim)' }}>
                                    {stats.requests.fulfilled} successful deliveries today
                                </div>
                            </div>
                        </div>

                        <div className="grid-cols-2" style={{ gap: '2rem' }}>
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                                    Node Telemetry Grid
                                </h3>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(10, 1fr)', 
                                    gap: '8px', 
                                    padding: '1rem', 
                                    background: 'rgba(0,0,0,0.2)', 
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-glass)'
                                }}>
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <div key={i} style={{ 
                                            aspectRatio: '1', 
                                            borderRadius: '4px', 
                                            background: i % 7 === 0 ? 'rgba(255, 59, 59, 0.4)' : (i % 5 === 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.2)'),
                                            border: `1px solid ${i % 7 === 0 ? '#ff3b3b44' : (i % 5 === 0 ? '#10b98144' : '#38bdf822')}`,
                                            animation: `pulse ${2 + (i % 3)}s infinite ${i * 0.1}s`
                                        }}></div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                                    <span><span style={{ color: '#ff3b3b' }}>●</span> CRITICAL SUPPLY</span>
                                    <span><span style={{ color: '#10b981' }}>●</span> OPTIMAL</span>
                                    <span><span style={{ color: '#38bdf8' }}>●</span> STABLE</span>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Resource Distribution</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {[
                                        { label: 'Hyper-Emergency (O-)', value: 85, color: 'var(--accent-primary)' },
                                        { label: 'General Stock', value: 62, color: 'var(--accent-secondary)' },
                                        { label: 'Plasma Reserves', value: 41, color: 'var(--accent-tertiary)' }
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                                                <span>{item.label}</span>
                                                <span>{item.value}%</span>
                                            </div>
                                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ 
                                                    width: `${item.value}%`, 
                                                    height: '100%', 
                                                    background: item.color,
                                                    boxShadow: `0 0 10px ${item.color}44`
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card animate-in" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-glass)' }}>
                            <h3>Authenticated Entities</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>NODE ID</th>
                                        <th>ENTITY NAME</th>
                                        <th>CLASSIFICATION</th>
                                        <th>ENCRYPTED EMAIL</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td style={{ opacity: 0.5, fontFamily: 'monospace' }}>LL-{u.id.toString().padStart(4, '0')}</td>
                                            <td style={{ fontWeight: 'bold' }}>{u.name}</td>
                                            <td>
                                                <span style={{ 
                                                    padding: '4px 12px', 
                                                    borderRadius: '6px', 
                                                    fontSize: '0.7rem', 
                                                    fontWeight: 'bold',
                                                    background: u.type === 'hospital' ? 'rgba(56, 189, 248, 0.1)' : (u.type === 'bloodbank' ? 'rgba(255, 59, 59, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
                                                    color: u.type === 'hospital' ? '#38bdf8' : (u.type === 'bloodbank' ? '#ff3b3b' : '#10b981'),
                                                    border: `1px solid ${u.type === 'hospital' ? 'rgba(56, 189, 248, 0.2)' : (u.type === 'bloodbank' ? 'rgba(255, 59, 59, 0.2)' : 'rgba(16, 185, 129, 0.2)')}`
                                                }}>
                                                    {u.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-dim)' }}>{u.email}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                                    className="premium-btn btn-outline" 
                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.7rem', color: 'var(--accent-primary)', borderColor: 'rgba(255, 59, 59, 0.2)' }}
                                                >
                                                    TERMINATE
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;

