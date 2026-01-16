import React from 'react';
import { useNavigate } from 'react-router-dom';

const LEADERS = [
    { name: 'Ravi Kumar', units: 45, badge: 'Gold Donor' },
    { name: 'Sita Reddy', units: 32, badge: 'Silver Donor' },
    { name: 'Arjun Das', units: 28, badge: 'Silver Donor' },
    { name: 'Priya S', units: 15, badge: 'Bronze Donor' },
    { name: 'Mohammed Ali', units: 12, badge: 'Bronze Donor' }
];

const STORIES = [
    { name: 'Anjali', story: "My father needed O- blood urgently. Thanks to LifeLink, we found a donor in 15 mins!", date: '2 days ago' },
    { name: 'Rajesh', story: "Celebrating my 10th donation today. Feels good to save lives.", date: '1 week ago' }
];

function Community() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '50px' }}>
            <nav className="navbar container">
                <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/user-dashboard')}>
                    <span className="logo-text">&larr; Dashboard</span>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '20px' }}>
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginBottom: '40px', background: 'linear-gradient(135deg, rgba(250, 0, 63, 0.2), rgba(0,0,0,0))' }}>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>Community Heroes</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '10px auto' }}>
                        Celebrating the heroes who save lives every day. Join the leaderboard by donating today.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
                    {/* Leaderboard */}
                    <div>
                        <h2 className="gradient-text">Top Donors (Telangana)</h2>
                        <div className="glass-panel" style={{ padding: '0' }}>
                            {LEADERS.map((leader, index) => (
                                <div key={index} style={{
                                    padding: '20px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: index === 0 ? '#ffd700' : (index === 1 ? '#c0c0c0' : '#cd7f32'),
                                            color: 'black', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{leader.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{leader.badge}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{leader.units} Units</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stories */}
                    <div>
                        <h2 className="gradient-text">Real Stories</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {STORIES.map((story, index) => (
                                <div key={index} className="glass-panel" style={{ padding: '25px' }}>
                                    <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.6' }}>"{story.story}"</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>- {story.name}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{story.date}</span>
                                    </div>
                                </div>
                            ))}

                            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', border: '1px dashed var(--text-muted)' }}>
                                <h3 style={{ margin: 0 }}>Share your story</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Inspire others to donate.</p>
                                <button className="btn" style={{ marginTop: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' }}>Write a Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Community;
