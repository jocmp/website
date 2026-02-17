---
title: 'Capy Log: Share Sheet updates'
summary: Share sheet tweaks, tablet improvements, Miniflux updates
date: 2026-02-16 19:37:18.000000000 -06:00
lastmod: 2026-02-16 19:38:59.000000000 -06:00
type: post
images:
- "/uploads/2026/subscribe.png"
- "/uploads/2026/miniflux-save.png"
url: "/2026/02/16/capy-log-share-sheet-updates/"
guid: http://jocmp.micro.blog/2026/02/16/capy-log-share-sheet-updates/
---
[Version 2026.02.1194](https://github.com/jocmp/capyreader/releases/tag/2026.02.1194) includes a few new changes around the built-in Android share sheet.  The first is a new layout. Feed discovery starts when the dialog opens instead of opening up to the app. This saves on taps and reduces the number of distinct screens, too. For Feedbin users, the share sheet will also display a "Save" tab which will [save to Pages](https://feedbin.com/blog/2025/10/01/newsletter-extension/) just like the official browser extension.

{{< figure src="/uploads/2026/subscribe.png" alt="Auto-generated description: Two smartphone screens showing different app interfaces with options for saving or subscribing to pages." caption="Subscribe and Save for Feedbin (left) and the new Subscribe modal, available for all other account types" >}}

### Other changes
There are a few small tweaks around Miniflux. I’ve added support for Miniflux’s "Save" feature within articles. This will appear if an integration is set up on the Miniflux account such as Instapaper or Readeck.

{{< figure src="/uploads/2026/miniflux-save.png" caption="A \"Save\" icon to share Miniflux entries with third-party integrations" >}}

Lastly, there’s now better tablet support via drag handles. A drag handle is the tall pill shape between the feed and the reader view. The drag handle can be pressed and dragged to show more list content, or more reader content. It can be dragged all the way to the end which will then open articles in full screen mode for subsequent articles.

{{< video src="/uploads/2026/drag-handles.mp4" poster="/uploads/2026/frames/1682301-0-01f919.jpg" width="540" >}}

### Bugs, squashed
- Fix infinite loop in Miniflux entry sync. Previously Miniflux accounts would silently keep fetching beyond the limit. ([PR #1814](https://github.com/jocmp/capyreader/pull/1814))
- Kill The Newsletter feeds not rendering properly. Inline styles and tables caused clutter. ([Issue #1817](https://github.com/jocmp/capyreader/issues/1817))

---

Follow me for more on [Mastodon](https://mastodon.social/@_jocmp) or chime in on [GitHub discussions](https://github.com/jocmp/capyreader/discussions/categories/q-a). As ever, thanks for using with Capy Reader!
