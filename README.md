# jocmp.com

[EmDash](https://github.com/emdash-cms/emdash) on Cloudflare Workers, D1, and R2.

Posts and pages live in the deployed site's database. Write them in the admin at `/_emdash/admin`. This repo holds the code.

## Local

```sh
make dev
```

Runs at http://localhost:4321 with local D1 and R2 under `.wrangler/state`, separate from the deployed site. To reset it, stop the server with `npx astro dev stop` and delete `.wrangler/state`.

To test against real content, copy the deployed site into a fresh local one:

```sh
npx emdash site export --url https://<worker-url> --output site.emdash
npx emdash site import site.emdash --analyze
npx emdash site import site.emdash --plan <digest> --confirm
```

## Deploy

```sh
make deploy
```

Pushes to `main` deploy automatically through `.github/workflows/deploy.yml`, which needs these repository secrets:

- `CLOUDFLARE_API_TOKEN`: a token from the "Edit Cloudflare Workers" template, plus D1 Edit
- `CLOUDFLARE_ACCOUNT_ID`: the account ID from the Workers dashboard

`make deploy` bakes `SITE_URL` into the build as EmDash's `siteUrl`. It defaults to `https://jocmp-website.jocmp64.workers.dev`. Change the default in the `Makefile` when the domain moves.

## URLs

Routes follow the old Micro.blog site:

| Page | Route |
|---|---|
| Home | `/`, the page with slug `home` |
| Post | `/YYYY/MM/DD/slug/`, dated in America/Chicago |
| Page | `/slug/` |
| Category | `/categories/slug/` |
| All posts | `/archive/` |
| Feed | `/feed.xml` |

EmDash dates its own post URLs (admin "view" links, the built-in sitemap) in UTC. The post route redirects any other date to the Chicago one, and `src/pages/sitemap-posts.xml.ts` replaces the built-in posts sitemap.
