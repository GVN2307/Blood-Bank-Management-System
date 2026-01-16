import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ donations: 0, lastDonation: 'N/A' });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);

        // Fetch user stats (mock or real)
        // In a real app: axios.get(\`/api/user/stats/\${storedUser.id}\`)
        // For now, using mock data or simple calculation
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <nav className="navbar container">
                <div className="logo-container">
                    <img src="/assets/logo.png" alt="Logo" style={{ height: '40px' }} onError={(e) => e.target.style.display = 'none'} />
                    <span className="logo-text">LifeLink <span style={{ color: 'var(--primary)', fontSize: '0.8em', textTransform: 'uppercase', letterSpacing: '2px' }}>Citizen</span></span>
                </div>
                <button onClick={handleLogout} className="btn" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Logout</button>
            </nav>

            <div className="container" style={{ marginTop: '40px' }}>
                <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Hello, <span className="gradient-text-primary">{user.name}</span></h1>
                            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Member ID: #{user.id.toString().padStart(6, '0')}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Blood Group</p>
                            <h2 style={{ margin: 0, fontSize: '3rem', color: 'var(--primary)' }}>{user.bloodGroup || 'O+'}</h2>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* Action Card 1: Schedule Test */}
                    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h2>💉 Schedule Tests</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>
                            Find nearby hospitals and book blood, urine, or general health checkups instantly.
                        </p>
                        <button onClick={() => navigate('/test-schedule')} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                            Book Appointment
                        </button>
                    </div>

                    {/* Action Card 2: Medical Reports */}
                    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h2>📄 Medical Reports</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>
                            Understand your test results. Browse detailed information about common health metrics.
                        </p>
                        <button onClick={() => navigate('/user-reports')} className="btn" style={{ width: '100%', marginTop: '20px', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                            View Knowledge Base
                        </button>
                    </div>

                    {/* Action Card 3: Community */}
                    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <h2>🌍 Community</h2>
                        <p style={{ color: 'var(--text-muted)', flex: 1 }}>
                            Connect with other donors. View leaderboards and shared donation stories.
                        </p>
                        <button onClick={() => navigate('/community')} className="btn" style={{ width: '100%', marginTop: '20px', background: 'var(--secondary)', color: 'black' }}>
                            Explore Network
                        </button>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '30px', marginTop: '40px' }}>
                    <h3>Recent Activity</h3>
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No recent activity to show.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
