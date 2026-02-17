---
title: 'Simple Unread Badges '
summary: A new unread badge option in Capy to reduce clutter and ease phantom obligations
date: 2026-02-08 17:25:39.000000000 -06:00
lastmod: 2026-02-08 23:53:01.000000000 -06:00
type: post
images:
- "/uploads/2026/badges-open-2x.png"
- "/uploads/2026/simple-badges.jpg"
url: "/2026/02/08/simple-unread-badges/"
guid: http://jocmp.micro.blog/2026/02/08/simple-unread-badges/
---
Nearly ten years ago, I switched from an iPhone to a Pixel 2 (though I'd used Nexus devices for years before this). This was right around the same time [Android Oreo](https://android-developers.googleblog.com/2017/08/introducing-android-8-oreo.html?m=1) was released with notification dots. Initially, I was annoyed by the lack of exact numbers, having grown used to the nagging red dots on iOS that told you exactly how many new notifications were associated with any given app. I even tried to work around this at first with different launchers, but eventually I came around to the idea of the simple badges. Either there were new notifications or not.

![Auto-generated description: A smartphone screen displays messaging notifications and various app icons on a pink background.](/uploads/2026/badges-open-2x.png)

Terry Godier recently articulated the notion of [phantom obligation](https://www.terrygodier.com/phantom-obligation) where a UI implies a debt of you where there is none. Most RSS readers, Capy Reader included, follow the three-paned UI layout popularized in part by NetNewsWire, with exact notification counts and all. It’s possible to rework this, but I believe Capy Reader still owes some familiarity to users who use sync services that follow this paradigm, such as Feedbin or FreshRSS. That said, there are tweaks around the edges that can reduce this phantom obligation.

That’s why I’ve added the option to use "Simple" unread badges in [Capy Reader 2026.02.1191](https://github.com/jocmp/capyreader/releases/tag/2026.02.1191). This option swaps the exact unread amount for a simple dot indicating there are unread articles. There's also a per-feed option to hide indicators altogether when the simple badges are enabled. You can enable this feature under Settings > Display & Appearance > "Unread Badges."

Let me know how this works out for you on [Mastodon](https://mastodon.social/@_jocmp) or [GitHub discussions](https://github.com/jocmp/capyreader/discussions/categories/q-a). As with all new features in Capy Reader, the goal is to focus on content, not the software around it. The less time you have to spend managing feeds, the more time you can spend on reading itself.

![Simple Badges in Capy Reader](/uploads/2026/simple-badges.jpg)
