import React, { useEffect, useState } from 'react';
import Window from '../os/Window';
import { links, sites } from '../../constants/cak3d';

/** What a floppy / gadget / desk prop in the 3D room hands the PC to open */
export type LoadedItem = {
    name: string;
    description?: string;
    language?: string;
    url?: string;
    repo?: string;
    model?: string;
};

export interface BrowserProps extends WindowAppProps {
    startUrl?: string;
    item?: LoadedItem;
    via?: 'floppy' | 'gadget' | 'desk';
}

// These refuse to load inside an iframe, so we show an info page instead
const NO_FRAME_HOSTS = ['arachnotes-web.vercel.app']; // sites that send frame-ancestors 'none'
const blocksFraming = (url: string) =>
    /^https?:\/\/(www\.)?github\.com/.test(url) ||
    url.startsWith('http://') ||
    /\.ts\.net/.test(url) ||
    NO_FRAME_HOSTS.some((h) => url.indexOf(h) >= 0);

const Browser: React.FC<BrowserProps> = (props) => {
    const [url, setUrl] = useState(props.startUrl || (props.item && props.item.url) || links.site);
    const [address, setAddress] = useState(url);
    const [reading, setReading] = useState(props.via === 'floppy' || props.via === 'gadget');
    const [progress, setProgress] = useState(0);

    // a new floppy (or link) replaces whatever was open
    useEffect(() => {
        const next = props.startUrl || (props.item && props.item.url) || (props.item && props.item.repo) || links.site;
        setUrl(next);
        setAddress(next);
        if (props.via === 'floppy' || props.via === 'gadget') {
            setReading(true);
            setProgress(0);
        }
    }, [props.startUrl, props.item, props.via]);

    // "Reading A:\" before the floppy loads
    useEffect(() => {
        if (!reading) return;
        const id = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(id);
                    setReading(false);
                    return 100;
                }
                return p + 4 + Math.random() * 10;
            });
        }, 90);
        return () => clearInterval(id);
    }, [reading]);

    const go = (next: string) => {
        let u = next.trim();
        if (!/^https?:\/\//.test(u)) u = 'https://' + u;
        setUrl(u);
        setAddress(u);
    };

    const item = props.item;
    const framed = !blocksFraming(url);
    const title = item ? `${props.via === 'floppy' ? 'A:\\' : ''}${item.name}` : 'CAK3D Explorer';

    return (
        <Window
            top={40}
            left={160}
            width={1000}
            height={720}
            windowTitle={title}
            windowBarIcon="windowExplorerIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={reading ? 'Reading A:\\ ...' : framed ? 'Done' : 'Open in a new tab to view'}
        >
            <div style={styles.page}>
                <div style={styles.toolbar}>
                    <p style={styles.label}>Address</p>
                    <input
                        style={styles.address}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && go(address)}
                    />
                    <div className="site-button" style={styles.button} onMouseDown={() => go(address)}>
                        <p>Go</p>
                    </div>
                    <a className="site-button" style={styles.button} href={url} target="_blank" rel="noreferrer">
                        <p>New tab</p>
                    </a>
                </div>
                <div style={styles.bookmarks}>
                    {sites.map((s) => (
                        <p key={s.name} style={styles.bookmark} onMouseDown={() => go(s.url)}>
                            {s.name}
                        </p>
                    ))}
                </div>
                <div style={styles.view}>
                    {reading ? (
                        <div style={styles.reading}>
                            <h2>{props.via === 'gadget' ? 'Connecting device...' : 'Reading A:\\'}</h2>
                            <p>{item && item.name.toUpperCase()}.EXE</p>
                            <div style={styles.bar}>
                                <div style={Object.assign({}, styles.barFill, { width: `${Math.min(100, progress)}%` })} />
                            </div>
                        </div>
                    ) : framed ? (
                        <iframe
                            title={url}
                            src={url}
                            style={styles.frame}
                            frameBorder={0}
                            allow="autoplay; fullscreen; gamepad; clipboard-write; xr-spatial-tracking"
                            allowFullScreen
                        />
                    ) : (
                        <div style={styles.info}>
                            <h1>{item ? item.name : url}</h1>
                            {item && item.language && <h3>{item.language}</h3>}
                            <br />
                            {item && item.description && <p>{item.description}</p>}
                            <br />
                            <p>This one can't run inside the PC, so it opens in a new tab.</p>
                            {url.indexOf('.ts.net') >= 0 && <p>(It lives on CAK3D's private Tailscale network.)</p>}
                            <br />
                            <div style={styles.infoButtons}>
                                {item && item.url && (
                                    <a className="site-button" style={styles.button} href={item.url} target="_blank" rel="noreferrer">
                                        <p>Open the app</p>
                                    </a>
                                )}
                                {item && item.repo && (
                                    <a className="site-button" style={styles.button} href={item.repo} target="_blank" rel="noreferrer">
                                        <p>View on GitHub</p>
                                    </a>
                                )}
                                {!item && (
                                    <a className="site-button" style={styles.button} href={url} target="_blank" rel="noreferrer">
                                        <p>Open {url}</p>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: {
        flex: 1,
        flexDirection: 'column',
        background: '#c3c6ca',
        height: '100%',
    },
    toolbar: {
        alignItems: 'center',
        padding: 6,
        gap: 6,
    },
    label: {
        fontFamily: 'MSSerif',
        fontSize: 14,
    },
    address: {
        flex: 1,
        fontFamily: 'MSSerif',
        fontSize: 14,
        padding: 4,
        border: '2px inset #fff',
    },
    button: {
        padding: '2px 10px',
        textDecoration: 'none',
        color: '#000',
        fontFamily: 'MSSerif',
        fontSize: 14,
    },
    bookmarks: {
        flexWrap: 'wrap',
        padding: '0 6px 6px',
        gap: 14,
        borderBottom: '2px solid #86898d',
    },
    bookmark: {
        fontFamily: 'MSSerif',
        fontSize: 13,
        cursor: 'pointer',
        textDecoration: 'underline',
        color: '#0000a3',
    },
    view: {
        flex: 1,
        background: '#fff',
        border: '2px inset #fff',
        margin: 4,
        overflow: 'hidden',
    },
    frame: {
        width: '100%',
        height: '100%',
        border: 'none',
    },
    reading: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0000aa',
        color: '#fff',
        fontFamily: 'Terminal, monospace',
        gap: 12,
    },
    bar: {
        width: 360,
        height: 20,
        border: '2px solid #fff',
    },
    barFill: {
        background: '#fff',
        height: '100%',
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        padding: 32,
        overflowY: 'auto',
    },
    infoButtons: {
        gap: 12,
        flexWrap: 'wrap',
    },
};

export default Browser;
