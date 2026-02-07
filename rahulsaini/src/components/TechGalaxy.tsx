import { Brain, Cloud } from 'lucide-react';
import type { ReactNode } from 'react';

interface Satellite {
    name: string;
    icon: string | ReactNode;
}

interface GalaxyRowProps {
    planetIcon: ReactNode;
    planetName: string;
    satellites: Satellite[];
    direction?: 'left' | 'right';
    speed?: number;
}

// Devicon CDN base URL
const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

// Helper to generate devicon URL
const devicon = (name: string, variant: string = 'original') =>
    `${DEVICON_CDN}/${name}/${name}-${variant}.svg`;

function GalaxyRow({ planetIcon, planetName, satellites, direction = 'left', speed = 30 }: GalaxyRowProps) {
    const duplicatedSatellites = [...satellites, ...satellites];

    return (
        <div style={{
            marginBottom: '3rem',
            width: '100%'
        }}>
            {/* Centered Heading */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem'
            }}>
                <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    textAlign: 'center'
                }}>{planetName}</h3>

                {/* Icon below heading */}
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {planetIcon}
                </div>
            </div>

            {/* Scrolling Icons */}
            <div className="marquee-container" style={{ overflow: 'hidden' }}>
                <div
                    className="marquee-track"
                    style={{
                        '--duration': `${speed}s`,
                        animationDirection: direction === 'right' ? 'reverse' : 'normal'
                    } as React.CSSProperties}
                >
                    {duplicatedSatellites.map((sat, idx) => (
                        <div
                            key={`${sat.name}-${idx}`}
                            title={sat.name}
                            style={{
                                margin: '0 1.5rem',
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                cursor: 'default'
                            }}
                        >
                            {typeof sat.icon === 'string' ? (
                                <img src={sat.icon} alt={sat.name} loading="lazy" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '4rem' }}>{sat.icon}</span>
                            )}
                            <span style={{
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {sat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function TechGalaxy() {
    // Galaxy 1: Frontend
    const frontendSatellites: Satellite[] = [
        { name: 'Tailwind CSS', icon: devicon('tailwindcss') },
        { name: 'Redux', icon: devicon('redux') },
        { name: 'Next.js', icon: devicon('nextjs') },
        { name: 'TypeScript', icon: devicon('typescript') },
        { name: 'Vite', icon: devicon('vitejs') },
        { name: 'HTML5', icon: devicon('html5') },
        { name: 'CSS3', icon: devicon('css3') },
    ];

    // Galaxy 2: Backend & Logic
    const backendSatellites: Satellite[] = [
        { name: 'Django', icon: devicon('django', 'plain') },
        { name: 'FastAPI', icon: devicon('fastapi') },
        { name: 'Celery', icon: 'https://docs.celeryq.dev/en/stable/_static/celery_512.png' },
        { name: 'SQLAlchemy', icon: devicon('sqlalchemy') },
        { name: 'Pydantic', icon: 'https://avatars.githubusercontent.com/u/110818415?s=200&v=4' },
        { name: 'PostgreSQL', icon: devicon('postgresql') },
    ];

    // Galaxy 3: AI & RAG
    const aiSatellites: Satellite[] = [
        { name: 'LangChain', icon: '/LangChain-logo.svg' },
        { name: 'LangGraph', icon: '/LangGraph wordmark - dark.svg' },
        { name: 'Milvus', icon: '/milvus-icon-logo.svg' },
        { name: 'OpenAI', icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Anthropic', icon: 'https://cdn.simpleicons.org/anthropic/ffffff' },
        { name: 'Grok', icon: 'https://cdn.simpleicons.org/x/ffffff' },
        { name: 'Ollama', icon: 'https://ollama.com/public/ollama.png' },
        { name: 'Azure AI', icon: devicon('azure') },
    ];

    // Galaxy 4: Cloud & Infrastructure
    const cloudSatellites: Satellite[] = [
        { name: 'AWS EC2', icon: '/EC2.svg' },
        { name: 'AWS Batch', icon: '/Batch.svg' },
        { name: 'Step Functions', icon: '/StepFunctions.svg' },
        { name: 'Lambda', icon: '/Lambda.svg' },
        { name: 'EventBridge', icon: '/EventBridge.svg' },
        { name: 'Azure Apps', icon: devicon('azure') },
        { name: 'Docker', icon: devicon('docker') },
        { name: 'Nginx', icon: devicon('nginx') },
    ];

    return (
        <section style={{
            position: 'relative',
            zIndex: 10,
            padding: '5rem 1.5rem',
            width: '100%'
        }}>
            {/* Section Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '4rem'
            }}>
                <h2 className="section-title">Technical Expertise</h2>
                <p className="section-subtitle" style={{ marginBottom: 0 }}>
                    Specialized Toolkit • Industry-Leading Technologies
                </p>
            </div>

            {/* Expertise Rows - Stacked vertically */}
            <div style={{
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}>
                <GalaxyRow
                    planetIcon={<img src={devicon('react')} alt="React" style={{ width: '2.5rem', height: '2.5rem' }} />}
                    planetName="Frontend"
                    satellites={frontendSatellites}
                    speed={35}
                />

                <GalaxyRow
                    planetIcon={<img src={devicon('python')} alt="Python" style={{ width: '2.5rem', height: '2.5rem' }} />}
                    planetName="Backend"
                    satellites={backendSatellites}
                    direction="right"
                    speed={40}
                />

                <GalaxyRow
                    planetIcon={<Brain style={{ width: '2.5rem', height: '2.5rem', color: '#a78bfa' }} />}
                    planetName="AI & Intelligence"
                    satellites={aiSatellites}
                    speed={45}
                />

                <GalaxyRow
                    planetIcon={<Cloud style={{ width: '2.5rem', height: '2.5rem', color: '#2dd4bf' }} />}
                    planetName="Infra & Cloud"
                    satellites={cloudSatellites}
                    direction="right"
                    speed={38}
                />
            </div>
        </section>
    );
}
