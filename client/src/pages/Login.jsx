import React, { useState } from 'react';
import axios from 'axios';
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
            // Updated to use /api/auth/login
            const res = await axios.post('http://localhost:3000/api/auth/login', { email, password, type });
            if (res.data.success) {
                // Store Token
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
        <div className="login-split">
            {/* Left: Visual */}
            <div className="login-visual">
                <img src="/assets/login.jpeg" alt="Medical Tech" />
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', margin: 0 }}>LifeLink</h2>
                    <p style={{ letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.8 }}>Secure Access Node</p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="login-form-container">
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access the network.</p>
                    </div>

                    {/* Premium Tab Switcher */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '40px' }}>
                        {['hospital', 'bloodbank', 'user', 'admin'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setType(role)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: type === role ? (role === 'hospital' || role === 'user' ? 'var(--primary)' : 'var(--secondary)') : 'rgba(255,255,255,0.05)',
                                    color: type === role ? (role === 'bloodbank' || role === 'admin' ? 'black' : 'white') : 'var(--text-muted)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {role === 'bloodbank' ? 'Blood Bank' : role}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input
                                className="styled-input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder=" "
                            />
                            <label className="input-label">Email Address</label>
                        </div>

                        <div className="input-group">
                            <input
                                className="styled-input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder=" "
                            />
                            <label className="input-label">Password</label>
                        </div>

                        {error && <p style={{ color: '#ff6b6b', marginTop: '-10px', fontSize: '0.9rem' }}>{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                            Authenticate &rarr;
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Don't have an account? Sign Up</Link>
                        </div>
                    </form>
                </div>

                <div style={{ position: 'absolute', bottom: '30px', color: '#555', fontSize: '0.8rem' }}>
                    Protected by Telangana Government Health Data Privacy Act
                </div>
            </div>
        </div>
    );
}

export default Login;
