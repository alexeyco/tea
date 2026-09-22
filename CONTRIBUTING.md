# Contributing

## Branching

- Never push to `master`.
- Branch from `master`: `git checkout -b feat/<topic>`.
- Commit messages: no conventional prefixes (`feat:`, `fix:`, …), past tense —
  e.g. `Added tea skill`, `Fixed setup section`.

## Development

Edit `skills/tea/SKILL.md` — it is shared by both agents. pi picks it up on
the next session or `/reload`; OpenCode loads it through the plugin wrapper
(`opencode/index.ts`), which targets OpenCode v2 (`@opencode/plugin`).

Test locally without publishing (local installs are not copied, edits are live):

```sh
pi install /absolute/path/to/tea           # pi
opencode plugin add /absolute/path/to/tea  # OpenCode
```

Format with `make fmt` (prettier). Run the checks before committing — same as
CI. `make check` installs dependencies (pinned by the committed
`package-lock.json`), runs the sanity checks (`scripts/check.mjs`) and
typechecks the plugin (`npm run typecheck`, `tsc --noEmit` against
`tsconfig.json`):

```sh
make check
```

Regenerate `docs/gallery/terminal.png` after editing `terminal.svg` (the
README and `pi.image` point at the PNG):

```sh
sips -s format png docs/gallery/terminal.svg --out docs/gallery/terminal.png
```

Fallback if `sips` cannot convert the SVG:
`qlmanage -t -s 1600 docs/gallery/terminal.svg`, then rename the output to
`terminal.png`.

## Publishing

1. Add a `CHANGELOG.md` entry for the new version.
2. Bump `version` in `package.json` (semver) and refresh the committed
   `package-lock.json` with `npm install`.
3. Merge the PR to `master`.
4. Tag and push the tag:

   ```sh
   git tag vX.Y.Z && git push origin vX.Y.Z
   ```

5. The `publish` workflow (.github/workflows/publish.yml) runs `npm publish` on tag push.
   Requires the `NPM_TOKEN` secret in the repo settings.

Install for users:

```sh
pi install npm:@alexeyco/tea        # pi
opencode plugin add @alexeyco/tea   # OpenCode
```
