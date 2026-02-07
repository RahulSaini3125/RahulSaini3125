import { Rocket, Clock, Zap, Code2 } from 'lucide-react';

function calculateExperience(): string {
    const startDate = new Date('2024-03-06');
    const now = new Date();

    const diffMs = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    const parts: string[] = [];
    if (years > 0) parts.push(`${years}+ Year${years > 1 ? 's' : ''}`);
    if (months > 0 && years === 0) parts.push(`${months} Month${months > 1 ? 's' : ''}`);

    return parts.join(' ') || 'Fresh Start';
}

export default function Hero() {
    const experience = calculateExperience();

    return (
        <section style={{
            position: 'relative',
            zIndex: 10,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 1.5rem',
            width: '100%'
        }}>
            {/* Profile Header */}
            <div style={{
                textAlign: 'center',
                maxWidth: '56rem',
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                {/* Name Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '9999px',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700
                    }}>RS</div>
                    <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Rahul Saini</span>
                </div>

                {/* Main Headline */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    lineHeight: 1.1
                }}>
                    <span style={{
                        background: 'linear-gradient(to right, #a78bfa, #f472b6, #2dd4bf)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Full Stack AI
                    </span>
                    <br />
                    <span style={{ color: '#f1f5f9' }}>
                        & Infrastructure Engineer
                    </span>
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    color: '#94a3b8',
                    marginBottom: '2.5rem',
                    maxWidth: '42rem',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    lineHeight: 1.7
                }}>
                    Web Developer at <strong style={{ color: '#e2e8f0' }}>SnakeScript Solutions LLP</strong>, building intelligent systems
                    that bridge the gap between AI innovations and scalable infrastructure.
                </p>

                {/* Experience Badge */}
                <div className="mission-badge" style={{ color: '#c4b5fd', marginBottom: '3rem' }}>
                    <Clock style={{ width: '1.25rem', height: '1.25rem' }} />
                    <span style={{ fontFamily: 'monospace' }}>EXPERIENCE:</span>
                    <span style={{ color: '#5eead4', fontWeight: 700, letterSpacing: '0.05em' }}>{experience}</span>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '48rem',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Rocket style={{ width: '2rem', height: '2rem', color: '#a78bfa', margin: '0 auto 0.75rem' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>AI Solutions</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>RAG & Agent Architectures</div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Code2 style={{ width: '2rem', height: '2rem', color: '#2dd4bf', margin: '0 auto 0.75rem' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Full Stack</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>React to Python Backend</div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Zap style={{ width: '2rem', height: '2rem', color: '#facc15', margin: '0 auto 0.75rem' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>Infrastructure</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>AWS & Azure Cloud</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
