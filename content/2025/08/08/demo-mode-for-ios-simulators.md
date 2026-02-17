---
title: Demo mode for iOS simulators
summary: Quick post on using the CLI to take better iOS simulator screenshots.
date: 2025-08-08 14:17:51.000000000 -06:00
lastmod: 2025-08-28 21:38:55.000000000 -06:00
type: post
categories:
- programming
- mobile development
- ios
images:
- "/uploads/2025/demo-mode.png"
url: "/2025/08/08/demo-mode-for-ios-simulators/"
guid: http://jocmp.micro.blog/2025/08/08/demo-mode-for-ios-simulators/
---
I was in search of a better way to take app screenshots. Typically you have two choices: use a physical device or a simulator. Physical devices are fine for a realistic display, but you can't control the time or the radio indicators. No one wants to see just two bars of service on a screencap. iOS' default simulators don't even show the service indicator.

Luckily the first result I came across was [a post from Jesse Squires](https://www.jessesquires.com/blog/2019/09/26/overriding-status-bar-settings-ios-simulator/) from 2019. The following command will override the current simulator with full service and the iconic 9:41AM time.

```
xcrun simctl status_bar booted override --time "9:41" --dataNetwork "wifi" --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100
```

The end result looks like this.

![](/uploads/2025/demo-mode.png)
