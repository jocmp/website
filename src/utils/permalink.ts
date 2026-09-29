import { formatIsoDate } from "./dates";

export function postPermalink(slug: string, publishedAt: Date | null | undefined): string {
	if (!publishedAt) {
		return "/archive/";
	}
	const [year, month, day] = formatIsoDate(publishedAt).split("-");
	return `/${year}/${month}/${day}/${slug}/`;
}
