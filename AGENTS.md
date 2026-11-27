# AGENTS.md

Entry point for AI coding agents (and humans) working on this repo. This file is a map: it holds
what every task needs and points to the document that owns each topic. Read the linked document
before working in its area.

## Project overview

A React + Panda CSS + Storybook implementation of the Digital Agency Design System (DADS) v2.
Design and behavior follow the official references:

- Guidelines: https://design.digital.go.jp/dads/
- React reference (Tailwind): https://github.com/digital-go-jp/design-system-example-components-react
- HTML reference: https://github.com/digital-go-jp/design-system-example-components-html

No Tailwind. Styles are written with Panda CSS; complex widgets use Ark UI.

## Where to look

| Topic                                                                   | Document                                   |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| Tech stack, file layout, what the build produces                        | [ARCHITECTURE.md](./ARCHITECTURE.md)       |
| Component API, composition, accessibility, language of UI copy and code | [docs/COMPONENTS.md](./docs/COMPONENTS.md) |
| Panda CSS rules, conditions, tokens                                     | [docs/STYLING.md](./docs/STYLING.md)       |
| Stories                                                                 | [docs/STORYBOOK.md](./docs/STORYBOOK.md)   |
| Tests                                                                   | [docs/TESTING.md](./docs/TESTING.md)       |
| CI, Dependabot, `actions.lock`, publishing to npm                       | [docs/RELEASE.md](./docs/RELEASE.md)       |

`src/components/Button/` is the reference for style and structure. Read all of its files before
writing or changing a component.

## Commands

- `pnpm storybook` — Storybook on :6006
- `pnpm test` — Vitest (browser mode)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` / `pnpm lint:fix` — Biome
- `pnpm build` — library build (`dist/index.js`, `dist/styles.css`, `dist/types`); `dist/styles.css` is
  generated with `panda.build.config.ts`, which scans component sources only
- `pnpm panda codegen` — regenerate `styled-system/` after changing `panda.config.ts` or `src/preset/`

## Keeping the documents current

The documents above are the source of truth for the rules of this repo.

- When a change alters a rule or a fact they describe, update the document in the same pull
  request.
- Each topic lives in one document. Link to it instead of repeating it.
- Keep this file short. A new rule goes into the document that owns its topic; a new document
  gets a row in the table above.

## Before declaring work complete

`pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` must pass.
