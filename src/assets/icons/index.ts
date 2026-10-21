import React from 'react';

import windowResize from './windowResize.png';
import maximize from './maximize.png';
import minimize from './minimize.png';
import computerBig from './computerBig.png';
import computerSmall from './computerSmall.png';
import myComputer from './myComputer.png';
import showcaseIcon from './showcaseIcon.png';
import doomIcon from './doomIcon.png';
import henordleIcon from './henordleIcon.png';
import credits from './credits.png';
import volumeOn from './volumeOn.png';
import volumeOff from './volumeOff.png';
import trailIcon from './trailIcon.png';
import windowGameIcon from './windowGameIcon.png';
import windowExplorerIcon from './windowExplorerIcon.png';
import windowsStartIcon from './windowsStartIcon.png';
import scrabbleIcon from './scrabbleIcon.png';
import close from './close.png';
import terminalIcon from './terminalIcon.png';
import browserIcon from './browserIcon.png';
import newsIcon from './newsIcon.png';
import ghostIcon from './ghostIcon.png';
import floppyIcon from './floppyIcon.png';
import musicIcon from './musicIcon.png';

const icons = {
    windowResize: windowResize,
    maximize: maximize,
    minimize: minimize,
    computerBig: computerBig,
    computerSmall: computerSmall,
    myComputer: myComputer,
    showcaseIcon: showcaseIcon,
    doomIcon: doomIcon,
    volumeOn: volumeOn,
    volumeOff: volumeOff,
    credits: credits,
    scrabbleIcon: scrabbleIcon,
    henordleIcon: henordleIcon,
    close: close,
    windowGameIcon: windowGameIcon,
    windowExplorerIcon: windowExplorerIcon,
    windowsStartIcon: windowsStartIcon,
    trailIcon: trailIcon,
    terminalIcon: terminalIcon,
    browserIcon: browserIcon,
    newsIcon: newsIcon,
    ghostIcon: ghostIcon,
    floppyIcon: floppyIcon,
    musicIcon: musicIcon,
};

export type IconName = keyof typeof icons;

const getIconByName = (
    iconName: IconName
    // @ts-ignore
): React.FC<React.SVGAttributes<SVGElement>> => icons[iconName];

export default getIconByName;
