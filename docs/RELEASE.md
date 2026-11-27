# CI and release

## CI

`.github/workflows/ci.yml` runs lint, typecheck and tests on pull requests that are not drafts.
After adding a workflow or changing a `uses:`, run `gh actions-lock` and commit
`.github/workflows/actions.lock`.

`.github/dependabot.yml` opens weekly update pull requests for npm packages and GitHub Actions.
Packages that are released together (Storybook, Panda CSS, Vitest, React) are grouped into one
pull request each. Dependabot updates `actions.lock` itself when it bumps an action.

## Release

The package is published to npm as `@kasegao/dads-ui`. Bump `version` in `package.json`, merge to
`main`, then push a tag `vX.Y.Z` that matches it. `.github/workflows/publish.yml` runs lint,
typecheck, tests and the build, then publishes with npm trusted publishing (OIDC); no npm token is
stored in the repository.
