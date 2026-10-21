/**
 * CAK3Dle answers: five-letter words from CAK3D's worlds. Each has a category
 * shown as a hint after the third guess.
 */
export type Answer = { word: string; hint: string };

const group = (hint: string, words: string) => words.split(' ').map((word) => ({ word: word.toUpperCase(), hint }));

export const ANSWERS: Answer[] = [
    ...group('🌿 in the grow room', 'blunt joint grass stash bongs bowls tokes skunk resin smoke paper roach grind baked green plant bloom seeds roots stems cured light chill munch snack cloud'),
    ...group('🔧 in the garage', 'bolts gears brake valve turbo boost subie rally spark drive axles tires wheel shock crank motor'),
    ...group('🧟 in Chernarus', 'loots rifle chern tents medic beans zombi scope ammos'),
    ...group('💻 at the keyboard', 'coder debug nodes array class pixel bytes linux react merge forks shell regex'),
    ...group('🎵 on the RC-505', 'beats loops track drums raves mixer vinyl tempo synth'),
    ...group('🥾 on the trail', 'trail hiker camps peaks maine woods ridge creek'),
];

/** Same word for everyone on a given day */
export function dailyIndex(date = new Date()) {
    const start = Date.UTC(2026, 3, 20); // 4/20
    const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000);
    return (((day * 37) % ANSWERS.length) + ANSWERS.length) % ANSWERS.length;
}
