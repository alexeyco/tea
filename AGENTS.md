# @alexeyco/tea

Universal Forgejo/Gitea skill for coding agents (pi and OpenCode), published
as an npm package. Human-facing docs: [README.md](README.md),
[CONTRIBUTING.md](CONTRIBUTING.md).

## Layout

- `skills/tea/SKILL.md` — the skill, shared by both agents; pi loads it via
  the `pi.skills` manifest, OpenCode via the plugin wrapper.
- `opencode/index.ts` — OpenCode plugin wrapper targeting v2
  (`@opencode/plugin`); registers the skill with `ctx.skill.transform` +
  `ctx.skill.reload()`, building the entry with `Skill.Info.make` (v2 schema
  types are branded; `path` was `location` in v1).
- `package.json` — npm metadata + pi manifest + OpenCode `exports`; keep the
  `pi-package` keyword (pi gallery discoverability) and the `opencode`
  keywords.
- `scripts/check.mjs` — sanity checks behind `make check`; same checks run
  in CI.
- `tsconfig.json` — strict config for `npm run typecheck` (`tsc --noEmit`),
  run by `make check` and CI; covers `opencode/`.
- `docs/gallery/` — preview assets; `terminal.png` is referenced by
  `pi.image` and the README.

## Conventions

- Docs and comments in English.
- `SKILL.md` must stay instance-agnostic: no hard-coded hostnames or URLs.
- OpenCode v1 (`@opencode-ai/plugin`) is dropped; `check.mjs` fails on any
  `@opencode-ai` reference.
- `SKILL.md` description (frontmatter) is what the agents show — keep it short.
- Never push `master`; work on feature branches, merge via PR.

## Release

Tag-driven npm publish — see [CONTRIBUTING.md](CONTRIBUTING.md#publishing) and `.github/workflows/publish.yml`.
