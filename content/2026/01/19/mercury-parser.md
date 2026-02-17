---
title: Mercury Parser 3.0.0
summary: What's changed with the latest version of the parser, and why
date: 2026-01-19 15:48:11.000000000 -06:00
lastmod: 2026-01-19 15:52:14.000000000 -06:00
type: post
categories:
- programming
- mercury parser
url: "/2026/01/19/mercury-parser/"
guid: http://jocmp.micro.blog/2026/01/19/mercury-parser/
---
In 2024 I forked [Postlight Parser](https://github.com/postlight/parser) to use in [Capy Reader](https://capyreader.com/) and returned the name to [Mercury Parser](https://github.com/jocmp/mercury-parser). I really, really wanted to use the upstream version of the parser to avoid maintaining something off to the side. But nearly two years on, I feel I made the right choice for the scope of the app.

That's why I'm happy to announce [Mercury Parser version 3.0](https://github.com/jocmp/mercury-parser/releases/tag/v3.0.0). My fork of this project follows romantic versioning, or [romver](https://github.com/romversioning/romver) meaning that version 3 represents a major overhaul to how the project is developed.

For starters, the app no longer uses jQuery. The previous version of the app used jQuery for the web-based version of the parser. This was completely removed by [upgrading Cheerio](https://github.com/jocmp/mercury-parser/pull/88) to the latest version. Cheerio is responsible for much of the parsing in Mercury Parser and follows a similar interface to jQuery, just without the jQuery.

Next, I replaced moment.js with [dayjs](https://github.com/iamkun/dayjs) for article date handling. This was another necessary shift since moment.js had been deprecated for several years. The shift was mostly one-to-one but there were a few trade-offs. Date patterns like `DD` are now replaced by `D` which was something lenient in moment.js. Date boundaries and timezone suffixes were also changed. This required manual code in the [date-published](https://github.com/jocmp/mercury-parser/blob/4e4ebcab3f4251512e746b4fe7b80a10b0da5dd8/src/cleaners/date-published.js#L22) cleaner.

I also migrated from Karma for web tests to [Vitest](https://vitest.dev/) with Playwright. For now this means that the fixtures are only tested in node due to the constraint of the node-only `fs` import. This is something I may revisit in future for broader test coverage. Lastly, I [migrated](https://github.com/jocmp/mercury-parser/pull/86) the project from yarn v1 to npm. There's safety in defaults, and npm has come along way with performance since Mercury Parser launched in 2016. 

All in all, these changes have been easy to manage because my fork of Mercury Parser is a hobby project. There's no stakeholders, no mission critical applications. That, and Claude Code Opus 4.5 is just leagues better than me at catching package conflicts. It's been a fun journey to continue to revitalize this project in my spare time and use it in Capy Reader.

---

If you use this fork and have feedback, let me know! If you use the full content extractor in Capy Reader and enjoy its benefits, consider sponsoring my efforts [on GitHub](https://github.com/sponsors/jocmp) or [Ko-fi](https://ko-fi.com/capyreader).
