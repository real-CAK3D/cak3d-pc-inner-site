import React from 'react';
import { apps, featured, links, Project } from '../../../constants/cak3d';

export interface SoftwareProjectsProps {}

// sites that refuse to load inside the PC (or live on the private tailnet) open in a new tab instead
const runsHere = (url: string) => url.startsWith('https://') && !/github\.com|\.ts\.net|discord\.gg|nitrado/.test(url);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="text-block" style={styles.card}>
        <div style={styles.cardHeader}>
            <h3>{project.name}</h3>
            {project.language && <p style={styles.lang}>{project.language}</p>}
        </div>
        {project.description && <p>{project.description}</p>}
        <div style={styles.links}>
            {project.url && runsHere(project.url) && (
                <a
                    href={project.url}
                    onClick={(e) => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('cak3d-browse', { detail: { url: project.url } }));
                    }}
                >
                    <p>Run on this PC</p>
                </a>
            )}
            {project.url && (
                <a rel="noreferrer" target="_blank" href={project.url}>
                    <p>Open it up</p>
                </a>
            )}
            {project.repo && (
                <a rel="noreferrer" target="_blank" href={project.repo}>
                    <p>GitHub</p>
                </a>
            )}
        </div>
    </div>
);

const SoftwareProjects: React.FC<SoftwareProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Software</h1>
            <h3>Bots, Apps & Servers</h3>
            <br />
            <div className="text-block">
                <p>
                    My DayZ server tweaks are all about glitch-free experiences.
                    I enjoy a very immersive realistic feel when it comes to
                    gaming, so that's what I aim to provide with my edits. The
                    bots keep the communities running around the clock.
                </p>
            </div>
            {featured.map((p) => (
                <ProjectCard key={p.name} project={p} />
            ))}
            <br />
            <h2>On GitHub</h2>
            <br />
            <p>
                Everything else lives at{' '}
                <a rel="noreferrer" target="_blank" href={links.github}>
                    github.com/real-CAK3D
                </a>
                . A few favorites:
            </p>
            <br />
            {apps.map((p) => (
                <ProjectCard key={p.name} project={p} />
            ))}
        </div>
    );
};

const styles: StyleSheetCSS = {
    card: {
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        padding: 16,
        marginBottom: 16,
        border: '2px solid #000',
    },
    cardHeader: {
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    lang: {
        opacity: 0.6,
    },
    links: {
        gap: 24,
        marginTop: 8,
    },
};

export default SoftwareProjects;
