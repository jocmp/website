const PERMALINK_DATE = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Chicago",
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
});

export function postPermalink(slug: string, publishedAt: Date | null | undefined): string {
	if (!publishedAt) {
		return "/archive/";
	}
	const [year, month, day] = PERMALINK_DATE.format(publishedAt).split("-");
	return `/${year}/${month}/${day}/${slug}/`;
}
