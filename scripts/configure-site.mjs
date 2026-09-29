import { readFileSync } from "node:fs";
import { EmDashClient } from "emdash/client";

const HOME_SLUG = "home";
const PHOTO_PATH = new URL("./sketchy.webp", import.meta.url);

const HOME_CONTENT = `I build software that puts stories, facts, and art in front of people like you.

I live in the midwest and work as a software engineer. In my spare time I [enjoy tinkering](https://github.com/jocmp) with mobile apps of various shapes and sizes.

Give me a shout [on Mastodon](https://mastodon.social/@_jocmp) or email me at [hello@jocmp.com](mailto:hello@jocmp.com).`;

function createClient() {
	const baseUrl = process.env.EMDASH_URL ?? "http://localhost:4321";
	const token = process.env.EMDASH_TOKEN;
	return new EmDashClient({ baseUrl, token, devBypass: !token });
}

async function ensureFeaturedImageField(client) {
	const pages = await client.collection("pages");
	if (pages.fields.some((field) => field.slug === "featured_image")) {
		return;
	}
	await client.createField("pages", { slug: "featured_image", type: "image", label: "Featured Image" });
	console.log("added pages.featured_image");
}

async function uploadPhoto(client) {
	const item = await client.mediaUpload(readFileSync(PHOTO_PATH), "sketchy.webp", { alt: "" });
	return {
		provider: "local",
		id: item.id,
		width: item.width,
		height: item.height,
		mimeType: item.mimeType,
		filename: item.filename,
		meta: { storageKey: item.storageKey },
	};
}

async function findPage(client, slug) {
	const { items } = await client.list("pages", { limit: 100 });
	return items.find((item) => item.slug === slug);
}

async function upsertHome(client) {
	const existing = await findPage(client, HOME_SLUG);
	const photo = existing?.data.featured_image ?? (await uploadPhoto(client));
	const data = { title: "Home", content: HOME_CONTENT, featured_image: photo };
	if (existing) {
		await client.update("pages", existing.id, { data });
		await client.publish("pages", existing.id);
		console.log("updated home page");
		return;
	}
	await client.create("pages", { slug: HOME_SLUG, data });
	const created = await findPage(client, HOME_SLUG);
	await client.publish("pages", created.id);
	console.log("created home page");
}

async function removeAbout(client) {
	const about = await findPage(client, "about");
	if (about) {
		await client.delete("pages", about.id);
		console.log("deleted about page");
	}
	const menu = await client.menu("primary");
	const aboutItems = menu.items.filter((item) => item.label === "About");
	await Promise.all(
		aboutItems.map((item) => client.request("DELETE", `/menus/primary/items/${item.id}`)),
	);
	if (aboutItems.length > 0) {
		console.log("removed About from primary menu");
	}
}

async function setSiteIdentity(client) {
	await client.request("POST", "/settings", { title: "Josiah Campbell", tagline: "" });
	console.log("set site title");
}

const client = createClient();
await setSiteIdentity(client);
await ensureFeaturedImageField(client);
await upsertHome(client);
await removeAbout(client);
