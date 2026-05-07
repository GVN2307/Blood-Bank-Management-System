import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('hospital');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password, type });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                if (type === 'hospital') navigate('/hospital-dashboard');
                else if (type === 'bloodbank') navigate('/bloodbank-dashboard');
                else if (type === 'user') navigate('/user-dashboard');
                else if (type === 'admin') navigate('/admin-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };


    return (
        <div className="page-wrapper" style={{ padding: 0, maxWidth: 'none', overflow: 'hidden' }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            <div className="grid-cols-2" style={{ height: '100vh', gap: 0 }}>
                {/* Left: Visual Side */}
                <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                        src="/login_visual_premium_1778141277668.png" 
                        alt="Security Visual" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255, 59, 59, 0.4), rgba(5, 7, 10, 0.9))' }}></div>
                    <div className="animate-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                        <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem' }} className="title-gradient">Secure Node</h1>
                        <p style={{ letterSpacing: '0.3em', color: 'var(--accent-primary)', fontWeight: 'bold' }}>ACCESS GRANTED ONLY</p>
                    </div>
                </div>

                {/* Right: Form Side */}
                <div className="flex-center" style={{ padding: '2rem' }}>
                    <div className="glass-card animate-in" style={{ width: '100%', maxWidth: '480px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem' }} className="title-gradient">Welcome Back</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Identify yourself to the network.</p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid-cols-2" style={{ gap: '10px', marginBottom: '2.5rem' }}>
                            {['hospital', 'bloodbank', 'user', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setType(role)}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        border: '1px solid',
                                        borderColor: type === role ? 'var(--accent-primary)' : 'var(--border-glass)',
                                        background: type === role ? 'rgba(255, 59, 59, 0.1)' : 'transparent',
                                        color: type === role ? 'white' : 'var(--text-dim)',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {role === 'bloodbank' ? 'Blood Bank' : role}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="input-container">
                                <label>EMAIL ADDRESS</label>
                                <input
                                    className="premium-input"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label>ENCRYPTED PASSWORD</label>
                                <input
                                    className="premium-input"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

                            <button type="submit" className="premium-btn btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
                                Authenticate
                            </button>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <Link to="/register" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                    New to LifeLink? <span style={{ color: 'var(--accent-primary)' }}>Request Access</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

