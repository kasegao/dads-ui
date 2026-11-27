# Architecture

A map of the codebase: what it is built with, where things live, and what the build produces.
Rules for writing code are in [AGENTS.md](./AGENTS.md) and [docs/](./docs/).

## Tech stack

- React 19, TypeScript 7, Vite 8
- Panda CSS 2 (`@pandacss/dev`, `@pandacss/vite`) with the DADS preset in `src/preset/`
- Ark UI (`@ark-ui/react`) for widgets with non-trivial behavior
- Storybook 10 (`@storybook/react-vite`)
- Vitest 5 in Browser Mode (Playwright + Chromium) with `vitest-browser-react`
- Biome, pnpm

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

## Distribution

`pnpm build` produces two ways to consume the library:

- Without Panda: `@kasegao/dads-ui/styles.css` (every component's styles) plus the components.
- With Panda: `panda lib` writes `dist/panda/` (manifest, preset, build info) and regenerates the
  `./css`, `./patterns`, `./jsx`, `./tokens`, `./helpers`, `./types`, and `./panda/*` entries of
  `package.json` `exports`. Apps set `designSystem: '@kasegao/dads-ui'`. Do not edit those
  entries by hand; only `.`, `./preset`, and `./styles.css` are hand-written. `styled-system/` is
  published because the generated entries point at it.
