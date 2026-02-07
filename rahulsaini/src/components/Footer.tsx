import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinkStyle: React.CSSProperties = {
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        textDecoration: 'none'
    };

    return (
        <footer style={{
            position: 'relative',
            zIndex: 10,
            padding: '3rem 1.5rem',
            borderTop: '1px solid rgba(30, 41, 59, 0.5)',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '72rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem'
                }}>
                    {/* Logo / Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '0.5rem',
                            background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'white'
                        }}>
                            RS
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'white' }}>Rahul Saini</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>Full Stack AI Engineer</div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <a href="https://github.com/RahulSaini3125" target="_blank" rel="noopener noreferrer" style={socialLinkStyle} aria-label="GitHub">
                            <Github style={{ width: '1.25rem', height: '1.25rem' }} />
                        </a>
                        <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile" target="_blank" rel="noopener noreferrer" style={socialLinkStyle} aria-label="LinkedIn">
                            <Linkedin style={{ width: '1.25rem', height: '1.25rem' }} />
                        </a>
                        <a href="https://x.com/rahul_sain61010" target="_blank" rel="noopener noreferrer" style={socialLinkStyle} aria-label="Twitter">
                            <Twitter style={{ width: '1.25rem', height: '1.25rem' }} />
                        </a>
                        <a href="mailto:rahulsaini3125@gmail.com" style={socialLinkStyle} aria-label="Email">
                            <Mail style={{ width: '1.25rem', height: '1.25rem' }} />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div style={{ fontSize: '0.875rem', color: '#64748b', fontFamily: 'monospace' }}>
                        <span style={{ color: '#a78bfa' }}>©</span> {currentYear} • Built with{' '}
                        <span style={{ color: '#2dd4bf' }}>React</span> +{' '}
                        <span style={{ color: '#a78bfa' }}>Tailwind</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
