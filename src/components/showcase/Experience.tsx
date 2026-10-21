import React from 'react';
import { experience, links } from '../../constants/cak3d';

export interface ExperienceProps {}

const Experience: React.FC<ExperienceProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Experience</h1>
            <h3>Years in the game</h3>
            <br />
            {experience.map((e) => (
                <div key={e.title} style={styles.entry}>
                    <div style={styles.headerRow}>
                        <h2>
                            {e.icon} {e.title}
                        </h2>
                        <b>
                            <p>{e.years}</p>
                        </b>
                    </div>
                    <div className="text-block" style={styles.text}>
                        <p>{e.text}</p>
                    </div>
                </div>
            ))}
            <div className="text-block">
                <h3>Want to book a DayZ Editor Build?</h3>
                <br />
                <p>
                    My GMK Tec M7 NUCbox is my go-to for DayZ editor builds.{' '}
                    <a rel="noreferrer" target="_blank" href={links.booking}>
                        Book a session here
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

const styles: StyleSheetCSS = {
    entry: {
        flexDirection: 'column',
        width: '100%',
    },
    headerRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
    },
    text: {
        marginTop: 8,
    },
};

export default Experience;
