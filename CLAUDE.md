# EFS Tools — project context

Static site of tools & calculators for **Egg Farm Simulator (EFS)**. Vanilla
HTML/CSS/JS — **no framework, no bundler, no npm build step**. Just files served
as-is.

## Deployment topology (important)

Two hosts serve this repo, from **different branches** on purpose:

| Host | URL | Branch | Behavior |
| --- | --- | --- | --- |
| **Vercel** (primary) | `efstools.vercel.app` (alias `efs-optimizer.vercel.app`) | `main` | Auto-deploys on every push to `main`. This is the live site. |
| **GitHub Pages** (legacy) | `goel7.github.io/efs-optimizer/` | `github-pages` | **Frozen.** Only changes if you explicitly push to the `github-pages` branch. |

- **Do all normal work on `main`.** Pushing to `main` updates Vercel only; GitHub
  Pages stays frozen.
- The `github-pages` branch is a deliberate snapshot kept behind. Eventually it will
  get a "site has moved → efstools.vercel.app" redirect. Don't touch it unless that's
  the intent.
- Vercel PRs get an auto preview deploy (`efstools-git-<branch>-...vercel.app`). Its
  URL is posted as a bot comment on the PR.

### Routing (`vercel.json`)

- `/` serves the home hub (`index.html`) — a card per tool. (There used to be a
  `/` → `/eastereggs` redirect while there was only one tool; it was removed when
  Chicken Health was added.)
- Each tool gets a clean URL via a **rewrite**, so the file path stays hidden:
  - `/eastereggs` → `/BE-Allocation/allocateBE.html`
  - `/health` → `/ChickenHealth/chickenHealth.html`
- Because of these rewrites, tool pages link their CSS/JS with **absolute** paths
  (`/BE-Allocation/...`, `/ChickenHealth/...`), not relative — keep them absolute or
  they 404 under the clean URL.

> **When adding a new tool:** give it its own folder, a clean-URL rewrite in
> `vercel.json`, and a card in `index.html` (copy an existing `.card` and give it its
> own `border-top-color` in `indexStyles.css`). Tool pages copy the BE Allocation look
> (gray nav with Home link, centered heading, bordered inputs, green Enter button).

## Git / remote

- Remote `origin` = `https://github.com/goel7/efs-optimizer.git` (repo was renamed
  from `efs`; old URLs redirect).
- Default branch: `main`. Conventional commits (`feat:`, `fix:`, `chore:`,
  `refactor:`).
- `.env.local` (Vercel OIDC token) is git-ignored — never commit it.

## Structure

Each page has its **own** stylesheet (no shared stylesheet — a `redesign/site-ui` PR
that introduced one was rejected and discarded).

- `index.html` — home hub: heading + one card per tool. Styled by `indexStyles.css`.
  Cards link to the clean URLs (`/eastereggs`, `/health`).
- `BE-Allocation/` — Black Egg Allocation calculator (`allocateBE.html` + `.js` +
  `allocateBE.css`). Computes optimal Easter Egg setup from a Black Egg total.
- `ChickenHealth/` — Chicken Health at Level (`chickenHealth.html` + `.js` + `.css`).
  Full HP of a non-boss chicken across all four wiki brackets (1–140, 141–500,
  501–200,000 product form, 200,001+). Computed in log10 space so levels whose HP
  exceeds ~1e308 still work; output uses the same `X.XXeN` format as BE Allocation.
  Level input accepts plain integers plus `k`/`M` suffixes and e-notation.
- `MaxLevel/` — an in-progress Max Level calc (`maxLevel.html` + `.js` + `.css`). Not
  linked from home yet; the JS bottom section is scratch/experimental.

## Calculator constraints (BE-Allocation)

- **Do not change the calculation logic** in `allocateBE.js` — outputs must stay
  identical. If restructuring markup, preserve every element ID, input, event binding,
  and the `#miscEggsHelp` / `#mainEggsHelp` help anchors.
- IDs the JS depends on: `totalBE`, `optMisc`, `waterLvl`, `EnterBtn`, `results`,
  `miscLevel`, `mainLevel`, `turtleLevel`, `GKLevel`, `miscEggsHelp`, `mainEggsHelp`.
- Inputs are `type="text"` on purpose — the parser accepts suffixed/scientific values
  like `5k`, `5B`, `5s`, `45e87`. Plain integers like `5000` (no suffix, no `e`) are
  **not** supported by design — leave this as-is.
