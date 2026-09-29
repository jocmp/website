const TIME_ZONE = "America/Chicago";

export function formatLongDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		timeZone: TIME_ZONE,
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatShortDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		timeZone: TIME_ZONE,
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export function formatIsoDate(date: Date): string {
	return date.toLocaleDateString("en-CA", {
		timeZone: TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}
