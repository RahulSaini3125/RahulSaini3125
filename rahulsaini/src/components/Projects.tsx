import { Mic, Plane } from 'lucide-react';

interface ProjectCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    technologies: string[];
    highlights: string[];
}

function ProjectCard({ icon, title, description, technologies, highlights }: ProjectCardProps) {
    return (
        <div className="glass-card" style={{
            padding: '2rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(20, 184, 166, 0.2))',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{title}</h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <span style={{
                            width: '0.375rem',
                            height: '0.375rem',
                            backgroundColor: '#34d399',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                        }} />
                        Production Ready
                    </div>
                </div>
            </div>

            {/* Description */}
            <p style={{
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                lineHeight: 1.7,
                flexGrow: 1
            }}>
                {description}
            </p>

            {/* Highlights */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem',
                    fontWeight: 600
                }}>
                    Core Contributions
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {highlights.map((highlight, idx) => (
                        <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: '#94a3b8'
                        }}>
                            <span style={{ color: '#2dd4bf', marginTop: '2px' }}>▹</span>
                            {highlight}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Technologies */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(51, 65, 85, 0.5)'
            }}>
                {technologies.map((tech) => (
                    <span
                        key={tech}
                        style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.75rem',
                            backgroundColor: 'rgba(30, 41, 59, 0.5)',
                            border: '1px solid rgba(51, 65, 85, 0.5)',
                            borderRadius: '9999px',
                            color: '#cbd5e1'
                        }}
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Projects() {
    const projects: ProjectCardProps[] = [
        {
            icon: <Mic style={{ width: '1.5rem', height: '1.5rem', color: '#a78bfa' }} />,
            title: "AI Voice Agent Infrastructure",
            description: "Enterprise-grade voice AI system enabling natural language conversations with intelligent agents. Built scalable infrastructure for real-time voice processing and AI response generation.",
            technologies: ["Pipecat", "FastAPI", "Redis"],
            highlights: [
                "Architected low-latency audio streaming pipeline",
                "Integrated advanced conversational AI capabilities",
                "Developed fault-tolerant WebSocket infrastructure",
                "Optimized system for <200ms response latency"
            ]
        },
        {
            icon: <Plane style={{ width: '1.5rem', height: '1.5rem', color: '#2dd4bf' }} />,
            title: "Automated Flight Logistics",
            description: "Python-based automation tool for extracting and processing flight details from emails. Streamlines travel logistics by automatically parsing booking confirmations and itineraries.",
            technologies: ["Django", "Email IMAP", "Open AI", "Celery"],
            highlights: [
                "Engineered automated data extraction from complex email formats",
                "Implemented flexible parsing supporting multiple airlines",
                "Synchronized flight data with corporate calendar systems",
                "Scaled for batch processing of high-volume travel data"
            ]
        }
    ];

    return (
        <section style={{
            position: 'relative',
            zIndex: 10,
            padding: '5rem 1.5rem',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '72rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}>
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Case Studies</h2>
                    <p className="section-subtitle">
                        Featured Projects • Production-Grade Engineering
                    </p>
                </div>

                {/* Project Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {projects.map((project) => (
                        <ProjectCard key={project.title} {...project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
