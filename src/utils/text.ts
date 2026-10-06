import type { PortableTextBlock } from "emdash";

const SUMMARY_WORDS = 70;
const WHITESPACE_REGEX = /\s+/;

type PortableTextSpan = {
	_type: string;
	text?: string;
};

type PortableTextTextBlock = PortableTextBlock & {
	_type: "block";
	children: PortableTextSpan[];
};

function isTextBlock(block: PortableTextBlock): block is PortableTextTextBlock {
	return block._type === "block" && Array.isArray(block.children);
}

export function extractText(blocks: PortableTextBlock[] | undefined): string {
	if (!blocks || !Array.isArray(blocks)) return "";

	return blocks
		.filter(isTextBlock)
		.map((block) =>
			block.children
				.filter((child) => child._type === "span" && typeof child.text === "string")
				.map((span) => span.text)
				.join(""),
		)
		.join(" ");
}

export function summarize(
	blocks: PortableTextBlock[] | undefined,
	wordCount = SUMMARY_WORDS,
): string {
	const words = extractText(blocks).split(WHITESPACE_REGEX).filter(Boolean);
	if (words.length <= wordCount) {
		return words.join(" ");
	}
	return `${words.slice(0, wordCount).join(" ")}…`;
}
