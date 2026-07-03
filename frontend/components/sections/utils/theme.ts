import type { CSSProperties } from "react";
import tinycolor from "tinycolor2";

export interface ThemePreset {
    id: string;
    label: string;
    baseColor: string;
}

export const THEME_PRESETS: ThemePreset[] = [
    { id: "rose", label: "Rose", baseColor: "#f43f5e" },
    { id: "sky", label: "Sky", baseColor: "#0ea5e9" },
    { id: "sunset", label: "Sunset", baseColor: "#f97316" },
    { id: "violet", label: "Violet", baseColor: "#8b5cf6" },
    { id: "emerald", label: "Emerald", baseColor: "#10b981" },
];

export interface ThemeTokens {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    gradientFrom: string;
    gradientTo: string;
    soft: string;
    softer: string;
    border: string;
    glow: string;
    onPrimary: string;
}

// tinycolor's .lighten() raises HSL lightness by a fixed amount and clamps at
// white — for a base color that already sits above ~55% lightness (Rose,
// Sunset, Violet all do) that clamps to flat #ffffff and throws the hue away.
// Mixing toward white by a percentage instead keeps a trace of hue at any
// starting lightness.
function mixWithWhite(color: tinycolor.Instance, weightPercent: number): string {
    const rgb = color.toRgb();
    const w = weightPercent / 100;
    return tinycolor({
        r: Math.round(rgb.r * (1 - w) + 255 * w),
        g: Math.round(rgb.g * (1 - w) + 255 * w),
        b: Math.round(rgb.b * (1 - w) + 255 * w),
    }).toHexString();
}

/**
 * Derives a full token set from a single base color so a section only needs to
 * store `content.theme.baseColor` — every shade used across sections (soft
 * background, gradient pair, blur glow, readable text) is computed from it.
 */
export function buildThemeTokens(baseColor: string): ThemeTokens {
    const base = tinycolor(baseColor);
    if (!base.isValid()) {
        return buildThemeTokens(THEME_PRESETS[0].baseColor);
    }

    const primary = base.toHexString();
    const primaryDark = base.clone().darken(12).toHexString();
    const primaryLight = base.clone().lighten(10).toHexString();

    // Analogous hue shift, mirroring the hand-picked "from-pink-500 to-rose-500"
    // style gradients already used across the section components.
    const gradientFrom = primary;
    const gradientTo = base.clone().spin(-16).lighten(4).toHexString();

    // Pale tint for full-section backgrounds (rose-50 equivalent) and an even
    // paler variant, both mixed toward white so they never flatten out.
    const soft = mixWithWhite(base.clone(), 90);
    const softer = mixWithWhite(base.clone(), 95);

    // Light tint for hairline borders (rose-100 equivalent).
    const border = mixWithWhite(base.clone(), 78);

    // Semi-transparent glow for blur auras behind cinematic characters.
    const glow = base.clone().setAlpha(0.4).toRgbString();

    // Restricted to our two curated choices (no includeFallbackColors) so we
    // never get a jarring pure-black/pure-white pick outside the theme's voice.
    const onPrimary = tinycolor
        .mostReadable(primary, ["#ffffff", "#3a2433"], { includeFallbackColors: false })
        .toHexString();

    return {
        primary,
        primaryDark,
        primaryLight,
        gradientFrom,
        gradientTo,
        soft,
        softer,
        border,
        glow,
        onPrimary,
    };
}

const TOKEN_TO_CSS_VAR: Record<keyof ThemeTokens, string> = {
    primary: "--theme-primary",
    primaryDark: "--theme-primary-dark",
    primaryLight: "--theme-primary-light",
    gradientFrom: "--theme-gradient-from",
    gradientTo: "--theme-gradient-to",
    soft: "--theme-soft",
    softer: "--theme-softer",
    border: "--theme-border",
    glow: "--theme-glow",
    onPrimary: "--theme-on-primary",
};

/** Converts tokens into a React inline-style object of CSS custom properties. */
export function themeTokensToCssVars(tokens: ThemeTokens): CSSProperties {
    const style: Record<string, string> = {};
    for (const key of Object.keys(tokens) as (keyof ThemeTokens)[]) {
        style[TOKEN_TO_CSS_VAR[key]] = tokens[key];
    }
    return style as CSSProperties;
}
