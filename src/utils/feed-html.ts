import { toHTML } from "@portabletext/to-html";
import type { PortableTextBlock } from "emdash";

const HTML_ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

function escapeCharacters(str: string): string {
	return str.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

interface MediaReference {
	url?: string;
}

interface ImageBlock {
	asset?: MediaReference;
	alt?: string;
	width?: number;
	height?: number;
}

interface VideoBlock {
	asset?: MediaReference;
	poster?: MediaReference;
}

interface CodeBlock {
	code?: string;
	language?: string;
}

function absoluteUrl(path: string | undefined, origin: URL): string {
	if (!path) {
		return "";
	}
	return escapeCharacters(new URL(path, origin).href);
}

function renderImage(value: ImageBlock, origin: URL): string {
	let dimensions = "";
	if (value.width && value.height) {
		dimensions = ` width="${value.width}" height="${value.height}"`;
	}
	const src = absoluteUrl(value.asset?.url, origin);
	return `<img src="${src}" alt="${escapeCharacters(value.alt ?? "")}"${dimensions} />`;
}

function renderVideo(value: VideoBlock, origin: URL): string {
	let poster = "";
	if (value.poster?.url) {
		poster = ` poster="${absoluteUrl(value.poster.url, origin)}"`;
	}
	return `<video controls preload="metadata" src="${absoluteUrl(value.asset?.url, origin)}"${poster}></video>`;
}

function renderCode(value: CodeBlock): string {
	let language = "";
	if (value.language) {
		language = ` class="language-${escapeCharacters(value.language)}"`;
	}
	return `<pre><code${language}>${escapeCharacters(value.code ?? "")}</code></pre>`;
}

export function renderFeedHtml(blocks: PortableTextBlock[] | undefined, origin: URL): string {
	return toHTML(blocks ?? [], {
		components: {
			types: {
				image: ({ value }) => renderImage(value, origin),
				video: ({ value }) => renderVideo(value, origin),
				code: ({ value }) => renderCode(value),
				break: () => "<hr />",
			},
		},
		onMissingComponent: false,
	});
}
