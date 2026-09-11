/**
 * @internal
 */

import { simpleHash } from './hash';
const TEST_FONTS = ['Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Calibri Light', 'Cambria', 'Candara', 'Century Gothic', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MS PGothic', 'MS UI Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Historic', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'SimSun', 'Sitka Banner', 'Sitka Display', 'Sitka Heading', 'Sitka Small', 'Sitka Subheading', 'Sitka Text', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic', 'Yu Gothic UI', 'American Typewriter', 'Andale Mono', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'AppleGothic', 'AppleMyungjo', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Copperplate', 'Corsiva Hebrew', 'Courier', 'DIN Alternate', 'DIN Condensed', 'Didot', 'Euphemia UCAS', 'Futura', 'Geneva', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hiragino Kaku Gothic Pro', 'Hiragino Mincho Pro', 'Hoefler Text', 'Kailasa', 'Kannada Sangam MN', 'Khmer Sangam MN', 'Kohinoor Bangla', 'Kohinoor Devanagari', 'Kohinoor Telugu', 'Lao Sangam MN', 'Lucida Grande', 'Luminari', 'Malayalam Sangam MN', 'Marker Felt', 'Menlo', 'Monaco', 'Noteworthy', 'Optima', 'Oriya Sangam MN', 'Osaka', 'Palatino', 'Papyrus', 'Phosphate', 'PingFang HK', 'PingFang SC', 'PingFang TC', 'Plantagenet Cherokee', 'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Rockwell', 'Savoye LET', 'SignPainter', 'Sinhala Sangam MN', 'Skia', 'Snell Roundhand', 'STIXGeneral', 'Superclarendon', 'Tamil Sangam MN', 'Telugu Sangam MN', 'Times', 'Trattatello', 'Zapfino', 'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Light', 'Ubuntu Mono', 'DejaVu Sans', 'DejaVu Sans Mono', 'DejaVu Serif', 'Liberation Mono', 'Liberation Sans', 'Liberation Serif', 'Nimbus Mono L', 'Nimbus Roman No9 L', 'Nimbus Sans L', 'FreeMono', 'FreeSans', 'FreeSerif', 'Noto Sans', 'Noto Serif', 'Noto Mono', 'Droid Sans', 'Droid Sans Mono', 'Droid Serif', 'Open Sans', 'Roboto', 'Roboto Condensed', 'Roboto Mono', 'Roboto Slab', 'Lato', 'Montserrat', 'Source Sans Pro', 'Source Code Pro', 'Source Serif Pro', 'Oswald', 'Raleway', 'Merriweather', 'Nunito', 'Poppins', 'Playfair Display', 'Quicksand', 'Rubik', 'Work Sans', 'Fira Sans', 'Fira Mono', 'Fira Code', 'Barlow', 'Barlow Condensed', 'Inter', 'Manrope', 'DM Sans', 'DM Serif Display', 'IBM Plex Sans', 'IBM Plex Mono', 'JetBrains Mono', 'Inconsolata', 'Space Mono', 'Space Grotesk'];
const BASE_FONTS = ['monospace', 'sans-serif', 'serif'];
const TEST_STRING = 'mmmmmmmmmmlli';
const TEST_SIZE = '72px';
export async function detectFonts() {
  const startTime = performance.now();
  const installedFonts = [];
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return {
        installedFonts: [],
        fontCount: 0,
        fontFingerprint: 'unavailable',
        detectionTimeMs: performance.now() - startTime
      };
    }
    const baseWidths = {};
    for (const baseFont of BASE_FONTS) {
      ctx.font = `${TEST_SIZE} ${baseFont}`;
      baseWidths[baseFont] = ctx.measureText(TEST_STRING).width;
    }
    for (const font of TEST_FONTS) {
      let detected = false;
      for (const baseFont of BASE_FONTS) {
        ctx.font = `${TEST_SIZE} "${font}", ${baseFont}`;
        if (ctx.measureText(TEST_STRING).width !== baseWidths[baseFont]) {
          detected = true;
          break;
        }
      }
      if (detected) installedFonts.push(font);
    }
    return {
      installedFonts,
      fontCount: installedFonts.length,
      fontFingerprint: simpleHash(installedFonts.sort().join('|')),
      detectionTimeMs: performance.now() - startTime
    };
  } catch {
    return {
      installedFonts: [],
      fontCount: 0,
      fontFingerprint: 'error',
      detectionTimeMs: performance.now() - startTime
    };
  }
}
export default detectFonts;