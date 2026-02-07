import { Briefcase, GraduationCap, Target, Sparkles, Baby } from 'lucide-react';

interface TimelineItem {
    year: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    glowColor: string;
}

export default function About() {
    const timeline: TimelineItem[] = [
        {
            year: '2003',
            title: 'The Beginning',
            subtitle: 'Born on December 5th',
            icon: <Baby size={18} />,
            color: '#f472b6',
            glowColor: 'rgba(244, 114, 182, 0.3)'
        },
        {
            year: '2019',
            title: 'Class 10th',
            subtitle: 'Vashistt Public School',
            icon: <GraduationCap size={18} />,
            color: '#a78bfa',
            glowColor: 'rgba(167, 139, 250, 0.3)'
        },
        {
            year: '2021',
            title: 'Class 12th',
            subtitle: 'Vashistt Public School',
            icon: <GraduationCap size={18} />,
            color: '#818cf8',
            glowColor: 'rgba(129, 140, 248, 0.3)'
        },
        {
            year: '2024',
            title: 'BCA Degree',
            subtitle: 'Chandigarh University',
            icon: <GraduationCap size={18} />,
            color: '#2dd4bf',
            glowColor: 'rgba(45, 212, 191, 0.3)'
        },
        {
            year: 'Mar 2024',
            title: 'Career Launch',
            subtitle: 'Web Developer @ SnakeScript',
            icon: <Briefcase size={18} />,
            color: '#facc15',
            glowColor: 'rgba(250, 204, 21, 0.3)'
        },
        {
            year: 'Present',
            title: 'MCA (Ongoing)',
            subtitle: 'Chandigarh University',
            icon: <Sparkles size={18} />,
            color: '#34d399',
            glowColor: 'rgba(52, 211, 153, 0.3)'
        }
    ];

    return (
        <section id="about" style={{
            position: 'relative',
            zIndex: 10,
            padding: '6rem 1.5rem',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '80rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="section-title">My Journey</h2>
                    <p className="section-subtitle" style={{ marginBottom: 0 }}>
                        From Curiosity to Code — The Story So Far
                    </p>
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(280px, 1fr) minmax(400px, 2fr)',
                    gap: '3rem',
                    alignItems: 'start'
                }}>

                    {/* Left: Profile Card */}
                    <div className="glass-card" style={{
                        padding: '2rem',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                width: '6rem',
                                height: '6rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #2dd4bf 100%)',
                                padding: '3px',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: '#0f172a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: 'white'
                                }}>
                                    RS
                                </div>
                                {/* Online indicator */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0.25rem',
                                    right: '0.25rem',
                                    width: '1rem',
                                    height: '1rem',
                                    borderRadius: '50%',
                                    background: '#34d399',
                                    border: '3px solid #0f172a'
                                }} />
                            </div>
                        </div>

                        {/* Name */}
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '0.25rem'
                        }}>Rahul Saini</h3>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            marginBottom: '1.5rem'
                        }}>Web Developer @ SnakeScript</p>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                            marginBottom: '1.5rem'
                        }} />

                        {/* Vision Card */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(45, 212, 191, 0.1) 100%)',
                            borderRadius: '1rem',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Animated corner glow */}
                            <div style={{
                                position: 'absolute',
                                top: '-30%',
                                right: '-30%',
                                width: '60%',
                                height: '60%',
                                background: 'radial-gradient(circle, rgba(45, 212, 191, 0.25) 0%, transparent 70%)',
                                pointerEvents: 'none',
                                animation: 'pulse 4s ease-in-out infinite'
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: '-30%',
                                left: '-30%',
                                width: '50%',
                                height: '50%',
                                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                                pointerEvents: 'none',
                                animation: 'pulse 5s ease-in-out infinite reverse'
                            }} />

                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    borderRadius: '0.5rem',
                                    background: 'linear-gradient(135deg, #7c3aed, #2dd4bf)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Target size={14} style={{ color: 'white' }} />
                                </div>
                                <span style={{
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'
                                }}>My Vision</span>
                            </div>

                            {/* Quote */}
                            <div style={{ position: 'relative', paddingLeft: '1rem', borderLeft: '3px solid #2dd4bf' }}>
                                <p style={{
                                    color: '#f1f5f9',
                                    lineHeight: 1.8,
                                    fontSize: '1rem',
                                    fontStyle: 'italic',
                                    fontWeight: 500
                                }}>
                                    "To architect and build <span style={{ color: '#2dd4bf', fontWeight: 700 }}>full-stack AI solutions</span> and
                                    <span style={{ color: '#a78bfa', fontWeight: 700 }}> scalable infrastructure</span> that
                                    solve <span style={{ color: '#f472b6', fontWeight: 700 }}>real-world problems</span> at scale."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Timeline */}
                    <div style={{ position: 'relative' }}>
                        {/* Timeline Track */}
                        <div style={{
                            position: 'absolute',
                            left: '1.5rem',
                            top: '2rem',
                            bottom: '2rem',
                            width: '2px',
                            background: 'linear-gradient(to bottom, #7c3aed, #2dd4bf)',
                            opacity: 0.5
                        }} />

                        {/* Timeline Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {timeline.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="glass-card"
                                    style={{
                                        marginLeft: '3.5rem',
                                        padding: '1.25rem 1.5rem',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        borderLeft: `3px solid ${item.color}`
                                    }}
                                >
                                    {/* Node Circle */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-3.85rem',
                                        top: '1.25rem',
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        background: '#0f172a',
                                        border: `2px solid ${item.color}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: item.color,
                                        boxShadow: `0 0 20px ${item.glowColor}`
                                    }}>
                                        {item.icon}
                                    </div>

                                    {/* Content */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div>
                                            <h4 style={{
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '1.1rem',
                                                marginBottom: '0.25rem'
                                            }}>{item.title}</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.subtitle}</p>
                                        </div>
                                        <span style={{
                                            padding: '0.35rem 0.75rem',
                                            background: `linear-gradient(135deg, ${item.glowColor}, transparent)`,
                                            border: `1px solid ${item.color}40`,
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontFamily: 'monospace',
                                            color: item.color,
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap'
                                        }}>{item.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
