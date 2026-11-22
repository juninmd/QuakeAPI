# AGENTS.md

QuakeAPI: Express API that reads a Quake server log (`games.log`) and returns each match as JSON (kills, players, totals). Example routes: `GET /api/v1/games` and `GET /api/v1/games/:id`.

## Stack

- Node.js, Express, morgan (request logs)
- Tests: mocha, should, supertest
- Package manager: pnpm (`pnpm-lock.yaml`); README also documents npm

## Commands

```bash
pnpm install            # or npm install
node app.js             # start the API (PORT defaults to 4500)
pnpm test               # mocha ./test/index.js ./test/cache.js
```

## Structure

- `app.js` - Express app and server start
- `controller/quakeController.js` - HTTP handlers
- `service/logReaderService.js` - reads and splits log files
- `service/logParserService.js` - parses log lines into matches
- `service/quakeService.js` - builds match results
- `cors.js` - CORS headers; `webconfig.js` - URL, port and version read from env vars
- `games.log`, `light.log` - sample log input; `test/*.log` - fixtures used by `test/index.js`
- `.github/workflows/` - `validate.yml`, `security.yml`, `sast.yml` (reusable from `juninmd/base-actions`), `release-drafter.yml`

## Conventions

- Each file stays under 180 lines (repo rule from the previous AGENTS.md).
- All code changes go through code review before merge (repo rule from the previous AGENTS.md).
- Target at least 80% unit test coverage (previous AGENTS.md). Tests use mocha, not pytest.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.

## Gotchas

- The log path is `./games.log`, relative to the directory where the process starts. Run `node app.js` from the repo root.
- Env vars (names only): `PORT`, `URL`, `VERSION`. Defaults are in `README.md`.
- `pnpm-lock.yaml` is the tracked lockfile. README also shows `npm install`, which creates `package-lock.json`; do not commit it.
