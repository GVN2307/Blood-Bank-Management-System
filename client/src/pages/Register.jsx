import React, { useState } from 'react';
import axios from 'axios';
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
            const res = await axios.post('http://localhost:3000/api/auth/register', formData);
            if (res.data.success) {
                alert('Registration Successful! Please Login.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="login-split">
            {/* Left: Visual (Reused from Login) */}
            <div className="login-visual">
                <img src="/assets/login.jpeg" alt="Medical Tech" />
                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', margin: 0 }}>Join LifeLink</h2>
                    <p style={{ letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.8 }}>Create Your Account</p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="login-form-container">
                <div style={{ width: '100%', maxWidth: '420px', overflowY: 'auto', maxHeight: '90vh' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Sign Up</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Enter your details to join the network.</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label className="input-label" style={{ position: 'static', marginBottom: '5px', display: 'block' }}>Account Type</label>
                            <select name="type" className="styled-input" value={formData.type} onChange={handleChange}>
                                <option value="hospital">Hospital</option>
                                <option value="bloodbank">Blood Bank</option>
                                <option value="user">Individual User</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <input className="styled-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" " required />
                            <label className="input-label">Full Name / Organization</label>
                        </div>

                        <div className="input-group">
                            <input className="styled-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required />
                            <label className="input-label">Email Address</label>
                        </div>

                        <div className="input-group">
                            <input className="styled-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder=" " required />
                            <label className="input-label">Password</label>
                        </div>

                        <div className="input-group">
                            <input className="styled-input" type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " required />
                            <label className="input-label">Phone Number</label>
                        </div>

                        <div className="input-group">
                            <input className="styled-input" type="text" name="address" value={formData.address} onChange={handleChange} placeholder=" " />
                            <label className="input-label">Address</label>
                        </div>

                        {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                            Register &rarr;
                        </button>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Already have an account? Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
