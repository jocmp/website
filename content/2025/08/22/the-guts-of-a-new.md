---
title: The Guts of a New Machine
summary: A potential future for Capy, ruminations on Android RSS readers.
date: 2025-08-22 15:18:34.000000000 -06:00
lastmod: 2026-01-16 23:59:05.000000000 -06:00
type: post
categories:
- capyreader
- rss
url: "/2025/08/22/the-guts-of-a-new/"
guid: http://jocmp.micro.blog/2025/08/22/the-guts-of-a-new/
---
ReadYou just released [v0.15.0](https://github.com/ReadYouApp/ReadYou/releases/tag/0.15.0) this past week. I've been waiting to see their take on one very specific feature: large screen support. I tried it out. It's great! There's a subtle animation for article filters in the list column. There's also an expand/collapse option to view the article in full screen. This is a new paradigm that Google has been pushing in Keep and Gmail. In the face of these improvements, I've been thinking to myself, why did I build Capy Reader when ReadYou has such an advanced UI?

In retrospect, I set out to build Capy Reader for two reasons: exploration and compatibility. I wanted to explore how RSS readers worked under the hood, how they looked up feeds, and why they made the trade-offs they made. [NetNewsWire's technotes](https://github.com/Ranchero-Software/NetNewsWire/tree/main/Technotes) were a major help here since they delve into sync strategies and software architecture. Needless to say, there's no shortage of information. 

I built Capy Reader for compatibility [with Feedbin](https://feedbin.com/) too. There are plenty of readers available that work with Feedbin, sure, but none of them are exactly a pleasant experience. So when I built Capy, I built it for that. From there, I thought I could skirt around the need for Feedbin sign-in credentials in Google Play's review process by building out Local accounts. That wasn't the case. Before I knew it, I was supporting Local accounts, Feedbin, and Google Reader (both Miniflux and FreshRSS). This was a far cry from the original, simple vision of Capy as a Feedbin-only client.

This brings me back to ReadYou's latest improvements. I'm now considering forking ReadYou and using it as the basis of Capy Reader going forward. There are a few goals I have in mind that would make this unique:

- Feed discovery. Plugging in Capy Reader's existing feed finder to avoid having to search for exact feed URLs to add a feed.
- Feedbin and Miniflux support. These are components I can port from Capy's existing codebase.
- Inclusion in Google Play. In contrast, ReadYou is only available in F-Droid.

There are two more considerations I want to highlight if I go this route. Capy Reader would be relicensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html), and I'd also want to build any revisions in a way that could be upstreamed to ReadYou.

All of this is preliminary. These are untested ruminations, and talk is easy. If you have any reasons why you use ReadYou over Capy, or Capy over ReadYou, drop me a line [on Mastodon](https://mastodon.social/@_jocmp)!
