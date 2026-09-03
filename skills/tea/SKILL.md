---
name: tea
description: Work with Forgejo and Gitea instances via the tea CLI. Use for browsing repos, issues, pulls, releases, branches, comments and notifications, cloning, or querying state. Read-only by default.
---

# tea (Forgejo / Gitea CLI)

## Rules

- Read-only by default. Anything that creates, edits, deletes, merges, or
  changes repo state (issues/PRs, comments, releases, labels, milestones,
  webhooks, admin, `pulls checkout/clean`) requires an explicit "yes" from the
  user for that exact command — propose it in full, then wait.
- Never ask for or echo access tokens; `tea login add` is run by the user.
- If the repo, item, or action is ambiguous, ask before running anything.

## Setup

1. `command -v tea` — if missing, tell the user to install it and stop.
2. `tea logins list` must show a login for the target instance. If missing,
   the user runs `tea login add` (URL + token; token is created in the web
   UI: Settings → Applications → Access Token).
3. `tea whoami` must succeed.

## Usage

- Target repos explicitly: `-r <owner>/<repo>`; add `-l <login>` only if
  several logins exist.
- Cap long lists with `--limit`; filter with `--state` (`all|open|closed`),
  `--keyword`, `--labels`, `--author`, `--assignee`.
- Lists are capped by a small default `--limit`; raise it when needed. For
  deep paging use the raw API with query params:
  `tea api 'repos/<owner>/<repo>/issues?limit=50&page=2'`.
- When list output is not enough, use the raw authenticated API:
  `tea api <path>`.

## Errors

- `command not found` — tell the user to install `tea` and stop.
- 401 / 403 — the token lacks scopes or has expired. The user fixes it on
  their side (regenerate the token in the web UI, `tea login add` again).
  Never request or echo the token.
- 404 — wrong `<owner>/<repo>` spelling, or the login has no access.
  Verify: `tea repos ls <owner>/<repo>`.
- Tea used the wrong instance (several logins) — add `-l <login>`; list
  them with `tea logins list`.
- Connection errors — wrong instance URL in the login config; the user
  fixes the login.

## Commands

```sh
tea whoami                                  # current user
tea repos ls                                # own repos
tea repos search <query>                    # find repos on the instance
tea repos ls <owner>/<repo>                 # repo details
tea clone <owner>/<repo> [dir]              # clone

tea issues ls -r <owner>/<repo>             # open issues
tea issues <index> -r <owner>/<repo>        # issue details
tea issues ls --state closed -r <o>/<r>     # closed issues
tea pulls ls -r <owner>/<repo>              # open PRs
tea pulls <index> -r <owner>/<repo>         # PR details
tea comments ls <issue-index> -r <o>/<r>    # comments on issue/PR
tea releases ls -r <owner>/<repo>
tea branches ls -r <owner>/<repo>           # or `tea branches <name> -r ...`
tea notifications ls                        # notifications
tea labels ls -r <owner>/<repo>             # labels
tea milestones ls -r <owner>/<repo>         # milestones
tea times ls -r <owner>/<repo>              # tracked times
tea organizations ls                        # organizations
tea open -r <owner>/<repo>                  # open in browser
tea api repos/<owner>/<repo>/issues         # raw API, authenticated
```
