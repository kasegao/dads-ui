# Component design

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
