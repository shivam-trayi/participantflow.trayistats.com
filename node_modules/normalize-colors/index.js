const colorTypes = {
    aliceblue: "#F0F8FF",
    antiquewhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedalmond: "#FFEBCD",
    blue: "#0000FF",
    blueviolet: "#8A2BE2",
    brown: "#A52A2A",
    burlywood: "#DEB887",
    cadetblue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerblue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkblue: "#00008B",
    darkcyan: "#008B8B",
    darkgoldenrod: "#B8860B",
    darkgray: "#A9A9A9",
    darkgrey: "#A9A9A9",
    darkgreen: "#006400",
    darkkhaki: "#BDB76B",
    darkmagenta: "#8B008B",
    darkolivegreen: "#556B2F",
    darkorange: "#FF8C00",
    darkorchid: "#9932CC",
    darkred: "#8B0000",
    darksalmon: "#E9967A",
    darkseagreen: "#8FBC8F",
    darkslateblue: "#483D8B",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    darkturquoise: "#00CED1",
    darkviolet: "#9400D3",
    deeppink: "#FF1493",
    deepskyblue: "#00BFFF",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1E90FF",
    firebrick: "#B22222",
    floralwhite: "#FFFAF0",
    forestgreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostwhite: "#F8F8FF",
    gold: "#FFD700",
    goldenrod: "#DAA520",
    gray: "#808080",
    grey: "#808080",
    green: "#008000",
    greenyellow: "#ADFF2F",
    honeydew: "#F0FFF0",
    hotpink: "#FF69B4",
    indianred: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderblush: "#FFF0F5",
    lawngreen: "#7CFC00",
    lemonchiffon: "#FFFACD",
    lightblue: "#ADD8E6",
    lightcoral: "#F08080",
    lightcyan: "#E0FFFF",
    lightgoldenrodyellow: "#FAFAD2",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3",
    lightgreen: "#90EE90",
    lightpink: "#FFB6C1",
    lightsalmon: "#FFA07A",
    lightseagreen: "#20B2AA",
    lightskyblue: "#87CEFA",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#B0C4DE",
    lightyellow: "#FFFFE0",
    lime: "#00FF00",
    limegreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumaquamarine: "#66CDAA",
    mediumblue: "#0000CD",
    mediumorchid: "#BA55D3",
    mediumpurple: "#9370D8",
    mediumseagreen: "#3CB371",
    mediumslateblue: "#7B68EE",
    mediumspringgreen: "#00FA9A",
    mediumturquoise: "#48D1CC",
    mediumvioletred: "#C71585",
    midnightblue: "#191970",
    mintcream: "#F5FFFA",
    mistyrose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajowhite: "#FFDEAD",
    navy: "#000080",
    oldlace: "#FDF5E6",
    olive: "#808000",
    olivedrab: "#6B8E23",
    orange: "#FFA500",
    orangered: "#FF4500",
    orchid: "#DA70D6",
    palegoldenrod: "#EEE8AA",
    palegreen: "#98FB98",
    paleturquoise: "#AFEEEE",
    palevioletred: "#D87093",
    papayawhip: "#FFEFD5",
    peachpuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderblue: "#B0E0E6",
    purple: "#800080",
    red: "#FF0000",
    rosybrown: "#BC8F8F",
    royalblue: "#4169E1",
    saddlebrown: "#8B4513",
    salmon: "#FA8072",
    sandybrown: "#F4A460",
    seagreen: "#2E8B57",
    seashell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyblue: "#87CEEB",
    slateblue: "#6A5ACD",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#FFFAFA",
    springgreen: "#00FF7F",
    steelblue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whitesmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowgreen: "#9ACD32",
    transparent: "0x00000000"
};

const normalizeColorName = (name) => {
    const key = name.toLowerCase();
    return colorTypes[key] ?? name;
};

const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

const parseRgb = (color) => {
    const values = color
        .replace(/rgba?\(/, '')
        .replace(')', '')
        .split(',')
        .map(v => v.trim());

    const r = parseInt(values[0]);
    const g = parseInt(values[1]);
    const b = parseInt(values[2]);

    if ([r, g, b].some(isNaN)) return '#000000';

    return rgbToHex(r, g, b);
};

const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

    const rr = Math.round((r + m) * 255);
    const gg = Math.round((g + m) * 255);
    const bb = Math.round((b + m) * 255);

    return rgbToHex(rr, gg, bb);
};

const parseHsl = (color) => {
    const inner = color.replace(/hsla?\(/i, '').replace(/\)\s*$/, '').trim();
    const values = inner.split(/[\s,/]+/).map((v) => v.trim().replace('%', ''));

    const h = parseFloat(values[0]);
    const s = parseFloat(values[1]);
    const l = parseFloat(values[2]);

    if ([h, s, l].some((x) => isNaN(x))) return '#000000';

    return hslToHex(h % 360, s, l);
};

// Parse CSS function: "name(v1, v2)" or "name(v1 v2)" -> trimmed values (keep % for detection)
const parseFuncArgs = (color, prefix) => {
    const inner = color
        .replace(new RegExp(`^${prefix}\\(`, 'i'), '')
        .replace(/\)\s*$/, '')
        .trim();
    return inner.split(/[\s,/]+/).map((v) => v.trim());
};

const hwbToHex = (h, w, b) => {
    w /= 100;
    b /= 100;
    h = (h % 360) / 360;
    if (w + b >= 1) {
        const gray = w / (w + b);
        const v = Math.round(gray * 255);
        return rgbToHex(v, v, v);
    }
    const v = 1 - b;
    const s = 1 - w / v;
    const f = (n) => {
        const k = (n + h * 12) % 12;
        const a = s * Math.min(k - 3, 9 - k, 1);
        return Math.max(0, Math.min(1, v - v * a));
    };
    const rr = Math.round(f(0) * 255);
    const gg = Math.round(f(8) * 255);
    const bb = Math.round(f(4) * 255);
    return rgbToHex(rr, gg, bb);
};

const parseHwb = (color) => {
    const values = parseFuncArgs(color, 'hwb');
    const h = parseFloat(values[0].replace('%', ''));
    const w = parseFloat(values[1].replace('%', ''));
    const b = parseFloat(values[2].replace('%', ''));
    if ([h, w, b].some((x) => isNaN(x))) return '#000000';
    return hwbToHex(h, w, b);
};

// CIE LAB (D65) -> XYZ -> linear sRGB -> sRGB
const LAB_D65 = { X: 0.95047, Y: 1, Z: 1.08883 };
const LAB_DELTA = 6 / 29;
const labInv = (t) => (t > LAB_DELTA ? t * t * t : (t - 4 / 29) * (3 * LAB_DELTA * LAB_DELTA));
const labToXyz = (L, a, b) => {
    const fy = (L + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;
    return [
        LAB_D65.X * labInv(fx),
        LAB_D65.Y * labInv(fy),
        LAB_D65.Z * labInv(fz)
    ];
};
const xyzToLinearRgb = (x, y, z) => [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z
];
const linearRgbToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const labToHex = (L, a, b) => {
    const [x, y, z] = labToXyz(L, a, b);
    const [lr, lg, lb] = xyzToLinearRgb(x, y, z);
    const r = Math.round(linearRgbToSrgb(lr) * 255);
    const g = Math.round(linearRgbToSrgb(lg) * 255);
    const b_ = Math.round(linearRgbToSrgb(lb) * 255);
    return rgbToHex(
        Math.max(0, Math.min(255, r)),
        Math.max(0, Math.min(255, g)),
        Math.max(0, Math.min(255, b_))
    );
};

const lchToLab = (L, C, H) => {
    const rad = (H * Math.PI) / 180;
    return [L, C * Math.cos(rad), C * Math.sin(rad)];
};

const parseLab = (color) => {
    const values = parseFuncArgs(color, 'lab');
    const L = parseFloat(values[0].replace('%', ''));
    const a = parseFloat(values[1].replace('%', ''));
    const b = parseFloat(values[2].replace('%', ''));
    if ([L, a, b].some((x) => isNaN(x))) return '#000000';
    return labToHex(L, a, b);
};

const parseLch = (color) => {
    const values = parseFuncArgs(color, 'lch');
    const L = parseFloat(values[0].replace('%', ''));
    const C = parseFloat(values[1].replace('%', ''));
    const H = parseFloat(values[2].replace('%', ''));
    if ([L, C, H].some((x) => isNaN(x))) return '#000000';
    const [L_, a, b] = lchToLab(L, C, H);
    return labToHex(L_, a, b);
};

// OKLAB -> linear sRGB -> sRGB
const oklabToLinearRgb = (L, a, b) => {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    ];
};

const oklabToHex = (L, a, b) => {
    const [lr, lg, lb] = oklabToLinearRgb(L, a, b);
    const r = Math.round(linearRgbToSrgb(lr) * 255);
    const g = Math.round(linearRgbToSrgb(lg) * 255);
    const b_ = Math.round(linearRgbToSrgb(lb) * 255);
    return rgbToHex(
        Math.max(0, Math.min(255, r)),
        Math.max(0, Math.min(255, g)),
        Math.max(0, Math.min(255, b_))
    );
};

const oklchToOklab = (L, C, H) => {
    const rad = (H * Math.PI) / 180;
    return [L, C * Math.cos(rad), C * Math.sin(rad)];
};

const parseOklab = (color) => {
    const values = parseFuncArgs(color, 'oklab');
    let L = parseFloat(values[0].replace('%', ''));
    const a = parseFloat(values[1].replace('%', ''));
    const b = parseFloat(values[2].replace('%', ''));
    if ([L, a, b].some((x) => isNaN(x))) return '#000000';
    if (values[0].includes('%')) L /= 100;
    return oklabToHex(L, a, b);
};

const parseOklch = (color) => {
    const values = parseFuncArgs(color, 'oklch');
    let L = parseFloat(values[0].replace('%', ''));
    const C = parseFloat(values[1].replace('%', ''));
    const H = parseFloat(values[2].replace('%', ''));
    if ([L, C, H].some((x) => isNaN(x))) return '#000000';
    if (values[0].includes('%')) L /= 100;
    const [L_, a, b] = oklchToOklab(L, C, H);
    return oklabToHex(L_, a, b);
};

// --- CSS color() function: predefined RGB and XYZ spaces ---
const mul3 = (M, v) => [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2]
];

const srgbToLinear = (c) => {
    const sign = c < 0 ? -1 : 1;
    const abs = Math.abs(c);
    if (abs <= 0.04045) return c / 12.92;
    return sign * Math.pow((abs + 0.055) / 1.055, 2.4);
};

// Predefined RGB → linear → XYZ (D65 unless noted) → linear sRGB → sRGB
const P3_TO_XYZ = [
    [0.4865709486482162, 0.26566769316909306, 0.1982172851563645],
    [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
    [0.0, 0.04511338185890264, 1.043944368900976]
];
const A98_TO_XYZ = [
    [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
    [0.2973449752505362, 0.6273635662554661, 0.07529145849399788],
    [0.03106634059987123, 0.07569142150111955, 0.9913375368376388]
];
const PROPHOTO_TO_XYZ_D50 = [
    [0.7977666449006423, 0.13518129740053308, 0.0313477341283922],
    [0.2880748288194013, 0.711835234241873, 0.00008993693872564],
    [0.0, 0.0, 0.8251046025104602]
];
const D50_TO_D65 = [
    [0.955473421488075, -0.02309845494876471, 0.06325924320057072],
    [-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
    [0.012314014864481998, -0.020507649298898964, 1.330365926242124]
];
const REC2020_TO_XYZ = [
    [0.6369580483012914, 0.1446169015862832, 0.1688809751641721],
    [0.26270021201126703, 0.6779980715188708, 0.05930171646986196],
    [0.0, 0.028072693049087428, 1.0609850577107912]
];

const linProPhoto = (c) => {
    const sign = c < 0 ? -1 : 1;
    const abs = Math.abs(c);
    if (abs <= 16 / 512) return c / 16;
    return sign * Math.pow(abs, 1.8);
};
const linA98 = (c) => {
    const sign = c < 0 ? -1 : 1;
    return sign * Math.pow(Math.abs(c), 563 / 256);
};
const REC2020_ALPHA = 1.09929682680944;
const REC2020_BETA = 0.018053968510807;
const lin2020 = (c) => {
    const sign = c < 0 ? -1 : 1;
    const abs = Math.abs(c);
    if (abs < REC2020_BETA * 4.5) return c / 4.5;
    return sign * Math.pow((abs + REC2020_ALPHA - 1) / REC2020_ALPHA, 1 / 0.45);
};

const linearRgbToHex = (r, g, b) => {
    const rr = Math.round(linearRgbToSrgb(r) * 255);
    const gg = Math.round(linearRgbToSrgb(g) * 255);
    const bb = Math.round(linearRgbToSrgb(b) * 255);
    return rgbToHex(
        Math.max(0, Math.min(255, rr)),
        Math.max(0, Math.min(255, gg)),
        Math.max(0, Math.min(255, bb))
    );
};

const colorSpaceToHex = (space, c1, c2, c3) => {
    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    let r, g, b;
    const spaceLower = space.toLowerCase();
    if (spaceLower === 'srgb') {
        r = clamp01(c1) * 255;
        g = clamp01(c2) * 255;
        b = clamp01(c3) * 255;
        return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
    }
    if (spaceLower === 'srgb-linear') {
        const [lr, lg, lb] = [c1, c2, c3].map(clamp01);
        return linearRgbToHex(lr, lg, lb);
    }
    if (spaceLower === 'display-p3') {
        const lin = [c1, c2, c3].map((c) => srgbToLinear(clamp01(c)));
        const [x, y, z] = mul3(P3_TO_XYZ, lin);
        const [lr, lg, lb] = xyzToLinearRgb(x, y, z);
        return linearRgbToHex(lr, lg, lb);
    }
    if (spaceLower === 'a98-rgb') {
        const lin = [c1, c2, c3].map((c) => linA98(clamp01(c)));
        const [x, y, z] = mul3(A98_TO_XYZ, lin);
        const [lr, lg, lb] = xyzToLinearRgb(x, y, z);
        return linearRgbToHex(lr, lg, lb);
    }
    if (spaceLower === 'prophoto-rgb') {
        const lin = [c1, c2, c3].map((c) => linProPhoto(clamp01(c)));
        const xyzD50 = mul3(PROPHOTO_TO_XYZ_D50, lin);
        const xyzD65 = mul3(D50_TO_D65, xyzD50);
        const [lr, lg, lb] = xyzToLinearRgb(xyzD65[0], xyzD65[1], xyzD65[2]);
        return linearRgbToHex(lr, lg, lb);
    }
    if (spaceLower === 'rec2020') {
        const lin = [c1, c2, c3].map((c) => lin2020(clamp01(c)));
        const [x, y, z] = mul3(REC2020_TO_XYZ, lin);
        const [lr, lg, lb] = xyzToLinearRgb(x, y, z);
        return linearRgbToHex(lr, lg, lb);
    }
    if (spaceLower === 'xyz' || spaceLower === 'xyz-d65') {
        const [x, y, z] = [c1, c2, c3].map(clamp01);
        const [lr, lg, lb] = xyzToLinearRgb(x, y, z);
        return linearRgbToHex(lr, lg, lb);
    }
    if (spaceLower === 'xyz-d50') {
        const xyzD50 = [clamp01(c1), clamp01(c2), clamp01(c3)];
        const xyzD65 = mul3(D50_TO_D65, xyzD50);
        const [lr, lg, lb] = xyzToLinearRgb(xyzD65[0], xyzD65[1], xyzD65[2]);
        return linearRgbToHex(lr, lg, lb);
    }
    return '#000000';
};

const parseColorFunc = (color) => {
    const inner = color.replace(/color\s*\(/i, '').replace(/\)\s*$/, '').trim();
    const withoutAlpha = inner.split(/\s*\/\s*/)[0].trim();
    const tokens = withoutAlpha.split(/[\s,]+/).map((t) => t.trim());
    if (tokens.length < 4) return '#000000';
    const space = tokens[0];
    const parseChan = (s) => {
        if (!s || s.toLowerCase() === 'none') return 0;
        const n = parseFloat(s.replace('%', ''));
        if (isNaN(n)) return 0;
        return s.includes('%') ? n / 100 : n;
    };
    const c1 = parseChan(tokens[1]);
    const c2 = parseChan(tokens[2]);
    const c3 = parseChan(tokens[3]);
    return colorSpaceToHex(space, c1, c2, c3);
};

const normalizeColor = (color) => {
    if (!color) return '#000000';

    if (color.startsWith('#')) {
        if (color.length === 4) {
            return (
                '#' +
                color[1] + color[1] +
                color[2] + color[2] +
                color[3] + color[3]
            );
        }
        return color;
    }

    if (color.startsWith('rgb')) {
        return parseRgb(color);
    }

    if (color.startsWith('hsl')) {
        return parseHsl(color);
    }

    if (color.startsWith('hwb')) {
        return parseHwb(color);
    }

    if (color.startsWith('lab')) {
        return parseLab(color);
    }

    if (color.startsWith('lch')) {
        return parseLch(color);
    }

    if (color.startsWith('oklab')) {
        return parseOklab(color);
    }

    if (color.startsWith('oklch')) {
        return parseOklch(color);
    }

    if (color.toLowerCase().startsWith('color(')) {
        return parseColorFunc(color);
    }

    return normalizeColorName(color);
};


module.exports = normalizeColor;
