import type { APIRoute } from "astro";
import { getEmDashCollection } from "emdash";

import { postPermalink } from "../utils/permalink";

export const prerender = false;

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = site ?? new URL(url.origin);
	const { entries: posts } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 1000,
	});

	const urls = posts
		.filter((post) => post.data.publishedAt)
		.map((post) => {
			const loc = new URL(postPermalink(post.id, post.data.publishedAt), siteUrl).href;
			const lastmod = post.data.updatedAt ?? post.data.publishedAt;
			return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod.toISOString()}</lastmod>\n  </url>`;
		})
		.join("\n");

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
