---
title: 'Capy Log: Open In Browser, Article List Tweaks'
summary: Summer in the midwest is careening towards autumn, and version 2025.08.1153
  of Capy Reader is in review for the Play Store. I haven't been adding huge feature
  changes lately. Instead, I've been trying to pick apart the app and understand some
  underlying jank that exists.
date: 2025-08-02 13:49:32.000000000 -06:00
lastmod: 2025-08-28 21:38:50.000000000 -06:00
type: post
categories:
- capyreader
- rss
- programming
url: "/2025/08/02/capy-log-open-in-browser/"
guid: http://jocmp.micro.blog/2025/08/02/capy-log-open-in-browser/
---
Summer in the midwest is careening towards autumn, and version [2025.08.1153](https://github.com/jocmp/capyreader/releases/tag/2025.08.1153) of Capy Reader is in review for the Play Store. I haven't been adding huge feature changes lately. Instead, I've been trying to pick apart the app and understand some underlying jank that exists. More on that later. While there aren't huge changes in this release, I did get around to adding "Open in browser" as an option to view articles.

## Open In Browser

"Open in browser" by default has been a long outstanding feature. It was [first requested in January](https://github.com/jocmp/capyreader/discussions/715) of this year. I feel bad sometimes when there's a huge delta between time requested and time implemented, but I spent a lot of time waffling on this feature.

It's deceptively simple but the "open in browser" requires two key expectations

1. The article opens in the browser
1. The article is marked as read

This second expectation prevents a direct call to an `ACTION_VIEW` intent since there is not a way to simultaneously launch two actions from a widget RemoteView. The trade-off then is to create a [trampoline activity](https://marcellogalhardo.dev/posts/2023/trampoline-activities/) which first opens the app with a transparent view, and then opens the browser. The trampoline activity can be avoided when the "open in browser" action is initiated within the app since the article state is already within context.

Putting it all together, the new "open in browser" feature in Capy does what it says on the tin:

<video controls="controls" playsinline="playsinline" src="/uploads/2025/demo.mp4" poster="/uploads/2025/poster.png" preload="none"></video>

## Feed Selection UI Improvements

One outstanding problem in Capy Reader has been feed list transitions. To spot the bug in previous versions:

1. Scroll part way down a page, note the status and toolbar change color
1. Open the feed list and select another feed
1. Jank! The previous article list will scroll - or teleport - to the first index, and then the next feed will load in

Here's an example of the problem at 4x speed. The top bar state jank is noticeable at the 10 second mark when it still appears as the changed color when the list has already switched to the next feed.

<video src="/uploads/2025/before.mp4" poster="/uploads/2025/650a7c3a16.png" controls="controls" preload="metadata"></video>

The solution I found was to [rebuild the article pager](https://github.com/jocmp/capyreader/pull/1354/commits/1431818cbc8717816273bc427770127ea76e8458) in the view layer. This in turn invalidates the list state which simultaneously invalidates the scrollbar state.

```kotlin
import androidx.paging.Pager
import androidx.paging.PagingConfig

// In View Model
fun buildPager(): Pager {
    return Pager(
        config = PagingConfig(
            pageSize = 50,
            prefetchDistance = 10,
        ),
        pagingSourceFactory = {
            findArticles(...)
        }
    )
}

// Pager is now in Compose view layer
val articles = remember(...) {
   viewModel.buildPager(...)
}
```
The last wrinkle with this approach is pager updates in response to in-feed actions. One example of this is swipe-to-refresh on the "Unread" filter. When the refresh finishes, articles that have been read disappear. If the invalidation flag - in this case a timestamp - is passed to the `remember` function then the feed will flash causing the list to flicker and jump back to the first index. Instead the solution is to track a separate variable within the view model. When the timestamp changes, the view-level `articles` variable [is refreshed](https://github.com/jocmp/capyreader/pull/1365/files#diff-a3dc4554d8145d70c4d38aeebda102f8988a6794752336fe21357326112e00d7) which triggers a new call to the `pagingSourceFactory`. 

Here's a demo putting it all together:

<video src="/uploads/2025/after.mp4" poster="/uploads/2025/726aff4e1c.png" controls="controls" preload="metadata"></video>

Something so subtle that you might not have even noticed, but your brain did.

## What's next

In the next few updates I hope to add more settings around "open in browser" based on [early feedback](https://github.com/jocmp/capyreader/discussions/1306). Additionally, I have an outstanding UI tweak around the [local blocklists](https://github.com/jocmp/capyreader/discussions/1211) that I really want to wrap up and deliver.
