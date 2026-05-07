import React from 'react';
import { useNavigate } from 'react-router-dom';

const LEADERS = [
    { name: 'Ravi Kumar', units: 45, badge: 'Gold Donor', color: '#ffd700' },
    { name: 'Sita Reddy', units: 32, badge: 'Silver Donor', color: '#c0c0c0' },
    { name: 'Arjun Das', units: 28, badge: 'Silver Donor', color: '#c0c0c0' },
    { name: 'Priya S', units: 15, badge: 'Bronze Donor', color: '#cd7f32' },
    { name: 'Mohammed Ali', units: 12, badge: 'Bronze Donor', color: '#cd7f32' }
];

const STORIES = [
    { name: 'Anjali', story: "My father needed O- blood urgently. Thanks to LifeLink, we found a donor in 15 mins!", date: '2 days ago' },
    { name: 'Rajesh', story: "Celebrating my 10th donation today. Feels good to save lives.", date: '1 week ago' }
];

function Community() {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper" style={{ padding: 0 }}>
            <div className="app-bg"></div>
            <div className="mesh-grid"></div>

            <div className="container animate-in" style={{ padding: '4rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
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
                        BACK TO HUB
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
                        <h2 style={{ fontSize: '1.4rem', margin: 0, letterSpacing: '-0.03em' }}>
                            Life<span style={{ color: 'var(--accent-primary)' }}>Link</span>
                        </h2>
                    </div>
                </div>

                <div style={{ marginBottom: '4rem' }}>
                    <h1 className="title-gradient" style={{ fontSize: '4rem', marginBottom: '1rem' }}>Community Heroes</h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px' }}>
                        Celebrating the champions of the Telangana Health Grid.
                    </p>
                </div>

                <div className="grid-cols-2" style={{ gap: '4rem', alignItems: 'start' }}>
                    {/* Leaderboard */}
                    <div>
                        <h2 className="title-accent" style={{ marginBottom: '2rem' }}>TOP DONORS</h2>
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {LEADERS.map((leader, index) => (
                                <div key={index} style={{
                                    padding: '1.5rem 2rem',
                                    borderBottom: '1px solid var(--border-glass)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: index === 0 ? 'rgba(255, 215, 0, 0.05)' : 'transparent'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '10px',
                                            background: leader.color,
                                            color: 'black', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: `0 0 20px ${leader.color}44`
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>{leader.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{leader.badge}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{leader.units}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>UNITS</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stories */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h2 className="title-accent">IMPACT STORIES</h2>
                        {STORIES.map((story, index) => (
                            <div key={index} className="glass-card" style={{ padding: '2rem' }}>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'white', marginBottom: '1.5rem' }}>"{story.story}"</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{story.name}</span>
                                    <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{story.date}</span>
                                </div>
                            </div>
                        ))}

                        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-glass)' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Share your journey</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Inspire the next wave of donors.</p>
                            <button 
                                onClick={() => alert('Your story has been submitted to the regional council for verification.')}
                                className="premium-btn btn-accent" 
                                style={{ padding: '0.75rem 2rem' }}
                            >
                                POST TO GRID
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Community;

