# AGENTS.md

Rules for AI coding agents (and humans) working on this repo.

## Project overview

A React + Panda CSS + Storybook implementation of the Digital Agency Design System (DADS) v2.
Design and behavior follow the official references:

- Guidelines: https://design.digital.go.jp/dads/
- React reference (Tailwind): https://github.com/digital-go-jp/design-system-example-components-react
- HTML reference: https://github.com/digital-go-jp/design-system-example-components-html

No Tailwind. Styles are written with Panda CSS; complex widgets use Ark UI.

## Tech stack

- React 19, TypeScript 7, Vite 8
- Panda CSS 2 (`@pandacss/dev`, `@pandacss/vite`) with the DADS preset in `src/preset/`
- Ark UI (`@ark-ui/react`) for widgets with non-trivial behavior
- Storybook 10 (`@storybook/react-vite`)
- Vitest 5 in Browser Mode (Playwright + Chromium) with `vitest-browser-react`
- Biome, pnpm

### Commands

- `pnpm storybook` — Storybook on :6006
- `pnpm test` — Vitest (browser mode)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` / `pnpm lint:fix` — Biome
- `pnpm build` — library build (`dist/index.js`, `dist/styles.css`, `dist/types`); `dist/styles.css` is
  generated with `panda.build.config.ts`, which scans component sources only
- `pnpm panda codegen` — regenerate `styled-system/` after changing `panda.config.ts` or `src/preset/`

### Distribution

`pnpm build` produces two ways to consume the library:

- Without Panda: `@kasegao/dads-ui/styles.css` (every component's styles) plus the components.
- With Panda: `panda lib` writes `dist/panda/` (manifest, preset, build info) and regenerates the
  `./css`, `./patterns`, `./jsx`, `./tokens`, `./helpers`, `./types`, and `./panda/*` entries of
  `package.json` `exports`. Apps set `designSystem: '@kasegao/dads-ui'`. Do not edit those
  entries by hand; only `.`, `./preset`, and `./styles.css` are hand-written. `styled-system/` is
  published because the generated entries point at it.

### CI

`.github/workflows/ci.yml` runs lint, typecheck and tests on pull requests that are not drafts.
After adding a workflow or changing a `uses:`, run `gh actions-lock` and commit
`.github/workflows/actions.lock`.

`.github/dependabot.yml` opens weekly update pull requests for npm packages and GitHub Actions.
Packages that are released together (Storybook, Panda CSS, Vitest, React) are grouped into one
pull request each. Dependabot updates `actions.lock` itself when it bumps an action.

### Release

The package is published to npm as `@kasegao/dads-ui`. Bump `version` in `package.json`, merge to
`main`, then push a tag `vX.Y.Z` that matches it. `.github/workflows/publish.yml` runs lint,
typecheck, tests and the build, then publishes with npm trusted publishing (OIDC); no npm token is
stored in the repository.

## File layout

```
src/
├── preset/              # Panda preset: DADS tokens, text styles, conditions
├── styles/              # Shared style fragments (css.raw) and the layer-order CSS
├── utils/               # Slot etc.
├── components/Foo/
│   ├── Foo.tsx          # Implementation (sub-components live here too)
│   ├── Foo.stories.tsx  # Storybook
│   ├── Foo.test.tsx     # Vitest browser-mode tests
│   └── index.ts         # `export * from './Foo';`
└── index.ts             # Public exports
```

`src/components/Button/` is the reference for style and structure. Read all of its files first.

## Component design

- Composition over configuration: expose sub-components (`Accordion`, `AccordionSummary`, …) and
  let consumers assemble the structure. Do not lock structure inside props.
- Base props on native element props (`ComponentProps<'button'>`); add custom props only when
  needed. Always accept `className` and merge it with `cx(recipe(), className)`. Spread `rest`
  onto the root element (React 19: `ref` is a normal prop, no `forwardRef`).
- Prefer native HTML semantics (`<details>`, `<dialog>`, `<select>`, `<input type="checkbox">`)
  when they are sufficient. Use Ark UI when the widget needs keyboard navigation, focus
  management, positioning, or date logic that would otherwise be hand-written (tabs, menus,
  date picker, carousel, file upload, dialogs).
- Reuse existing components instead of copying their styles: a button inside another component
  is `Button` (`import { Button } from '../Button'`), with only the differences added through
  `className`.
- When wrapping Ark UI, export DADS-named wrappers (`Tab`, `TabList`, …) that apply the styles;
  consumers should not need to import Ark themselves for normal use.
- Target WCAG 2.2 AA. Keep ARIA minimal; mirror the reference's `forced-colors` and
  `prefers-reduced-motion` handling.
- UI copy and Story names are Japanese. Code, comments, and identifiers are English.
- Default to no comments; add one only when the "why" is not obvious.

## Styling with Panda CSS

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

### Tokens

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

## Storybook

- `title: 'Components/<日本語名>'`, `tags: ['autodocs']`, and a `Playground` story first.
- Cover every variant, size, and state (disabled, error, …) with stories. Story `name` is
  Japanese.
- Layout helpers in stories use `css()` too (Panda scans `*.stories.tsx`).
- Stateful demos keep their state inside the story's `render` function.

## Testing

Tests run in a real browser. Use `render` from `vitest-browser-react` and locators
(`screen.getByRole(...)`), `await expect.element(...)`, and `userEvent` from `vitest/browser`.

- Test behavior and accessibility: roles, names, keyboard interaction, state changes, disabled
  handling, callbacks.
- Styles are real, so assert computed styles only for design-critical values (key color, size).
- Do not assert on generated class names.
- Tests share one real pointer. `vitest.setup.ts` parks it on a fixed marker in the bottom-left
  corner before each test so elements do not start in their `:hover` state.

## Before declaring work complete

`pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` must pass.
