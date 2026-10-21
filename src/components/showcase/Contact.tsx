import React from 'react';
import ghIcon from '../../assets/pictures/contact-gh.png';
import { links } from '../../constants/cak3d';

export interface ContactProps {}

const support = [
    { name: 'PayPal', url: links.paypal },
    { name: 'Buy Me a Coffee', url: links.buyMeACoffee },
    { name: 'Nitrado', url: links.nitrado },
    { name: 'Patreon', url: links.patreon },
];

const Contact: React.FC<ContactProps> = (props) => {
    return (
        <div className="site-page-content">
            <div style={styles.header}>
                <h1>Collaborate</h1>
                <div style={styles.socials}>
                    <a rel="noreferrer" target="_blank" href={links.github} className="big-button-container" style={styles.social}>
                        <img src={ghIcon} alt="GitHub" style={styles.socialImage} />
                    </a>
                </div>
            </div>
            <div className="text-block">
                <p>
                    Got an idea for a bot, server, or project? Want to talk cars,
                    code, or cosmic mysteries? Let's layer some unreal magic
                    together, CAK3D-style.
                </p>
                <br />
                <p>
                    <b>Discord: </b>
                    <a rel="noreferrer" target="_blank" href={links.discord}>
                        join the server
                    </a>
                </p>
                <p>
                    <b>GitHub: </b>
                    <a rel="noreferrer" target="_blank" href={links.github}>
                        real-CAK3D
                    </a>
                </p>
                <p>
                    <b>Website: </b>
                    <a rel="noreferrer" target="_blank" href={links.site}>
                        real-cak3d.github.io
                    </a>
                </p>
            </div>
            <div className="text-block">
                <h3>Book a DayZ Editor Build</h3>
                <br />
                <p>
                    <a rel="noreferrer" target="_blank" href={links.booking}>
                        Grab a time on the calendar
                    </a>
                </p>
            </div>
            <div className="text-block">
                <h3>Donations & Subscriptions</h3>
                <br />
                <div style={styles.support}>
                    {support.map((s) => (
                        <a key={s.name} rel="noreferrer" target="_blank" href={s.url} className="big-button-container" style={styles.supportButton}>
                            <p>{s.name}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    header: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    socials: {
        marginBottom: 16,
        justifyContent: 'flex-end',
    },
    social: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginLeft: 8,
    },
    socialImage: {
        width: 36,
        height: 36,
    },
    support: {
        flexWrap: 'wrap',
        gap: 12,
    },
    supportButton: {
        padding: 12,
        textDecoration: 'none',
        color: 'inherit',
    },
};

export default Contact;
