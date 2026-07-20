# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to version releases and generate changelogs.

## Adding a changeset

When your PR includes a user-facing change, run:

```sh
pnpm changeset
```

Commit the generated file under `.changeset/` with your PR.

## Releasing

On push to `main`, the Release workflow opens or updates a **Version Packages** PR. Merging that PR bumps the version, updates `CHANGELOG.md`, and creates a GitHub Release (this package is private, so nothing is published to npm).
