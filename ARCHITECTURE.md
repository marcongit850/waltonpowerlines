# Walton Power Lines: architecture

Last checked against the code and Cloudflare on Oct 8, 2026.

## What it does

A civic information site about phased undergrounding of overhead power lines in Walton County, FL, starting with a study of Scenic Highway 30A and Miramar Beach. A small Worker handles the contact form.

## Domains and Worker

- Worker: `waltonpowerlines`
- Custom domains (attached in the Cloudflare dashboard): `waltonpowerlines.com`, `www.waltonpowerlines.com`
- workers.dev host is enabled.

## Data and images

- Pages and images are static files in this repo.
- Bindings: `ASSETS` (static assets, directory `.`). No D1, R2, or KV.
- External services: Resend (contact mail), Google Analytics 4 tag on pages.

## Secrets and env vars (names only)

Secrets set: `RESEND_API_KEY`, `CONTACT_EMAIL`.

## Cron and scheduled jobs

None. The Worker has only a fetch handler and no cron trigger.

## How it deploys

- Cloudflare Workers Builds, auto deploy on merge to `main`. Repo `marcongit850/waltonpowerlines`, trigger `1e7296fc-3f24-4e41-8e51-94892618d7ea`, build command empty, deploy command `npx wrangler deploy`, root `/`.
- If a merge does not deploy: `POST /accounts/f1c59948520f1ec39473238b621c7e24/builds/triggers/1e7296fc-3f24-4e41-8e51-94892618d7ea/builds` with body `{"branch": "main", "commit_hash": "<full 40 character sha>"}`. Check builds with `GET /accounts/f1c59948520f1ec39473238b621c7e24/builds/workers/15990d23ce434780980ccfd8bfbed43d/builds?per_page=2` and match `commit_hash`.

## Known gotchas

- Keep the Worker name `waltonpowerlines`. Renaming it creates a new Worker and the Workers Builds project stops updating the site.
- Only `/api/contact` runs the Worker (`run_worker_first`). Every other path is a static asset.
- Contact mail is sent from Resend's onboarding sender (`Walton Power Lines <onboarding@resend.dev>`), hardcoded in the code. That sender only delivers to the email on the Resend account, so `CONTACT_EMAIL` must be that address until a domain is verified in Resend and the From line is changed.

## Standing rule

Any PR that changes architecture (new secret, cron, storage, binding, or deploy change) must update this file in the same PR.
