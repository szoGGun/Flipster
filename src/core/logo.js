// Flipster logo (src/assets/logo, flat SVG: white F, lime "buy" arrow, red "sell" arrow), inlined as markup.
import markSvg from '../assets/logo/flipster-mark-white-f-transparent.svg';
import tileSvg from '../assets/logo/flipster-32-white-f-navy-bg.svg';

// size comes from CSS: drop the file's own width/height, keep the viewBox
const bare = (s) => s.replace(/\s(width|height)="\d+"/g, '').trim();
/** the mark on a transparent background (for dark backgrounds, e.g. the panel header) */
export const MARK = bare(markSvg);
/** the mark on its navy square (for any background, e.g. the green button) */
export const TILE = bare(tileSvg);
