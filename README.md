# jocmp.com

[EmDash](https://github.com/emdash-cms/emdash) on Cloudflare Workers, D1, and R2. Built from the `cloudflare:blog` template.

## Local

```sh
make dev
```

Runs at http://localhost:4321 with local D1 and R2 under `.wrangler/state`. Nothing touches Cloudflare. Admin is at `/_emdash/admin`.

Import the Micro.blog archive (needs `ffmpeg` for the HLS videos):

```sh
npm run import:microblog -- ~/Desktop/jocmp_d15497.bar
```

Re-running skips posts whose slug already exists. To start over, stop the server with `npx astro dev stop` and delete `.wrangler/state`.

## Remote

First deploy. When `wrangler secret put` prompts, paste the `EMDASH_ENCRYPTION_KEY` value from `.env`.

```sh
npx wrangler login
npx wrangler secret put EMDASH_ENCRYPTION_KEY
make deploy
```

`make deploy` bakes `SITE_URL` (default `https://jocmp-website.jocmp64.workers.dev`) into the build as EmDash's `siteUrl`. Override it once the domain moves, e.g. `make deploy SITE_URL=https://jocmp.com`.

The first deploy creates the `jocmp-website` D1 database and `jocmp-website-media` R2 bucket. Sandboxed plugins (`worker_loaders` in `wrangler.jsonc`) need the Workers Paid plan.

Finish setup at `https://<worker-url>/_emdash/admin/setup` with sample content unchecked, then copy the local content up once:

```sh
npx emdash site export --output site.emdash
npx emdash login --url https://<worker-url>
npx emdash site import site.emdash --url https://<worker-url> --analyze
npx emdash site import site.emdash --url https://<worker-url> --plan <digest> --confirm
```

`site import` only works on an empty site, so it is a one-time copy. After that, write posts on the remote admin, and use `make deploy` to push code changes tested locally.

## Site setup

`scripts/configure-site.mjs` sets the site title, creates the `home` page (text plus `scripts/sketchy.webp` as its `featured_image`), and removes the template's About page and menu item. It targets localhost by default:

```sh
node scripts/configure-site.mjs
EMDASH_URL=https://<worker-url> EMDASH_TOKEN=<token> node scripts/configure-site.mjs
```

## URLs

Routes follow the Micro.blog site:

| Page | Route |
|---|---|
| Post | `/YYYY/MM/DD/slug/`, dated in America/Chicago |
| Home | `/`, the `home` page |
| Page | `/slug/` |
| Tag | `/categories/slug/` |
| All posts | `/archive/` |
| Feed | `/feed.xml` |

EmDash builds its own post URLs (admin "view" links) with UTC dates, so the post route redirects any other date to the Chicago one. `src/pages/sitemap-posts.xml.ts` replaces EmDash's posts sitemap for the same reason.

## Micro.blog import notes

- Posts keep their Micro.blog slug, publish date, and tags.
- `<video>` tags become a `video` block rendered by `src/components/Video.astro`.
- HLS videos on `cdn.uploads.micro.mov` are remuxed to MP4 with `ffmpeg`.
