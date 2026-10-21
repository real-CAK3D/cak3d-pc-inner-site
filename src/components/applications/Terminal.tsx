import React, { useCallback, useEffect, useRef, useState } from 'react';
import Window from '../os/Window';
import { apps, experience, featured, links, NEWSSTAND_URL, papers, sites } from '../../constants/cak3d';

export interface TerminalProps extends WindowAppProps {}

type Line = { text: string; color?: string };
type Mode = 'shell' | 'snake' | 'matrix';

const THEMES: { [k: string]: { fg: string; bg: string; dim: string } } = {
    green: { fg: '#36ff7a', bg: '#050a05', dim: '#1f9a48' },
    purple: { fg: '#d29bff', bg: '#0b0412', dim: '#7a3fd1' },
    amber: { fg: '#ffb63d', bg: '#0d0800', dim: '#a06a10' },
    white: { fg: '#f0f0f0', bg: '#000000', dim: '#888888' },
};

const HOST = 'cak3d@stoner-pc';
const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

// The pretend filesystem, built from the real CAK3D data
type Entry = { name: string; url?: string; repo?: string; body?: string[] };
const DIRS: { [dir: string]: Entry[] } = {
    '~': [
        {
            name: 'about.txt',
            body: [
                'Hello, as you might have already noticed, I go by ꧁ᙅᗣҜӠᙃ꧂',
                '',
                '- I like to code: mostly custom Discord bots and tweaking DayZ servers for fun.',
                '- On my free time I lightweight-overnight-hike the Appalachian Trail.',
                '- I FIX CAR FOR MONIES ! !',
                '',
                `site: ${links.site}`,
                `github: ${links.github}`,
            ],
        },
        {
            name: 'hobbies.txt',
            body: [
                'Gaming ........ DayZ, GTA V, Session Skate Sim, Ghost of Tsushima',
                'Music ......... Boss RC-505 loops, lo-fi to trap to in your face DnB',
                'Outdoor ....... Appalachian Trail, skiing, snowboarding, skating, cookouts',
                'Creative ...... projection mapping, graffiti, CAD, GIMP',
                'Tech toys ..... GMK Tec M7 NUCbox, Raspberry Pi, FlipperZero, Blender',
            ],
        },
        { name: 'experience.txt', body: experience.map((e) => `${e.icon} ${e.title.padEnd(22, '.')} ${e.years}`) },
        {
            name: 'stash.txt',
            body: ['1/8 Front Page Purple', '1/8 Big Fix OG', '2 pre-rolls (Double Wide papers)', '1 grinder, sticky', 'snacks: LOW'],
        },
    ],
    apps: [...featured, ...apps].map((a) => ({ name: `${slug(a.name)}.exe`, url: a.url, repo: a.repo, body: [a.name, a.description || '', a.language || ''] })),
    sites: sites.map((s) => ({ name: `${slug(s.name)}.url`, url: s.url, repo: s.repo, body: [s.name, s.url, s.note || ''] })),
    papers: papers.map((p) => ({ name: `${p.id}.txt`, url: `${NEWSSTAND_URL}/${p.id}/`, repo: p.repo, body: [p.name, `${p.when} · by ${p.by}`, `"${p.motto}"`] })),
};

const FORTUNES = [
    'You will find what you are looking for in the second drawer.',
    'A clean grinder is a happy grinder.',
    'Pass it to the left, the universe is watching.',
    'The bug is in the code you were sure was fine.',
    'Your next commit will compile on the first try. (lol)',
    'Hydrate. Then snack. Then hydrate again.',
    'A WRX in the shop is worth two on the road.',
    'Chernarus is on the way soon!',
];

const COMMANDS = [
    'help', 'clear', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'date', 'echo', 'neofetch', 'about', 'apps', 'sites', 'papers',
    'open', 'browse', 'hack', 'matrix', 'sl', 'cowsay', 'fortune', 'roll', '420', 'snake', 'grow', 'theme', 'ping',
    'ghost', 'history', 'sudo', 'exit',
];

const Terminal: React.FC<TerminalProps> = (props) => {
    const [lines, setLines] = useState<Line[]>([
        { text: 'CAK3D OS [Version 4.20.710]' },
        { text: '(c) 2026 CAK3D_Creations. All rights rolled.' },
        { text: '' },
        { text: "Type 'help' to see what this baby can do." },
        { text: '' },
    ]);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('~');
    const [history, setHistory] = useState<string[]>([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [theme, setTheme] = useState('green');
    const [mode, setMode] = useState<Mode>('shell');
    const [busy, setBusy] = useState(false);
    const timers = useRef<number[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const colors = THEMES[theme];

    const print = useCallback((...out: (string | Line)[]) => {
        setLines((prev) => [...prev, ...out.map((o) => (typeof o === 'string' ? { text: o } : o))]);
    }, []);

    /** Print lines one after another, like something is actually happening */
    const stream = useCallback(
        (out: (string | Line)[], delay = 60, done?: () => void) => {
            setBusy(true);
            out.forEach((o, i) => {
                timers.current.push(window.setTimeout(() => print(o), i * delay));
            });
            timers.current.push(
                window.setTimeout(() => {
                    setBusy(false);
                    if (done) done();
                }, out.length * delay + 10)
            );
        },
        [print]
    );

    const cancel = useCallback(() => {
        timers.current.forEach((t) => clearTimeout(t));
        timers.current = [];
        setBusy(false);
        print({ text: '^C', color: colors.dim });
    }, [print, colors.dim]);

    useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [lines]);

    const findEntry = (q: string): Entry | undefined => {
        const needle = q.toLowerCase().replace(/\.(exe|url|txt)$/, '');
        for (const dir of ['apps', 'sites', 'papers', '~']) {
            const hit = DIRS[dir].find((e) => e.name.toLowerCase().replace(/\.(exe|url|txt)$/, '').indexOf(needle) >= 0);
            if (hit) return hit;
        }
        return undefined;
    };

    const run = (raw: string) => {
        const [cmd, ...args] = raw.trim().split(/\s+/);
        const arg = args.join(' ');
        switch ((cmd || '').toLowerCase()) {
            case '':
                return;
            case 'help':
                return print(
                    { text: 'Things you can type:', color: colors.dim },
                    '  ls [dir]          list files (try: ls apps, ls sites, ls papers)',
                    '  cd <dir>          move around (~, apps, sites, papers)',
                    '  cat <file>        read a file (about.txt, hobbies.txt, stash.txt...)',
                    '  open <name>       open an app, site or paper in a new tab',
                    '  browse <name|url> open it in the CAK3D Explorer on this PC',
                    '  apps | sites | papers   quick lists',
                    '  neofetch          system info',
                    '  hack [target]     do some very real hacking',
                    '  matrix            follow the white rabbit (any key to exit)',
                    '  snake             play snake (arrows / WASD, q to quit)',
                    '  sl                you meant ls, right?',
                    '  cowsay <msg>      the cow speaks',
                    '  fortune | roll | grow | 420 | ghost',
                    '  theme <green|purple|amber|white>',
                    '  history | clear | whoami | date | echo | ping | exit'
                );
            case 'clear':
            case 'cls':
                return setLines([]);
            case 'pwd':
                return print(cwd === '~' ? '/home/cak3d' : `/home/cak3d/${cwd}`);
            case 'whoami':
                return print('cak3d  (꧁ᙅᗣҜӠᙃ꧂) · coder · grower · mechanic');
            case 'date':
                return print(new Date().toString());
            case 'echo':
                return print(arg);
            case 'history':
                return print(...history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`));
            case 'ls': {
                const dir = arg ? arg.replace(/^~\/?/, '').replace(/\/$/, '') || '~' : cwd;
                if (!DIRS[dir]) return print(`ls: cannot access '${arg}': No such file or directory`);
                const names = DIRS[dir].map((e) => e.name);
                if (dir === '~') names.unshift('apps/', 'sites/', 'papers/');
                return print(...chunk(names, 3).map((row) => row.map((n) => n.padEnd(28)).join('')));
            }
            case 'cd': {
                const dir = !arg || arg === '~' || arg === '..' ? '~' : arg.replace(/^~\//, '').replace(/\/$/, '');
                if (!DIRS[dir]) return print(`cd: ${arg}: No such file or directory`);
                return setCwd(dir);
            }
            case 'cat': {
                if (!arg) return print('cat: missing file operand');
                const hit = DIRS[cwd].find((e) => e.name === arg) || findEntry(arg);
                if (!hit || !hit.body) return print(`cat: ${arg}: No such file or directory`);
                return print(...hit.body.filter((l) => l !== undefined));
            }
            case 'about':
                return print(...(DIRS['~'][0].body as string[]));
            case 'apps':
                return print(...[...featured, ...apps].map((a) => `  ${a.name.padEnd(26)} ${a.language || ''}`));
            case 'sites':
                return print(...sites.map((s) => `  ${s.name.padEnd(24)} ${s.url}`));
            case 'papers':
                return print(...papers.map((p) => `  ${p.name.padEnd(24)} ${p.when}`));
            case 'open':
            case 'browse': {
                if (!arg) return print(`usage: ${cmd} <name>`);
                const isUrl = /^https?:\/\//.test(arg) || /\.[a-z]{2,}(\/|$)/.test(arg);
                const hit = isUrl ? undefined : findEntry(arg);
                const url = isUrl ? (arg.startsWith('http') ? arg : `https://${arg}`) : hit && (hit.url || hit.repo);
                if (!url) return print(`${cmd}: nothing called '${arg}' around here`);
                if (cmd === 'open') {
                    window.open(url, '_blank', 'noopener');
                    return print(`opening ${url} ...`);
                }
                window.dispatchEvent(new CustomEvent('cak3d-browse', { detail: { url } }));
                return print(`loading ${url} in CAK3D Explorer ...`);
            }
            case 'neofetch':
                return print(
                    ...[
                        '        .           ' + HOST,
                        '       .:.          ---------------',
                        '      .:::.         OS: CAK3D OS 4.20.710 x86_64',
                        ' .    :::::    .    Host: GMK Tec M7 NUCbox (in spirit)',
                        '  ::. ::::: .::     Kernel: 4.20-sticky-icky',
                        '   :::.:::.:::      Uptime: since the last session',
                        '    ::::::::        Shell: zsh (half baked)',
                        '  ....:::::....     Terminal: CAK3D Terminal',
                        '       ::           Theme: ' + theme,
                        '       ::           Lights: purple LEDs, full spectrum grow',
                        '                    Memory: what memory?',
                    ].map((t, i) => ({ text: t, color: i < 10 ? colors.fg : colors.dim }))
                );
            case 'hack':
                return hack(arg || 'the-mainframe');
            case 'matrix':
                return setMode('matrix');
            case 'snake':
                return setMode('snake');
            case 'sl':
                return train();
            case 'cowsay': {
                const msg = arg || 'moo. pass the lighter.';
                const bar = '-'.repeat(msg.length + 2);
                return print(` ${bar}`, `< ${msg} >`, ` ${bar}`, '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||');
            }
            case 'fortune':
                return print(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
            case 'roll':
                return stream(
                    [
                        'grinding .......... done',
                        'loading the paper . done',
                        'tucking ........... done',
                        'rolling ........... done',
                        'licking the gum ... done',
                        '',
                        '   ____________________________',
                        '  (____________________________)==~~~  ',
                        '',
                        { text: 'perfect cone. puff puff pass.', color: colors.dim },
                    ],
                    220
                );
            case '420':
                return print({ text: 'It is always 4:20 somewhere. ' + (new Date().getHours() % 12 === 4 && new Date().getMinutes() === 20 ? 'Like, right now.' : 'Just not here. Yet.'), color: colors.fg });
            case 'grow':
                return stream(
                    ['            ,', '           /|\\', '          / | \\', '      .--/  |  \\--.', '     /  /   |   \\  \\', '    \\  \\  \\|/  /  /', '      \\  \\ | /  /', '        \\ \\|/ /', '          \\|/', '           |', '        ___|___', '        \\_____/', { text: 'she is looking frosty.', color: colors.dim }],
                    180
                );
            case 'ghost':
                return print(
                    'Spac3-Gh0st: improved/portable rewrite of Hack-Safe',
                    'repo: https://github.com/real-CAK3D/Hack-Safe-v2',
                    "type 'browse spac3' to boot it up"
                );
            case 'theme':
                if (!THEMES[arg]) return print(`themes: ${Object.keys(THEMES).join(', ')}`);
                return setTheme(arg);
            case 'ping': {
                const host = arg || 'real-cak3d.github.io';
                return stream(
                    [0, 1, 2, 3].map((i) => `64 bytes from ${host}: icmp_seq=${i} ttl=420 time=${(Math.random() * 40 + 4).toFixed(1)} ms`),
                    400
                );
            }
            case 'sudo':
                return print({ text: `[sudo] password for cak3d: nice try. this incident will be reported to the Garden.`, color: colors.dim });
            case 'exit':
                return props.onClose();
            default:
                return print(`${cmd}: command not found. try 'help'`);
        }
    };

    const hack = (target: string) => {
        const hex = () => Math.random().toString(16).slice(2, 10).toUpperCase();
        const bar = (p: number) => '[' + '#'.repeat(Math.round(p / 5)).padEnd(20, '.') + `] ${p}%`;
        const out: (string | Line)[] = [
            `> initializing Spac3-Gh0st on ${target} ...`,
            '> spoofing MAC 4:20:4:20:4:20',
            '> routing through 7 proxies (and one bong)',
        ];
        for (let i = 0; i < 14; i++) out.push({ text: `0x${hex()}  ${hex()} ${hex()} ${hex()}  ${['SYN', 'ACK', 'PSH', 'FIN'][i % 4]}`, color: colors.dim });
        [5, 20, 45, 70, 90, 100].forEach((p) => out.push(`> brute forcing ${bar(p)}`));
        out.push('> decrypting secrets.zip ... password was "password"');
        out.push('> downloading stash.txt ... 100%');
        out.push({ text: '', color: colors.fg });
        out.push({ text: '  +==============================+', color: colors.fg });
        out.push({ text: '  |       ACCESS  GRANTED        |', color: colors.fg });
        out.push({ text: '  +==============================+', color: colors.fg });
        out.push({ text: '  welcome back, cak3d.', color: colors.dim });
        stream(out, 70);
    };

    const train = () => {
        const frames = [
            '      ====        ________                ___________ ',
            '  _D _|  |_______/        \\__I_I_____===__|_________| ',
            '   |(_)---  |   H\\________/ |   |        =|___ ___|   ',
            '   /     |  |   H  |  |     |   |         ||_| |_||   ',
            '  |      |  |   H  |__--------------------| [___] |   ',
            '  | ________|___H__/__|_____/[][]~\\_______|       |   ',
            '  |/ |   |-----------I_____I [][] []  D   |=======|__ ',
        ];
        const out: string[] = [];
        for (let x = 40; x >= 0; x -= 8) out.push(...frames.map((f) => ' '.repeat(x) + f), '');
        stream(out, 25);
    };

    const complete = () => {
        const parts = input.split(' ');
        if (parts.length === 1) {
            const hits = COMMANDS.filter((c) => c.startsWith(parts[0]));
            if (hits.length === 1) setInput(hits[0] + ' ');
            else if (hits.length > 1) print(hits.join('  '));
        } else {
            const pool = [...DIRS[cwd].map((e) => e.name), ...Object.keys(DIRS).filter((d) => d !== '~')];
            const last = parts[parts.length - 1];
            const hits = pool.filter((n) => n.toLowerCase().startsWith(last.toLowerCase()));
            if (hits.length === 1) setInput([...parts.slice(0, -1), hits[0]].join(' '));
            else if (hits.length > 1) print(hits.join('  '));
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (mode !== 'shell') return;
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            if (busy) cancel();
            else {
                print(`${HOST}:${cwd}$ ${input}^C`);
                setInput('');
            }
            return;
        }
        if (busy) return;
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            setLines([]);
            return;
        }
        if (e.key === 'Enter') {
            print({ text: `${HOST}:${cwd}$ ${input}`, color: colors.dim });
            if (input.trim()) setHistory((h) => [...h, input]);
            setHistIdx(-1);
            run(input);
            setInput('');
        } else if (e.key === 'Backspace') {
            setInput((s) => s.slice(0, -1));
        } else if (e.key === 'Tab') {
            e.preventDefault();
            complete();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            const i = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1);
            setHistIdx(i);
            setInput(history[i]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx < 0) return;
            const i = histIdx + 1;
            if (i >= history.length) {
                setHistIdx(-1);
                setInput('');
            } else {
                setHistIdx(i);
                setInput(history[i]);
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            setInput((s) => s + e.key);
        }
    };

    useEffect(() => {
        if (rootRef.current) rootRef.current.focus();
    }, [mode]);

    return (
        <Window
            top={60}
            left={240}
            width={900}
            height={620}
            windowTitle="CAK3D Terminal"
            windowBarIcon="windowGameIcon"
            windowBarColor="#1C1C1C"
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            bottomLeftText={busy ? 'running... (ctrl+c to stop)' : `${HOST}:${cwd}`}
        >
            <div
                ref={rootRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                onMouseDown={() => rootRef.current && rootRef.current.focus()}
                style={Object.assign({}, styles.term, { background: colors.bg, color: colors.fg })}
            >
                {mode === 'matrix' && <Matrix color={colors.fg} bg={colors.bg} onExit={() => setMode('shell')} />}
                {mode === 'snake' && (
                    <Snake
                        color={colors.fg}
                        dim={colors.dim}
                        onExit={(score) => {
                            setMode('shell');
                            print(`snake: game over, you ate ${score} nug${score === 1 ? '' : 's'}`);
                        }}
                    />
                )}
                {mode === 'shell' && (
                    <div ref={scrollRef} style={styles.scroll}>
                        {lines.map((l, i) => (
                            <pre key={i} style={Object.assign({}, styles.line, l.color ? { color: l.color } : {})}>
                                {l.text || ' '}
                            </pre>
                        ))}
                        {!busy && (
                            <pre style={styles.line}>
                                <span style={{ color: colors.dim }}>{`${HOST}:${cwd}$ `}</span>
                                {input}
                                <span className="blinking-cursor" style={Object.assign({}, styles.cursor, { backgroundColor: colors.fg })} />
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </Window>
    );
};

/* ------------------------------------------------------------- matrix rain */

const Matrix: React.FC<{ color: string; bg: string; onExit: () => void }> = ({ color, bg, onExit }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const size = 16;
        const cols = Math.floor(canvas.width / size);
        const drops = Array.from({ length: cols }, () => Math.random() * -50);
        const glyphs = 'アイウエオカキクケコサシスセソタチツテト0123456789CAK3D420'.split('');
        const id = setInterval(() => {
            ctx.fillStyle = bg + 'cc';
            ctx.globalAlpha = 0.18;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
            ctx.fillStyle = color;
            ctx.font = `${size}px Terminal, monospace`;
            drops.forEach((y, i) => {
                ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * size, y * size);
                drops[i] = y * size > canvas.height && Math.random() > 0.97 ? 0 : y + 1;
            });
        }, 50);
        const exit = () => onExit();
        window.addEventListener('keydown', exit);
        return () => {
            clearInterval(id);
            window.removeEventListener('keydown', exit);
        };
    }, [color, bg, onExit]);
    return <canvas ref={ref} style={styles.canvas} onMouseDown={onExit} />;
};

/* ------------------------------------------------------------------- snake */

const W = 40;
const H = 20;

const Snake: React.FC<{ color: string; dim: string; onExit: (score: number) => void }> = ({ color, dim, onExit }) => {
    const [snake, setSnake] = useState<[number, number][]>([
        [10, 10],
        [9, 10],
        [8, 10],
    ]);
    const [food, setFood] = useState<[number, number]>([25, 10]);
    const [dead, setDead] = useState(false);
    const dir = useRef<[number, number]>([1, 0]);
    const score = snake.length - 3;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            const map: { [k: string]: [number, number] } = {
                arrowup: [0, -1],
                w: [0, -1],
                arrowdown: [0, 1],
                s: [0, 1],
                arrowleft: [-1, 0],
                a: [-1, 0],
                arrowright: [1, 0],
                d: [1, 0],
            };
            if (k === 'q' || k === 'escape' || (dead && k === 'enter')) return onExit(score);
            const next = map[k];
            if (next && (next[0] !== -dir.current[0] || next[1] !== -dir.current[1])) {
                dir.current = next;
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [dead, onExit, score]);

    useEffect(() => {
        if (dead) return;
        const id = setInterval(() => {
            setSnake((s) => {
                const head: [number, number] = [s[0][0] + dir.current[0], s[0][1] + dir.current[1]];
                if (head[0] < 0 || head[1] < 0 || head[0] >= W || head[1] >= H || s.some(([x, y]) => x === head[0] && y === head[1])) {
                    setDead(true);
                    return s;
                }
                const ate = head[0] === food[0] && head[1] === food[1];
                if (ate) setFood([Math.floor(Math.random() * W), Math.floor(Math.random() * H)]);
                return [head, ...(ate ? s : s.slice(0, -1))];
            });
        }, 110);
        return () => clearInterval(id);
    }, [dead, food]);

    const rows: string[] = [];
    rows.push('+' + '-'.repeat(W) + '+');
    for (let y = 0; y < H; y++) {
        let row = '|';
        for (let x = 0; x < W; x++) {
            if (snake[0][0] === x && snake[0][1] === y) row += '@';
            else if (snake.some(([sx, sy]) => sx === x && sy === y)) row += 'o';
            else if (food[0] === x && food[1] === y) row += '*';
            else row += ' ';
        }
        rows.push(row + '|');
    }
    rows.push('+' + '-'.repeat(W) + '+');

    return (
        <div style={styles.scroll}>
            <pre style={Object.assign({}, styles.line, { color: dim })}>{`SNAKE  ·  nugs: ${score}  ·  arrows/WASD  ·  q to quit`}</pre>
            <pre style={Object.assign({}, styles.line, { color })}>{rows.join('\n')}</pre>
            {dead && <pre style={styles.line}>{`GAME OVER. ${score} nugs. press enter.`}</pre>}
        </div>
    );
};

const chunk = <T,>(arr: T[], n: number) => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
};

const styles: StyleSheetCSS = {
    term: {
        flex: 1,
        height: '100%',
        outline: 'none',
        position: 'relative',
        fontFamily: 'Terminal, "Courier New", monospace',
        fontSize: 16,
        cursor: 'text',
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
        overflowY: 'auto',
        padding: 12,
        height: '100%',
        boxSizing: 'border-box',
    },
    line: {
        margin: 0,
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        lineHeight: 1.25,
    },
    cursor: {
        display: 'inline-block',
        width: '0.6em',
        height: '1em',
        verticalAlign: 'bottom',
    },
    canvas: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
    },
};

export default Terminal;
