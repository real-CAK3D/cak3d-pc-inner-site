import React from 'react';

export interface ArtProjectsProps {}

const ArtProjects: React.FC<ArtProjectsProps> = (props) => {
    return (
        <div className="site-page-content">
            <h1>Creative</h1>
            <h3>Projection, CAD & Graffiti</h3>
            <br />
            <div className="text-block">
                <p>
                    From projection mapping to music production, I blend visuals
                    and sound, creating my own perspective of the world.
                </p>
            </div>
            <div className="text-block">
                <h2>Projection Mapping</h2>
                <br />
                <p>Basic projection mapping for trippy visuals and immersive gatherings.</p>
            </div>
            <div className="text-block">
                <h2>CAD & 3D</h2>
                <br />
                <p>
                    CAD for precision projects and 3D renders, with 3 years of
                    creating precise designs for mechanical and creative
                    projects. Blender is next on the list.
                </p>
            </div>
            <div className="text-block">
                <h2>Graffiti & Edits</h2>
                <br />
                <p>
                    Graffiti-inspired designs. GIMP is my go-to for quick edits
                    and creating images to upload to DayZ servers.
                </p>
            </div>
        </div>
    );
};

export default ArtProjects;
