export const author = {
	name: "Josiah Campbell",
	avatarPath: "/avatar.jpg",
	fediverseHandle: "@_jocmp@mastodon.social",
	profiles: ["https://github.com/jocmp", "https://mastodon.social/@_jocmp"],
};

export function authorJsonLd(origin: string) {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: author.name,
		url: new URL("/", origin).href,
		image: new URL(author.avatarPath, origin).href,
		sameAs: author.profiles,
	};
}
