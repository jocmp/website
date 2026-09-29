import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { htmlToPortableText } from "@emdash-cms/gutenberg-to-portable-text";
import { EmDashClient } from "emdash/client";

const UPLOAD_HOSTS = ["https://jocmp.com/uploads/", "https://cdn.uploads.micro.blog/238475/", "uploads/"];
const EMBEDDED_TAG = /<video\b[^>]*>(?:\s*<\/video>)?|<pre\b[^>]*>[\s\S]*?<\/pre>/g;
const EMBED_MARKER = /^emdash-embed-(\d+)$/;
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#34": '"', "#39": "'" };

function extractArchive(archivePath) {
	if (statSync(archivePath).isDirectory()) {
		return archivePath;
	}
	const dir = mkdtempSync(join(tmpdir(), "microblog-"));
	execFileSync("unzip", ["-q", archivePath, "-d", dir]);
	return dir;
}

function createClient() {
	const baseUrl = process.env.EMDASH_URL ?? "http://localhost:4321";
	const token = process.env.EMDASH_TOKEN;
	return new EmDashClient({ baseUrl, token, devBypass: !token });
}

function attribute(tag, name) {
	return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function slugify(label) {
	return label
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function mediaReference(item) {
	return { _type: "reference", _ref: item.id, url: item.url };
}

function decodeEntities(text) {
	return text.replace(/&(#?\w+);/g, (entity, name) => ENTITIES[name] ?? entity);
}

function blockText(block) {
	return (block.children ?? []).map((child) => child.text ?? "").join("");
}

class MediaLibrary {
	constructor(client, archiveDir) {
		this.client = client;
		this.archiveDir = archiveDir;
		this.uploaded = new Map();
	}

	async localPath(url) {
		if (url.endsWith(".m3u8")) {
			return this.downloadStream(url);
		}
		const host = UPLOAD_HOSTS.find((prefix) => url.startsWith(prefix)) ?? "";
		const path = join(this.archiveDir, "uploads", url.slice(host.length));
		if (!existsSync(path)) {
			await this.downloadFile(url, path);
		}
		return path;
	}

	async downloadFile(url, path) {
		console.log(`  downloading ${url}`);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Missing upload ${url}: HTTP ${response.status}`);
		}
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, Buffer.from(await response.arrayBuffer()));
	}

	downloadStream(url) {
		const dir = join(this.archiveDir, "streams");
		mkdirSync(dir, { recursive: true });
		const name = basename(url.slice(0, url.lastIndexOf("/")));
		const output = join(dir, `${name}.mp4`);
		if (!existsSync(output)) {
			console.log(`  downloading ${url}`);
			execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", url, "-c", "copy", "-bsf:a", "aac_adtstoasc", output]);
		}
		return output;
	}

	async upload(url, alt) {
		const path = await this.localPath(url);
		if (!this.uploaded.has(path)) {
			const item = await this.client.mediaUpload(readFileSync(path), basename(path), { alt });
			console.log(`  uploaded ${basename(path)}`);
			this.uploaded.set(path, item);
		}
		return this.uploaded.get(path);
	}
}

async function convertImage(block, media) {
	const item = await media.upload(block.asset.url, block.alt);
	return {
		...block,
		asset: mediaReference(item),
		width: item.width ?? block.width,
		height: item.height ?? block.height,
		blurhash: item.blurhash ?? undefined,
		dominantColor: item.dominantColor ?? undefined,
	};
}

async function convertVideo(block, tag, media) {
	const video = await media.upload(attribute(tag, "src"));
	const posterUrl = attribute(tag, "poster");
	const converted = { _type: "video", _key: block._key, asset: mediaReference(video) };
	if (posterUrl) {
		converted.poster = mediaReference(await media.upload(posterUrl));
	}
	return converted;
}

function convertCode(block, tag) {
	const language = tag.match(/class="language-([\w-]+)"/)?.[1];
	const code = decodeEntities(tag.replace(/<[^>]+>/g, "")).replace(/\n$/, "");
	return { _type: "code", _key: block._key, language, code };
}

async function convertEmbed(block, tag, media) {
	if (tag.startsWith("<pre")) {
		return convertCode(block, tag);
	}
	return convertVideo(block, tag, media);
}

async function convertContent(html, media) {
	const embeds = [];
	const marked = html.replace(EMBEDDED_TAG, (tag) => {
		embeds.push(tag);
		return `<p>emdash-embed-${embeds.length - 1}</p>`;
	});
	const converted = [];
	for (const block of htmlToPortableText(marked)) {
		const embedIndex = blockText(block).trim().match(EMBED_MARKER)?.[1];
		if (block._type === "image") {
			converted.push(await convertImage(block, media));
		} else if (embedIndex !== undefined) {
			converted.push(await convertEmbed(block, embeds[Number(embedIndex)], media));
		} else {
			converted.push(block);
		}
	}
	return converted;
}

async function ensureTags(client, items) {
	const labels = [...new Set(items.flatMap((item) => item.tags ?? []))];
	const existing = new Set((await client.terms("tag")).items.map((term) => term.slug));
	const missing = labels.filter((label) => !existing.has(slugify(label)));
	await Promise.all(missing.map((label) => client.createTerm("tag", { slug: slugify(label), label })));
}

async function existingSlugs(client) {
	const { items } = await client.list("posts", { limit: 100 });
	return new Set(items.map((item) => item.slug));
}

async function importPost(client, media, item) {
	const slug = basename(new URL(item.url).pathname);
	const content = await convertContent(item.content_html, media);
	const post = await client.create("posts", {
		slug,
		data: { title: item.title.trim(), content },
		taxonomies: { tag: (item.tags ?? []).map(slugify) },
		createdAt: item.date_published,
	});
	await client.request("POST", `/content/posts/${post.id}/publish`, { publishedAt: item.date_published });
}

async function main() {
	const archivePath = process.argv[2];
	if (!archivePath) {
		console.error("Usage: node scripts/import-microblog.mjs <archive.bar | extracted-dir>");
		process.exit(1);
	}
	const archiveDir = extractArchive(archivePath);
	const feed = JSON.parse(readFileSync(join(archiveDir, "feed.json"), "utf8"));
	const client = createClient();
	const media = new MediaLibrary(client, archiveDir);

	await ensureTags(client, feed.items);
	const imported = await existingSlugs(client);
	const pending = feed.items.filter((item) => !imported.has(basename(new URL(item.url).pathname)));
	console.log(`${pending.length} of ${feed.items.length} posts to import`);

	for (const item of pending) {
		console.log(item.title.trim());
		await importPost(client, media, item);
	}
}

await main();
