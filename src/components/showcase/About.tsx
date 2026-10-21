import React from 'react';
import { Link } from 'react-router-dom';
import { links } from '../../constants/cak3d';

export interface AboutProps {}

const About: React.FC<AboutProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1 style={{ marginLeft: -16 }}>Welcome</h1>
            <h3>As you might have already noticed, I go by ꧁ᙅᗣҜӠᙃ꧂</h3>
            <br />
            <div className="text-block">
                <p>
                    I like to code, mostly whipping up custom Discord bots and
                    tweaking DayZ servers for fun. On my free time I
                    lightweight-overnight-hike the Appalachian Trail. And I FIX
                    CAR FOR MONIES ! !
                </p>
                <br />
                <p>
                    I'm a gamer at heart (DayZ, GTA V, Ghost of Tsushima,
                    SESSION Skate Sim, you name it) and I live for music, always
                    spinning tracks on Spotify, creating my own works or
                    attending concerts and festivals. My creative spark extends
                    to projection mapping, music production, and even CAD and
                    other digital designs, all fueled by a relentless curiosity
                    and a DIY ethos.
                </p>
                <br />
                <p>
                    Got an idea for a bot, server, or project? Hit me up on the{' '}
                    <Link to="/contact">contact page</Link> or drop into the{' '}
                    <a rel="noreferrer" target="_blank" href={links.discord}>
                        Discord
                    </a>
                    . The full site lives at{' '}
                    <a rel="noreferrer" target="_blank" href={links.site}>
                        real-cak3d.github.io
                    </a>
                    .
                </p>
            </div>
            <div className="text-block">
                <h3>Hobbies</h3>
                <br />
                <p>Life's too short to stick to one lane. Here's what fuels my fire:</p>
                <br />
                <ul>
                    <li>
                        <p>
                            <b>Gaming:</b> deep into DayZ (building servers,
                            modding files and surviving), GTA V, Session Skate
                            Sim, and Ghost of Tsushima. Expect me to nerd out
                            over open-world chaos or samurai vibes.
                        </p>
                    </li>
                    <li>
                        <p>
                            <b>Music:</b> always got Spotify or Soundcloud
                            blasting, from lo-fi to trap to in your face DnB. I
                            make my own tracks with a Boss RC-505 Loopstation
                            and a MacBook, layering beats like I layer code.
                            More on the{' '}
                            <Link to="/projects/music">music page</Link>.
                        </p>
                    </li>
                    <li>
                        <p>
                            <b>Outdoor Life:</b> lightweight overnight hikes on
                            the Appalachian Trail, skiing and snowboarding down
                            fresh powder, skateboarding city streets when the
                            mood strikes, weekend cookouts (food is life).
                        </p>
                    </li>
                    <li>
                        <p>
                            <b>Creative Arts:</b> projection mapping for trippy
                            visuals, graffiti-inspired designs, and CAD for
                            precision projects and 3D renders. See the{' '}
                            <Link to="/projects/art">creative page</Link>.
                        </p>
                    </li>
                    <li>
                        <p>
                            <b>Tech Toys:</b> a GMK Tec M7 NUCbox that's awesome
                            for DayZ edits, small but mighty. Itching to dive
                            into Raspberry Pi, the FlipperZero and Blender for
                            new creations.
                        </p>
                    </li>
                    <li>
                        <p>
                            <b>Mechanic:</b> fixing cars for a living, from
                            diagnostics to full rebuilds. I drive a Subaru WRX,
                            so I live for performance.
                        </p>
                    </li>
                </ul>
            </div>
            <div className="text-block">
                <h3>Education</h3>
                <br />
                <p>
                    Self taught: coding, music, and more, learned through trial,
                    error, and endless curiosity. High school diploma.
                </p>
            </div>
        </div>
    );
};

export default About;
