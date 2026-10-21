import React, { useEffect, useRef, useState } from 'react';
import Window from '../os/Window';
import { links } from '../../constants/cak3d';

export interface SpotifyProps extends WindowAppProps {}

const DEFAULT_URI = 'spotify:playlist:37i9dQZF1DWWQRwui0ExPn'; // lofi beats

/** "https://open.spotify.com/track/abc?si=..." -> "spotify:track:abc" */
const toUri = (input: string) => {
    const s = input.trim();
    if (s.startsWith('spotify:')) return s;
    const m = s.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/);
    return m ? `spotify:${m[1]}:${m[2]}` : null;
};

/** Tell the stereo in the 3D room what's going on */
const tellStereo = (playing: boolean, title: string) => {
    window.parent.postMessage({ type: 'cak3d-stereo', playing, title }, '*');
};

declare global {
    interface Window {
        onSpotifyIframeApiReady?: (api: any) => void;
        SpotifyIframeApi?: any;
    }
}

const Spotify: React.FC<SpotifyProps> = (props) => {
    const holder = useRef<HTMLDivElement>(null);
    const controller = useRef<any>(null);
    const [link, setLink] = useState('');
    const [uri, setUri] = useState(() => {
        try {
            return localStorage.getItem('cak3d-spotify') || DEFAULT_URI;
        } catch (e) {
            return DEFAULT_URI;
        }
    });
    const [error, setError] = useState('');
    const label = uri.split(':')[1] || 'spotify';

    // load Spotify's embed API once and build the player
    useEffect(() => {
        const create = (api: any) => {
            if (!holder.current) return;
            api.createController(holder.current, { uri, width: '100%', height: 520 }, (c: any) => {
                controller.current = c;
                c.addListener('playback_update', (e: any) => tellStereo(!e.data.isPaused, `Spotify ${label}`));
            });
        };
        if (window.SpotifyIframeApi) create(window.SpotifyIframeApi);
        else {
            window.onSpotifyIframeApiReady = (api) => {
                window.SpotifyIframeApi = api;
                create(api);
            };
            if (!document.getElementById('spotify-iframe-api')) {
                const script = document.createElement('script');
                script.id = 'spotify-iframe-api';
                script.src = 'https://open.spotify.com/embed/iframe-api/v1';
                document.body.appendChild(script);
            }
        }
        return () => {
            tellStereo(false, '');
            if (controller.current && controller.current.destroy) controller.current.destroy();
            controller.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const load = () => {
        const next = toUri(link);
        if (!next) {
            setError('Paste a Spotify track, album, playlist or artist link');
            return;
        }
        setError('');
        setUri(next);
        try {
            localStorage.setItem('cak3d-spotify', next);
        } catch (e) {}
        if (controller.current) {
            controller.current.loadUri(next);
            controller.current.play();
        }
    };

    return (
        <Window
            top={50}
            left={300}
            width={720}
            height={680}
            windowTitle="Spotify · CAK3D FM"
            windowBarColor="#121212"
            windowBarIcon="windowGameIcon"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText="Playing through the stereo"
        >
            <div style={styles.page}>
                <div style={styles.row}>
                    <input
                        style={styles.input}
                        placeholder="Paste a Spotify link..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && load()}
                    />
                    <div className="site-button" style={styles.button} onMouseDown={load}>
                        <p>Play</p>
                    </div>
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <div ref={holder} style={styles.player} />
                <p style={styles.note}>
                    Log in to Spotify in this browser for full tracks (otherwise you get previews).{' '}
                    <a href={links.spotify} target="_blank" rel="noreferrer" style={styles.link}>
                        CAK3D on Spotify
                    </a>
                </p>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    page: {
        flex: 1,
        flexDirection: 'column',
        background: '#121212',
        padding: 12,
        gap: 10,
        height: '100%',
        boxSizing: 'border-box',
    },
    row: {
        gap: 8,
    },
    input: {
        flex: 1,
        padding: 6,
        fontSize: 14,
        fontFamily: 'MSSerif',
    },
    button: {
        padding: '2px 14px',
        fontFamily: 'MSSerif',
    },
    error: {
        color: '#ff6b6b',
        fontSize: 13,
    },
    player: {
        flex: 1,
        minHeight: 520,
    },
    note: {
        color: '#b3b3b3',
        fontSize: 12,
    },
    link: {
        color: '#1db954',
    },
};

export default Spotify;
