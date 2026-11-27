# Styling with Panda CSS

Import runtime helpers from the generated outdir, with a relative path:

```ts
import { css, cva, cx, sva } from '../../../styled-system/css';
```

- One element with variants → `cva`. Several elements sharing variants → `sva`. One-off → `css`.
  Define recipes at module scope in the component file; do not export them.
- `@keyframes` go in `theme.keyframes` of the preset (a component-local `.css` file would not be
  part of `dist/styles.css`).
- Panda extracts styles statically. Every value must be a literal (or a named import of a
  `css.raw` object, which may be spread). No runtime values, dynamic keys, or computed strings.
  Runtime-dependent values go through CSS variables: `style={{ '--x': value }}` + `var(--x)`.
- State styling uses conditions, not JS branching: `_hover`, `_active`, `_focusVisible`,
  `_checked`, `_disabled`, `_open`, `_invalid`, `_readOnly`, `_currentPage`, `_selected`,
  `_expanded`, `_before`, `_after`, `_motionReduce`, plus the preset's `_ariaDisabled`,
  `_forcedColors`, `_hoverable`, `_notOnly`, `_groupOpen`. Parent state → child:
  `className='group'` on the parent and `_groupHover` etc. on the child, or a nested selector.
  Ark UI exposes state as `data-*` attributes, which the built-in conditions already match
  (`_open`, `_selected`, `_checked`, `_disabled`, `_highlighted`, …).
- Nested selectors must contain `&`: `'& svg': {…}`, `'&:has(input:checked)': {…}`,
  `'&[data-size=lg]': {…}`.
- Responsive: `{ base: …, desktop: … }` (`desktop` = 48em, `desktopAdmin` = 62em). Arbitrary
  at-rules work as keys: `'@container (min-width: 30rem)': {…}`.
- Atomic rules sort by property breadth: a longhand always beats a shorthand. When one style
  must override another, write longhands on both sides (`borderTopWidth`, `paddingInline`, …).
  Never use `!important`.
- To override a style of a component you wrap (e.g. `Button`'s `min-width`) through `className`,
  raise specificity with `'&&': {…}`. Two plain atomic classes for the same property do not have
  a reliable order.
- Preflight (CSS reset) is on. Do not re-declare resets (`margin: 0` on lists,
  `box-sizing`, button borders/backgrounds, …).

## Tokens

Token names follow `@digital-go-jp/design-tokens`. Check `styled-system/types/tokens.d.ts`
before using a name.

- Colors: `blue.900`, `light-blue.700`, `solid-gray.800`, `opacity-gray.100`, `white`, `black`,
  `key.900` (key color), `success.1`, `error.1`, `warning-yellow.1`, `warning-orange.1`, …
  Forced-colors system colors are written as literals (`'GrayText'`, `'Highlight'`).
- Spacing and sizes are named in px and emitted in rem: `'8'` = 0.5rem, `'16'` = 1rem.
  Available steps: 0 1 2 3 4 5 6 8 10 12 14 16 18 20 24 28 32 36 40 44 48 56 64 72 80 96 120 160.
  For other values write a rem literal (`'0.4375rem'`). Tailwind spacing `n` in the reference
  equals `n × 4` px here (`px-4` → `paddingInline: '16'`, `gap-1.5` → `gap: '6'`).
- Always pass token names as strings (`'8'`, never `8`).
- Radii: `'4' '6' '8' '12' '16' '24' '32' 'full'`. Shadows (elevation): `'1'`–`'8'`.
  Border widths: `'1'`–`'4'`.
- Typography: use `textStyle` — `std-16N-170`, `dns-16B-130`, `oln-14B-100`, `mono-14N-150`, …
  (`<type>-<size><B|N>-<line-height>`). Do not set `fontSize`/`lineHeight` separately unless
  the reference does.
- Shared fragments: `focusRing` (`src/styles/focus.ts`), `linkStyle` (`src/styles/link.ts`).
  Spread them: `_focusVisible: { ...focusRing }`.

If a token or condition is missing, use a literal value or a `&` selector in the component.
Change `src/preset/` only when several components need the addition, then run
`pnpm panda codegen`.
