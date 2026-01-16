import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="hero-wrapper">
            {/* Background with Blend Mode */}
            <div className="hero-bg">
                <img src="/assets/home.jpeg" alt="Medical Network" />
            </div>
            <div className="hero-overlay"></div>

            <div className="container hero-content">
                <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#00f2ea', marginRight: '8px' }}>●</span> Online • Telangana Health Grid
                </div>

                <h1 style={{ fontSize: '5.5rem', margin: '0 0 24px 0', lineHeight: 1.1 }}>
                    The Heart of <br />
                    <span className="gradient-text-primary">Emergency Care</span>
                </h1>

                <p style={{ fontSize: '1.4rem', color: '#ccc', maxWidth: '600px', lineHeight: 1.6, marginBottom: '40px' }}>
                    LifeLink connects every hospital and blood bank in Telangana into a single, intelligent nervous system. Real-time location tracking. Instant automated alerts. Zero latency.
                </p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ minWidth: '180px' }}>
                        Access Portal
                    </button>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', minWidth: '180px' }}>
                        View Live Map
                    </button>
                </div>

                {/* Stats Strip */}
                <div className="glass-panel" style={{ marginTop: '80px', padding: '30px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>42+</h3>
                        <small style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Hospitals Linked</small>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>12</h3>
                        <small style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Blood Banks</small>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', margin: 0, color: '#00f2ea' }}>24/7</h3>
                        <small style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Monitoring</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
