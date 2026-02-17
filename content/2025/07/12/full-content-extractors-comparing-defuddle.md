---
title: 'Full Content Extractors: Comparing Defuddle and Postlight Parser'
summary: Unnecessary history about full content extractors and a quick comparison
  of Postlight Parser and Defuddle.
date: 2025-07-12 17:03:00.000000000 -06:00
lastmod: 2026-01-19 15:37:08.000000000 -06:00
type: post
categories:
- rss
- programming
- mercury parser
images:
- "/uploads/2025/parser-compare-verge.png"
- "/uploads/2025/parser-compare-yn-sg.png"
url: "/2025/07/12/full-content-extractors-comparing-defuddle/"
guid: http://jocmp.micro.blog/2025/07/12/full-content-extractors-comparing-defuddle/
---
One of the hardest problems with RSS feeds is displaying full content. It's essentially an unsolvable problem given the complexity of webpages and the lack of adherence to a semantic layout for any given blog or news site. It would be nice if each page had a header tag, and an article tag, but it's not that simple. Full content parsers attempt to solve this, but each has their own set of trade-offs.

## Legacy Contenders

Tools like Mozilla's Readability.js used to solve this in the past, but given [their recent woes](https://www.theregister.com/2025/06/17/opinion_column_firefox/) it's hard to trust it as a tool. [Postlight Parser](https://github.com/postlight/parser) née [Mercury Parser](https://archive.postlight.com/insights/mercury-goes-open-source) was a better option. Instead of trying to solve all webpages with a set of common heuristics, each domain could be overridden with a custom parser. In effect, The Verge could have a Verge-specific parser while Ars Technica could have a slightly different parser.

It would be simple to stop there, but Postlight Parser was a product of its time. Around 2015, there was a [push by Google](https://www.theverge.com/23711172/google-amp-accelerated-mobile-pages-search-publishers-lawsuit) to speed up the web by simplifying webpages with AMP. Postlight was one of many companies that stepped in with their own set of tools like the parser to improve development with AMP. But as time passed, AMP fell out of fashion, and Postlight was [acquired by NTT Data](https://archive.postlight.com/insights/postlight-joins-launch-by-ntt-data). 

Postlight Parser essentially ended with the acquisition. It's still possible to find Postlight Parser in the wild, however. Feedbin, a web-based feed reader, uses Postlight Parser to [power its full content mode](https://feedbin.com/blog/2019/03/11/the-future-of-full-content/). Core development has ground to a halt with the last release [in 2022](https://github.com/postlight/parser/releases/tag/v2.2.3).

## A New Entrant

Readability.js and Postlight Parser may very well represent the past of full content extraction. However a new project called Defuddle might take their place. [Defuddle](https://github.com/kepano/defuddle) was released in early 2025 by the developer behind the note-taking app Obsidian. It takes the Readability.js route of a one-size-fits-all input function with different internal heuristics.

The following is a brief and non-exhaustive comparison between v2.2.3 of Postlight Parser and v0.6.4 of Defuddle using a small node.js application ([source code on GitHub](https://github.com/jocmp/parser-comparison)). Defuddle seems to work best when the site's markup is already well formatted which is the case with The Verge. In the [following review article](https://www.theverge.com/24324299/asus-rog-zephyrus-g16-2024-gaming-laptop-review-amd-strix-point), Defuddle picks up more images, headers, and content like the overall review score than Postlight Parser.

<img src="/uploads/2025/parser-compare-verge.png" width="600" height="449" alt="">

Parsing fails if you throw [an article from Yahoo News Singapore](https://sg.news.yahoo.com/mcdonald-pore-launches-chilli-crab-064000706.html) at either Defuddle or Postlight Parser. Defuddle has a slight edge in that it at least extracts images and article content but still captures garbage text like "ADVERTISEMENT." 

<img src="/uploads/2025/parser-compare-yn-sg.png" width="600" height="449" alt="">

In short, better base markup still results in a better outcome. Defuddle is clearly the project to watch given Postlight Parser's lack of updates, and it's backed by a live project with Obsidian. Full content parsers come and go but the need to tame the chaos of the web is never ending.
