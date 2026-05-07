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
                        <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', fontWeight: '500' }} className="title-gradient">Secure Node</h1>
                        <p style={{ letterSpacing: '0.2em', color: 'var(--accent-primary)', fontSize: '0.8rem' }}>Authorized nodes only</p>
                    </div>
                </div>

                {/* Right: Form Side */}
                <div className="flex-center" style={{ padding: '2rem', position: 'relative' }}>
                    {/* Floating Back Button & Logo */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '2.5rem', 
                        left: '2.5rem', 
                        right: '2.5rem', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        zIndex: 100
                    }}>
                        <button 
                            onClick={() => navigate('/')}
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.05)', 
                                border: '1px solid var(--border-glass)', 
                                color: 'white', 
                                padding: '0.7rem 1.4rem', 
                                borderRadius: '30px', 
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s',
                                backdropFilter: 'blur(10px)'
                            }}
                            className="hover-lift"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to hub
                        </button>

                        <div 
                            className="flex-center hover-lift" 
                            style={{ gap: '12px', cursor: 'pointer' }}
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
                            <h2 style={{ fontSize: '1.2rem', margin: 0, letterSpacing: '-0.03em' }}>
                                Life<span style={{ color: 'var(--accent-primary)' }}>Link</span>
                            </h2>
                        </div>
                    </div>

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
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {role === 'bloodbank' ? 'Blood Bank' : role}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="input-container">
                                <label>Email address</label>
                                <input
                                    className="premium-input"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label>Secure password</label>
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
