import React, { useCallback, useEffect, useRef, useState } from 'react';
import Colors from '../../constants/colors';
import ShowcaseExplorer from '../applications/ShowcaseExplorer';
import Doom from '../applications/Doom';
import OregonTrail from '../applications/OregonTrail';
import ShutdownSequence from './ShutdownSequence';
// import ThisComputer from '../applications/ThisComputer';
import Henordle from '../applications/Henordle';
import Toolbar from './Toolbar';
import DesktopShortcut, { DesktopShortcutProps } from './DesktopShortcut';
import Scrabble from '../applications/Scrabble';
import { IconName } from '../../assets/icons';
import Credits from '../applications/Credits';
import Terminal from '../applications/Terminal';
import Browser, { LoadedItem } from '../applications/Browser';
import Newspapers from '../applications/Newspapers';
import Spotify from '../applications/Spotify';
import { GITHUB } from '../../constants/cak3d';

const SPAC3_GH0ST: LoadedItem = {
    name: 'Spac3-Gh0st',
    description: 'Spac3-Gh0st: improved/portable rewrite of Hack-Safe',
    language: 'JavaScript',
    url: 'http://hack-safe.tailac984b.ts.net:8765/',
    repo: `${GITHUB}/Hack-Safe-v2`,
};
const Spac3Gh0st: React.FC<WindowAppProps> = (props) => <Browser {...props} item={SPAC3_GH0ST} via="desk" />;
const TinyTruck: React.FC<WindowAppProps> = (props) => <Browser {...props} startUrl="https://cak3d-truck.vercel.app" />;

export interface DesktopProps {}

type ExtendedWindowAppProps<T> = T & WindowAppProps;

const APPLICATIONS: {
    [key in string]: {
        key: string;
        name: string;
        shortcutIcon: IconName;
        component: React.FC<ExtendedWindowAppProps<any>>;
        hidden?: boolean; // opened by something else, no desktop shortcut
    };
} = {
    // computer: {
    //     key: 'computer',
    //     name: 'This Computer',
    //     shortcutIcon: 'computerBig',
    //     component: ThisComputer,
    // },
    showcase: {
        key: 'showcase',
        name: 'My Showcase',
        shortcutIcon: 'showcaseIcon',
        component: ShowcaseExplorer,
    },
    terminal: {
        key: 'terminal',
        name: 'Terminal',
        shortcutIcon: 'terminalIcon',
        component: Terminal,
    },
    browser: {
        key: 'browser',
        name: 'CAK3D Explorer',
        shortcutIcon: 'browserIcon',
        component: Browser,
    },
    papers: {
        key: 'papers',
        name: 'Corner Chronicle',
        shortcutIcon: 'newsIcon',
        component: Newspapers,
    },
    spotify: {
        key: 'spotify',
        name: 'Spotify',
        shortcutIcon: 'musicIcon',
        component: Spotify,
    },
    truck: {
        key: 'truck',
        name: 'Tiny Truck',
        shortcutIcon: 'windowGameIcon',
        component: TinyTruck,
    },
    ghost: {
        key: 'ghost',
        name: 'Spac3-Gh0st',
        shortcutIcon: 'ghostIcon',
        component: Spac3Gh0st,
    },
    floppy: {
        key: 'floppy',
        name: 'A:\\ Floppy',
        shortcutIcon: 'floppyIcon',
        component: Browser,
        hidden: true,
    },
    trail: {
        key: 'trail',
        name: 'The Oregon Trail',
        shortcutIcon: 'trailIcon',
        component: OregonTrail,
    },
    doom: {
        key: 'doom',
        name: 'Doom',
        shortcutIcon: 'doomIcon',
        component: Doom,
    },
    scrabble: {
        key: 'scrabble',
        name: 'Scrabble',
        shortcutIcon: 'scrabbleIcon',
        component: Scrabble,
    },
    henordle: {
        key: 'henordle',
        name: 'CAK3Dle',
        shortcutIcon: 'henordleIcon',
        component: Henordle,
    },
    credits: {
        key: 'credits',
        name: 'Credits',
        shortcutIcon: 'credits',
        component: Credits,
    },
};

const Desktop: React.FC<DesktopProps> = (props) => {
    const [windows, setWindows] = useState<DesktopWindows>({});

    const [shortcuts, setShortcuts] = useState<DesktopShortcutProps[]>([]);

    const [shutdown, setShutdown] = useState(false);
    const latest = useRef<{ addWindow: (key: string, element: JSX.Element) => void }>({ addWindow: () => {} });
    const [numShutdowns, setNumShutdowns] = useState(1);

    useEffect(() => {
        if (shutdown === true) {
            rebootDesktop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shutdown]);

    useEffect(() => {
        const newShortcuts: DesktopShortcutProps[] = [];
        Object.keys(APPLICATIONS).forEach((key) => {
            const app = APPLICATIONS[key];
            if (app.hidden) return;
            newShortcuts.push({
                shortcutName: app.name,
                icon: app.shortcutIcon,
                onOpen: () => {
                    addWindow(
                        app.key,
                        <app.component
                            onInteract={() => onWindowInteract(app.key)}
                            onMinimize={() => minimizeWindow(app.key)}
                            onClose={() => removeWindow(app.key)}
                            key={app.key}
                        />
                    );
                },
            });
        });

        newShortcuts.forEach((shortcut) => {
            if (shortcut.shortcutName === 'My Showcase') {
                shortcut.onOpen();
            }
        });

        setShortcuts(newShortcuts);

        // The 3D room loads floppies / gadgets / desk props on this PC
        const onMessage = (event: MessageEvent) => {
            if (!event.data) return;
            // the stereo in the room asks for an app
            if (event.data.type === 'cak3d-open' && APPLICATIONS[event.data.app]) {
                const app = APPLICATIONS[event.data.app];
                latest.current.addWindow(
                    app.key,
                    <app.component
                        onInteract={() => onWindowInteract(app.key)}
                        onMinimize={() => minimizeWindow(app.key)}
                        onClose={() => removeWindow(app.key)}
                        key={app.key}
                    />
                );
                return;
            }
            if (event.data.type !== 'cak3d-load') return;
            latest.current.addWindow(
                'floppy',
                <Browser
                    item={event.data.item}
                    via={event.data.via}
                    onInteract={() => onWindowInteract('floppy')}
                    onMinimize={() => minimizeWindow('floppy')}
                    onClose={() => removeWindow('floppy')}
                    key="floppy"
                />
            );
        };
        // `browse <site>` from the terminal
        const onBrowse = (event: Event) => {
            const url = (event as CustomEvent).detail.url;
            latest.current.addWindow(
                'browser',
                <Browser
                    startUrl={url}
                    onInteract={() => onWindowInteract('browser')}
                    onMinimize={() => minimizeWindow('browser')}
                    onClose={() => removeWindow('browser')}
                    key="browser"
                />
            );
        };
        window.addEventListener('message', onMessage);
        window.addEventListener('cak3d-browse', onBrowse);
        return () => {
            window.removeEventListener('message', onMessage);
            window.removeEventListener('cak3d-browse', onBrowse);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rebootDesktop = useCallback(() => {
        setWindows({});
    }, []);

    const removeWindow = useCallback((key: string) => {
        // Absolute hack and a half
        setTimeout(() => {
            setWindows((prevWindows) => {
                const newWindows = { ...prevWindows };
                delete newWindows[key];
                return newWindows;
            });
        }, 100);
    }, []);

    const minimizeWindow = useCallback((key: string) => {
        setWindows((prevWindows) => {
            const newWindows = { ...prevWindows };
            newWindows[key].minimized = true;
            return newWindows;
        });
    }, []);

    const getHighestZIndex = useCallback((): number => {
        let highestZIndex = 0;
        Object.keys(windows).forEach((key) => {
            const window = windows[key];
            if (window) {
                if (window.zIndex > highestZIndex)
                    highestZIndex = window.zIndex;
            }
        });
        return highestZIndex;
    }, [windows]);

    const toggleMinimize = useCallback(
        (key: string) => {
            const newWindows = { ...windows };
            const highestIndex = getHighestZIndex();
            if (
                newWindows[key].minimized ||
                newWindows[key].zIndex === highestIndex
            ) {
                newWindows[key].minimized = !newWindows[key].minimized;
            }
            newWindows[key].zIndex = getHighestZIndex() + 1;
            setWindows(newWindows);
        },
        [windows, getHighestZIndex]
    );

    const onWindowInteract = useCallback(
        (key: string) => {
            setWindows((prevWindows) => ({
                ...prevWindows,
                [key]: {
                    ...prevWindows[key],
                    zIndex: 1 + getHighestZIndex(),
                },
            }));
        },
        [setWindows, getHighestZIndex]
    );

    const startShutdown = useCallback(() => {
        setTimeout(() => {
            setShutdown(true);
            setNumShutdowns(numShutdowns + 1);
        }, 600);
    }, [numShutdowns]);

    const addWindow = useCallback(
        (key: string, element: JSX.Element) => {
            setWindows((prevState) => ({
                ...prevState,
                [key]: {
                    zIndex: getHighestZIndex() + 1,
                    minimized: false,
                    component: element,
                    name: APPLICATIONS[key].name,
                    icon: APPLICATIONS[key].shortcutIcon,
                },
            }));
        },
        [getHighestZIndex]
    );

    // listeners set up once read the newest callbacks (so new windows land on top)
    latest.current = { addWindow };

    return !shutdown ? (
        <div style={styles.desktop}>
            {/* For each window in windows, loop over and render  */}
            {Object.keys(windows).map((key) => {
                const element = windows[key].component;
                if (!element) return <div key={`win-${key}`}></div>;
                return (
                    <div
                        key={`win-${key}`}
                        style={Object.assign(
                            {},
                            { zIndex: windows[key].zIndex },
                            windows[key].minimized && styles.minimized
                        )}
                    >
                        {React.cloneElement(element, {
                            key,
                            onInteract: () => onWindowInteract(key),
                            onClose: () => removeWindow(key),
                        })}
                    </div>
                );
            })}
            <div style={styles.shortcuts}>
                {shortcuts.map((shortcut, i) => {
                    return (
                        <div
                            style={Object.assign({}, styles.shortcutContainer, {
                                top: (i % 8) * 104,
                                left: Math.floor(i / 8) * 100,
                            })}
                            key={shortcut.shortcutName}
                        >
                            <DesktopShortcut
                                icon={shortcut.icon}
                                shortcutName={shortcut.shortcutName}
                                onOpen={shortcut.onOpen}
                            />
                        </div>
                    );
                })}
            </div>
            <Toolbar
                windows={windows}
                toggleMinimize={toggleMinimize}
                shutdown={startShutdown}
            />
        </div>
    ) : (
        <ShutdownSequence
            setShutdown={setShutdown}
            numShutdowns={numShutdowns}
        />
    );
};

const styles: StyleSheetCSS = {
    desktop: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: Colors.turquoise,
    },
    shutdown: {
        minHeight: '100%',
        flex: 1,
        backgroundColor: '#1d2e2f',
    },
    shortcutContainer: {
        position: 'absolute',
    },
    shortcuts: {
        position: 'absolute',
        top: 16,
        left: 6,
    },
    minimized: {
        pointerEvents: 'none',
        opacity: 0,
    },
};

export default Desktop;
