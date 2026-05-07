import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        type: 'hospital',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            if (res.data.success) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
                        <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem' }} className="title-gradient">Join Grid</h1>
                        <p style={{ letterSpacing: '0.3em', color: 'var(--accent-primary)', fontWeight: 'bold' }}>NETWORK REGISTRATION</p>
                    </div>
                </div>

                {/* Right: Form Side */}
                <div className="flex-center" style={{ padding: '2rem' }}>
                    <div className="glass-card animate-in" style={{ width: '100%', maxWidth: '520px', border: '1px solid rgba(255, 255, 255, 0.05)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '2.5rem' }} className="title-gradient">New Account</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Register your node in the Telangana health ecosystem.</p>
                        </div>

                        <form onSubmit={handleRegister}>
                            <div className="input-container">
                                <label>ACCOUNT CLASSIFICATION</label>
                                <select 
                                    name="type" 
                                    className="premium-input" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                    style={{ appearance: 'none' }}
                                >
                                    <option value="hospital">Hospital</option>
                                    <option value="bloodbank">Blood Bank</option>
                                    <option value="user">Individual User</option>
                                </select>
                            </div>

                            <div className="grid-cols-2" style={{ gap: '1rem' }}>
                                <div className="input-container">
                                    <label>FULL NAME</label>
                                    <input className="premium-input" type="text" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="input-container">
                                    <label>EMAIL ADDRESS</label>
                                    <input className="premium-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="grid-cols-2" style={{ gap: '1rem' }}>
                                <div className="input-container">
                                    <label>PASSWORD</label>
                                    <input className="premium-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="input-container">
                                    <label>PHONE</label>
                                    <input className="premium-input" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="input-container">
                                <label>PHYSICAL ADDRESS</label>
                                <input className="premium-input" type="text" name="address" value={formData.address} onChange={handleChange} required />
                            </div>

                            {error && <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

                            <button type="submit" className="premium-btn btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', marginTop: '1rem' }}>
                                Complete Registration
                            </button>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <Link to="/login" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                    Existing member? <span style={{ color: 'var(--accent-primary)' }}>Secure Login</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

