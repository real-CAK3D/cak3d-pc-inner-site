import React from 'react';
import Window from '../os/Window';
import { NEWSSTAND_URL, papers, GITHUB } from '../../constants/cak3d';

export interface NewspapersProps extends WindowAppProps {}

/** The Corner Chronicle's rack: every Garden paper standing on the shelf showing its cover */
const Newspapers: React.FC<NewspapersProps> = (props) => {
    return (
        <Window
            top={30}
            left={120}
            width={1020}
            height={760}
            windowTitle="The Corner Chronicle"
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={`${papers.length} papers on the rack`}
        >
            <div className="site-page" style={styles.page}>
                <div style={styles.awning}>
                    <h1 style={styles.sign}>The Corner Chronicle</h1>
                    <p style={styles.sub}>Every Garden paper, written by Hermes agents on The Garden</p>
                </div>
                <div style={styles.rack}>
                    {papers.map((p) => (
                        <a
                            key={p.id}
                            href={`${NEWSSTAND_URL}/${p.id}/`}
                            target="_blank"
                            rel="noreferrer"
                            style={Object.assign({}, styles.cover, { background: p.color, color: p.ink })}
                        >
                            <span style={styles.when}>{p.when.toUpperCase()}</span>
                            <b style={styles.name}>{p.name}</b>
                            <i style={styles.motto}>{p.motto}</i>
                            <span style={styles.by}>by {p.by}</span>
                        </a>
                    ))}
                </div>
                <div style={styles.foot}>
                    <p>
                        The rack lives on CAK3D's private Tailscale network, so covers open there.{' '}
                        <a href={`${GITHUB}/NewsStand`} target="_blank" rel="noreferrer">
                            NewsStand on GitHub
                        </a>
                    </p>
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: {
        flexDirection: 'column',
        background: '#2e1c10',
        overflowY: 'auto',
        height: '100%',
    },
    awning: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        background: 'repeating-linear-gradient(90deg, #1f5a2a 0 40px, #f5eedb 40px 80px)',
        borderBottom: '6px solid #1b1510',
    },
    sign: {
        background: '#1b1510',
        color: '#f5eedb',
        padding: '6px 18px',
        fontSize: 38,
    },
    sub: {
        background: '#1b1510',
        color: '#e8d9a8',
        padding: '2px 10px',
        marginTop: 6,
        fontSize: 14,
    },
    rack: {
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        padding: 20,
    },
    cover: {
        width: 170,
        height: 220,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        boxSizing: 'border-box',
        textDecoration: 'none',
        border: '3px solid #1b1510',
        boxShadow: '4px 6px 0 rgba(0,0,0,0.5)',
        display: 'flex',
    },
    when: {
        fontSize: 11,
        letterSpacing: 2,
        borderBottom: '1px solid currentColor',
    },
    name: {
        fontSize: 24,
        lineHeight: 1,
    },
    motto: {
        fontSize: 13,
    },
    by: {
        fontSize: 11,
        opacity: 0.8,
    },
    foot: {
        justifyContent: 'center',
        padding: 12,
        color: '#e8d9a8',
        fontSize: 14,
    },
};

export default Newspapers;
