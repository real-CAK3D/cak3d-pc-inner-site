import React from 'react';
import { links } from '../../../constants/cak3d';

export interface MusicProjectsProps {}

const MusicProjects: React.FC<MusicProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Music</h1>
            <h3>Loops & Festivals</h3>
            <br />
            <div className="text-block">
                <p>
                    Always got Spotify or Soundcloud blasting, from lo-fi to
                    trap to in your face DnB. I make my own tracks using my Boss
                    RC-505 Loopstation and MacBook Air, layering beats like I
                    layer code.
                </p>
                <br />
                <p>
                    15+ years of music production with a focus on layering and
                    live looping. Catch what I'm spinning on{' '}
                    <a rel="noreferrer" target="_blank" href={links.spotify}>
                        Spotify
                    </a>
                    .
                </p>
            </div>
            <div className="text-block">
                <h2>Festivals</h2>
                <br />
                <p>
                    I've promoted and curated several music festivals,
                    handpicking artists and crafting immersive vibes that blend
                    sound, visuals, and community. From underground raves to
                    open-air gatherings, I've attended countless festivals,
                    soaking in the energy and channeling it into my own
                    creations.
                </p>
            </div>
        </div>
    );
};

export default MusicProjects;
