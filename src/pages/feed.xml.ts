import type { APIRoute } from "astro";
import { getEmDashCollection, getSiteSettings } from "emdash";

import { renderFeedHtml } from "../utils/feed-html";
import { postPermalink } from "../utils/permalink";
import { resolveBlogSiteIdentity } from "../utils/site-identity";
import { summarize } from "../utils/text";

export const GET: APIRoute = async ({ site, url }) => {
	const siteUrl = site ?? new URL(url.origin);
	const { siteTitle, siteTagline } = resolveBlogSiteIdentity(await getSiteSettings());

	const { entries: posts } = await getEmDashCollection("posts", {
		orderBy: { published_at: "desc" },
		limit: 25,
	});

	const items = posts
		.map((post) => {
			if (!post.data.publishedAt) return null;
			const pubDate = post.data.publishedAt.toUTCString();

			const postUrl = new URL(postPermalink(post.id, post.data.publishedAt), siteUrl).href;
			const title = escapeXml(post.data.title || "Untitled");
			const description = escapeXml(post.data.excerpt || summarize(post.data.content));
			const content = wrapCdata(renderFeedHtml(post.data.content, siteUrl));

			return `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <content:encoded>${content}</content:encoded>
    </item>`;
		})
		.filter(Boolean)
		.join("\n");

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteTagline)}</description>
	<link>${siteUrl.href}</link>
	<atom:link href="${new URL("/feed.xml", siteUrl).href}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};

const XML_ESCAPE_PATTERNS = [
	[/&/g, "&amp;"],
	[/</g, "&lt;"],
	[/>/g, "&gt;"],
	[/"/g, "&quot;"],
	[/'/g, "&apos;"],
] as const;

function escapeXml(str: string): string {
	let result = str;
	for (const [pattern, replacement] of XML_ESCAPE_PATTERNS) {
		result = result.replace(pattern, replacement);
	}
	return result;
}

function wrapCdata(str: string): string {
	return `<![CDATA[${str.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}
