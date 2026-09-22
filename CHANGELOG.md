# Changelog

## 0.2.0

- OpenCode v2 support: the plugin wrapper moved from the beta
  `@opencode-ai/plugin` to stable `@opencode/plugin@^2.0.14`; skill entries
  are built with `Skill.Info.make` and applied via `ctx.skill.transform` +
  `ctx.skill.reload()`.
- Breaking: OpenCode v1 support dropped — install with
  `opencode plugin add @alexeyco/tea` or the v2 `plugins` key in
  `opencode.json`.
- Skill entry field `location` renamed to `path` (v2 `Skill.Info`).
- The plugin is typechecked: added `tsconfig.json` and `npm run typecheck`
  (`tsc --noEmit`), wired into `make check` and CI (Node 22).
- Committed `package-lock.json`; `make check` now installs dependencies
  before running the checks.

## 0.1.0

- Initial release: universal `tea` skill — repos, issues, pulls, releases,
  branches, comments, notifications, labels, milestones, tracked times.
- Dual delivery: pi package (`pi.skills`) and OpenCode plugin wrapper
  (`opencode/index.ts`).
- Gallery preview (`docs/gallery/terminal.png`), wired via `pi.image`.
- Repo checks (`make check` via `scripts/check.mjs`) and CI
  (`.github/workflows/ci.yml`).
