import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper" style={{ padding: 0, maxWidth: 'none' }}>
            {/* Dynamic Backgrounds */}
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            {/* Hero Section */}
            <section style={{ 
                position: 'relative', 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                {/* Background Image with Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1
                }}>
                    <img 
                        src="/blood_bank_hero_bg_1778141203099.png" 
                        alt="Hero Background" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 30% 50%, transparent 0%, var(--bg-dark) 80%)'
                    }}></div>
                </div>

                <div className="page-wrapper animate-in" style={{ marginTop: 0 }}>
                    <div className="nav-dock" style={{ zIndex: 1000 }}>
                        <div 
                            className="flex-center hover-lift" 
                            style={{ gap: '12px', cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                background: 'var(--accent-primary)', 
                                borderRadius: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(255, 59, 59, 0.4)'
                            }}>
                                <span style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem' }}>L</span>
                            </div>
                            <h2 style={{ fontSize: '1.6rem', margin: 0, letterSpacing: '-0.03em' }}>
                                Life<span style={{ color: 'var(--accent-primary)' }}>Link</span>
                            </h2>
                        </div>
                        <div className="flex-center" style={{ gap: '2rem' }}>
                            <span onClick={() => navigate('/community')} style={{ fontSize: '0.9rem', color: 'var(--text-white)', cursor: 'pointer', fontWeight: '500' }}>Network</span>
                            <span onClick={() => navigate('/community')} style={{ fontSize: '0.9rem', color: 'var(--text-white)', cursor: 'pointer', fontWeight: '500' }}>Stats</span>
                            <button onClick={() => navigate('/login')} className="premium-btn btn-accent" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>Login</button>
                        </div>
                    </div>

                    <div style={{ maxWidth: '800px', marginTop: '4rem' }}>
                        <div className="stat-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
                            <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
                            LIVE: TELANGANA EMERGENCY GRID ACTIVE
                        </div>

                        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, marginBottom: '2rem' }}>
                            <span className="title-gradient">The Pulse of</span> <br />
                            <span className="title-accent">Emergency Care</span>
                        </h1>

                        <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '600px', marginBottom: '3rem' }}>
                            LifeLink is an intelligent nervous system connecting every hospital and blood bank. 
                            Real-time tracking, zero-latency response, and a single goal: Saving Lives.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button onClick={() => navigate('/register')} className="premium-btn btn-accent" style={{ padding: '1.2rem 3rem' }}>
                                Join the Network
                            </button>
                            <button onClick={() => navigate('/community')} className="premium-btn btn-outline" style={{ padding: '1.2rem 3rem' }}>
                                View Analytics
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid-cols-4" style={{ marginTop: '8rem' }}>
                        {[
                            { label: 'Hospitals Linked', value: '48+', accent: 'var(--accent-secondary)' },
                            { label: 'Blood Units', value: '1.2k', accent: 'var(--accent-primary)' },
                            { label: 'Response Time', value: '< 2m', accent: 'var(--accent-tertiary)' },
                            { label: 'Saved Lives', value: '850+', accent: '#10B981' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <h3 style={{ fontSize: '2.5rem', color: stat.accent, marginBottom: '0.5rem' }}>{stat.value}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;
