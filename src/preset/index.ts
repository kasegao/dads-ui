import { definePreset } from '@pandacss/dev/define';
import { textStyles } from './text-styles';
import { colors, fontSizes, lineHeights, radii, semanticColors, shadows } from './tokens.generated';

/** Spacing/size steps are named in px (DADS convention) and emitted in rem. */
const pxSteps = [
  0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96,
  120, 160,
];

const pxScale = Object.fromEntries(
  pxSteps.map((px) => [`${px}`, { value: px === 0 ? '0' : `${px / 16}rem` }]),
);

/**
 * Panda CSS preset for the Digital Agency Design System (DADS).
 * Token names follow `@digital-go-jp/design-tokens`.
 */
export const dadsPreset = definePreset({
  name: 'dads',
  conditions: {
    extend: {
      forcedColors: '@media (forced-colors: active)',
      hoverable: '@media (hover: hover)',
      ariaDisabled: '&[aria-disabled=true]',
      notOnly: '&:not(:only-child)',
      groupOpen: '.group:is([open], [data-open], [data-state="open"]) &',
    },
  },
  theme: {
    breakpoints: {
      desktop: '48em',
      desktopAdmin: '62em',
    },
    tokens: {
      colors: {
        ...colors,
        transparent: { value: 'transparent' },
        current: { value: 'currentColor' },
      },
      fonts: {
        sans: { value: "'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif" },
        mono: { value: "'Noto Sans Mono', monospace" },
      },
      fontSizes,
      fontWeights: {
        400: { value: '400' },
        700: { value: '700' },
      },
      lineHeights,
      radii: { ...radii, 0: { value: '0' } },
      shadows,
      spacing: pxScale,
      sizes: {
        ...pxScale,
        full: { value: '100%' },
        fit: { value: 'fit-content' },
        min: { value: 'min-content' },
        max: { value: 'max-content' },
      },
      borderWidths: {
        1: { value: '1px' },
        2: { value: '2px' },
        3: { value: '3px' },
        4: { value: '4px' },
      },
      zIndex: {
        dropdown: { value: '100' },
        sticky: { value: '200' },
        overlay: { value: '300' },
        modal: { value: '400' },
      },
    },
    semanticTokens: {
      colors: {
        ...semanticColors,
      },
    },
    textStyles,
    keyframes: {
      'dads-spinner-rotate': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
      'dads-spinner-group-rotate': {
        '0%': { transform: 'rotate(0deg)' },
        '30%': { transform: 'rotate(135deg)' },
        '100%': { transform: 'rotate(180deg)' },
      },
      'dads-spinner-bar-rotate': {
        '0%': { transform: 'rotate(0deg)' },
        '4%': { transform: 'rotate(0deg)' },
        '30%': {
          transform: 'rotate(360deg)',
          animationTimingFunction: 'cubic-bezier(0.5, 0.4, 0.3, 0.9)',
        },
        '100%': { transform: 'rotate(540deg)' },
      },
      'dads-spinner-bar-dash': {
        '0%': { strokeDasharray: '8 92', strokeDashoffset: '4' },
        '30%': { strokeDasharray: '80 20', strokeDashoffset: '40' },
        '100%': { strokeDasharray: '8 92', strokeDashoffset: '4' },
      },
      'dads-linear-rotate': {
        '0%': { strokeDashoffset: '100' },
        '100%': { strokeDashoffset: '-100' },
      },
    },
  },
  globalCss: {
    html: {
      scrollbarGutter: 'stable',
      '&:has(:modal)': { overflow: 'clip', scrollbarGutter: 'auto' },
    },
    body: {
      fontFamily: 'sans',
      textStyle: 'std-16N-170',
      color: 'solid-gray.800',
      backgroundColor: 'white',
      '&:has(:modal)': { overflow: 'auto', scrollbarGutter: 'stable' },
    },
  },
});

export default dadsPreset;
