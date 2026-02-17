---
title: 'Capy Log: Miniflux and more'
summary: Miniflux support has been added to Capy Reader, allowing you to manage feeds
  and articles directly through its API.
date: 2026-02-03 21:33:07.000000000 -06:00
lastmod: 2026-02-04 20:39:42.000000000 -06:00
type: post
categories:
- capyreader
images:
- "/uploads/2026/add-account.png"
- "/uploads/2026/labels.png"
- "/uploads/2026/block-quotes.png"
url: "/2026/02/03/capy-log-miniflux-and-more/"
guid: http://jocmp.micro.blog/2026/02/03/capy-log-miniflux-and-more/
---
I’m excited to announce initial Miniflux support in Capy Reader in version 2026.01.1189. While it was possible to use Miniflux via the Google Reader API, this latest version of the app calls Miniflux’s API directly. Right now the feature set is just the essentials

- Add, remove, and update feeds
- Add and edit categories
- Fetch new articles, and mark articles as read and starred

These should cover all the same features as the Google Reader API, but let me know! If you notice anything missing, let me know [on GitHub](https://github.com/jocmp/capyreader/discussions/1749) or if you have feature suggestions that are specific to the Miniflux API. I’m already planning to investigate Miniflux’s [save feature](https://github.com/jocmp/capyreader/issues/1748) for example.

## Enabling Miniflux

To get started, select "Miniflux" on the account screen and enter your username and password. 

If you’re signed in to Google Reader API, just sign out in Settings > Account > Log Out, and then select Miniflux on the account screen. Note that API Keys are not yet supported, but I’m open to feedback on this, especially if you know of any other apps that have this feature already.

<img src="/uploads/2026/add-account.png" width="300" height="635" alt="Auto-generated description: A smartphone screen displays an Add Account menu with options to connect to RSS services like Local, Feedbin, FreshRSS, Miniflux, and Reader.">

## Other Tweaks

I’ve enabled the audio player by default in the latest version. The audio player has been behind an experimental flag for the past few versions, and is now ready for general use. This version includes improvements for FreshRSS by de-duplicating enclosures and showing counts for "My Labels."

If you enjoy these updates consider leaving a tip [on Ko-fi](https://ko-fi.com/capyreader) or sharing the app with others! As ever, thanks for using Capy Reader.

<img src="/uploads/2026/labels.png" width="300" height="635" alt="Auto-generated description: A smartphone screen displays an RSS feed app interface with sections for unread articles, categories, and labeled feeds.">

<img src="/uploads/2026/block-quotes.png" width="300" height="635" alt="Auto-generated description: A smartphone screen displays an article discussing upcoming features in GNOME 50, focusing on virtual monitor and remote desktop capabilities.">
