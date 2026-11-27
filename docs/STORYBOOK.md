# Storybook

- `title: 'Components/<日本語名>'`, `tags: ['autodocs']`, and a `Playground` story first.
- Cover every variant, size, and state (disabled, error, …) with stories. Story `name` is
  Japanese.
- Layout helpers in stories use `css()` too (Panda scans `*.stories.tsx`).
- Stateful demos keep their state inside the story's `render` function.
