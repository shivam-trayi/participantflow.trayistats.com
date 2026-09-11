# normalize-colors

Normalize any CSS color value to a hex string (`#RRGGBB`). Supports hex, named colors, and all major CSS color functions and spaces.

## Install

```bash
npm install normalize-colors
# or
npm i normalize-colors
```

## Usage

```js
const normalizeColor = require("normalize-colors");
// or
import normalizeColor from "normalize-colors";

normalizeColor("red");                    // "#FF0000"
normalizeColor("rgb(255, 0, 0)");        // "#FF0000"
normalizeColor("hsl(0 100% 50%)");        // "#FF0000"
normalizeColor("color(display-p3 1 0 0)"); // "#FF0000"
```

Returns `#RRGGBB` for valid colors, or `#000000` for invalid/missing input. Alpha is ignored; output is always opaque hex.

---

## Supported color formats

### Hex

| Format | Example |
|--------|--------|
| 6-digit hex | `#FF0000`, `#ff0000` |
| 3-digit hex | `#F00` → `#FF0000` |

### Named colors

All CSS named colors (e.g. `red`, `aliceblue`, `rebeccapurple`) and `transparent` (normalized to `0x00000000`).

### RGB / RGBA

| Syntax | Example |
|--------|--------|
| `rgb(r g b)` | `rgb(255 0 0)` |
| `rgb(r, g, b)` | `rgb(255, 0, 0)` |
| `rgba(r, g, b, a)` | `rgba(255, 0, 0, 0.5)` |

Values: 0–255 for r,g,b; alpha is ignored for output.

### HSL / HSLA

| Syntax | Example |
|--------|--------|
| `hsl(h s% l%)` | `hsl(120 100% 50%)` |
| `hsl(h, s%, l%)` | `hsl(120, 100%, 50%)` |
| `hsla(h, s%, l%, a)` | `hsla(120, 100%, 50%, 0.5)` |

- **H**: hue in degrees (0–360).
- **S**: saturation, number or percentage (0–100).
- **L**: lightness, number or percentage (0–100).  
Alpha is ignored.

### HWB

| Syntax | Example |
|--------|--------|
| `hwb(h w% b%)` | `hwb(120 50% 0%)` |
| `hwb(h, w%, b%)` | `hwb(120, 50%, 0%)` |

- **H**: hue in degrees (0–360).
- **W**: whiteness, number or percentage (0–100).
- **B**: blackness, number or percentage (0–100).

### LAB (CIE L\*a\*b\*)

| Syntax | Example |
|--------|--------|
| `lab(L a b)` | `lab(50 10 -5)` |
| `lab(L% a b)` | `lab(50% 0 0)` |

- **L**: lightness (0–100 or 0%–100%).
- **a**, **b**: opponent axes (unbounded in theory).

### LCH (CIE LCH)

| Syntax | Example |
|--------|--------|
| `lch(L C H)` | `lch(50% 20 180)` |
| `lch(L, C, H)` | `lch(50, 20, 180)` |

- **L**: lightness (0–100 or percentage).
- **C**: chroma (≥ 0).
- **H**: hue in degrees (0–360).

### OKLAB

| Syntax | Example |
|--------|--------|
| `oklab(L a b)` | `oklab(0.6 0.1 -0.05)` |
| `oklab(L% a b)` | `oklab(60% 0.1 -0.05)` |

- **L**: lightness (0–1 or 0%–100%).
- **a**, **b**: opponent axes.

### OKLCH

| Syntax | Example |
|--------|--------|
| `oklch(L C H)` | `oklch(0.6 0.2 180)` |
| `oklch(L%, C, H)` | `oklch(60% 0.2 180)` |

- **L**: lightness (0–1 or percentage).
- **C**: chroma (≥ 0).
- **H**: hue in degrees (0–360).

### CSS `color()` function

All spaces defined in [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) for `color()` are supported. Components are numbers in the range 0–1 or percentages; optional alpha after `/` is ignored.

| Space | Description | Example |
|-------|-------------|--------|
| `srgb` | sRGB (gamma-encoded) | `color(srgb 0.5 0 0)` |
| `srgb-linear` | Linear sRGB | `color(srgb-linear 0.215 0 0)` |
| `display-p3` | Display P3 (D65) | `color(display-p3 0.24 0.52 0.48)` |
| `a98-rgb` | Adobe RGB (1998) | `color(a98-rgb 0.44 0.5 0.37)` |
| `prophoto-rgb` | ProPhoto RGB (D50) | `color(prophoto-rgb 0.28 0.4 0.42)` |
| `rec2020` | ITU-R BT.2020 | `color(rec2020 0.42 0.48 0.36)` |
| `xyz` | CIE XYZ (D65) | `color(xyz 0.2 0.15 0.6)` |
| `xyz-d50` | CIE XYZ (D50) | `color(xyz-d50 0.2 0.14 0.45)` |
| `xyz-d65` | CIE XYZ (D65) | `color(xyz-d65 0.22 0.15 0.59)` |

**Syntax:** `color(<space> <c1> <c2> <c3> [ / <alpha> ])`  
Components can be space- or comma-separated. Values can be numbers (0–1), percentages (0%–100%), or `none` (treated as 0).

---

## Summary

- **Hex**: 3/6-digit.
- **Named**: All CSS color names + `transparent`.
- **Functions**: `rgb`, `rgba`, `hsl`, `hsla`, `hwb`, `lab`, `lch`, `oklab`, `oklch`, and `color(<space> ...)` with all predefined RGB and XYZ spaces above.

All of these are normalized to a single opaque hex string for consistent use in code or further processing.
