# SPORTHUB (Under 3.5 panel)

A goal-line checklist for live soccer. It checks a match against your own rules for Under and Over, says BET or NO BET, counts your bets for the day and keeps a record. It never places a bet and is not connected to any bookmaker.

## The website

This repository is the whole site. Publish it with GitHub Pages (Settings, Pages, Deploy from branch `main`, folder `/ (root)`).

| File | What it is |
| --- | --- |
| `index.html` | The panel itself. The site address (`https://<your-name>.github.io/Under-35/`) opens it directly. One file, nothing else to load. |
| `panel.html` | The same panel, kept so Home Screen icons and old links keep working. |
| `sw.js` | Service worker. It only shows lock-screen alerts and opens the panel when one is tapped. It does not cache pages. |
| `manifest.webmanifest` | Home Screen / install settings. Starts at `panel.html`. |
| `icon-192.png`, `icon-512.png` | Icons. |
| `worker/` | The optional alert server (Cloudflare Worker). |

**Phone:** one column. **Computer (a window 900 px wide or more):** two columns, with the inputs on the left and the decision on the right. The phone layout is the same as before.

**Pre-match tab (needs your API-Sports key):** the Pre-match tab (between Backtest and Settings) builds a combination of 1 to 4 games (you choose; 3 by default) from the day's matches that have not started, using the numbers several bookmakers quote (Match Winner, Double Chance, Goals Over/Under, Both Teams Score). For each game it shows the chance, then the total and the chance that every game wins. It shows two combinations: the one with the highest total that still reaches your minimum chance (80% by default) and the one closest to your target total (2.00 by default). A chance is what the bookmakers together say with their margin taken out, so it is an estimate, never a promise. In practice a combination near a total of 2.00 wins about half the time, and 80% or better needs a total well under 1.5. At the same total, more games do not raise the chance: the total is what decides it. Below the combinations a list of the safest single games shows each match's highest-chance pick, best first. Saved combinations are checked for you after the games are over and counted, so you see the real hit rate next to what the chances said. Each saved combination remembers the minimum chance that was set when it was saved, and the summary counts the ones that met their minimum on their own, so the 80% claim is measured apart from the combinations built to reach a higher total. With Auto-save on (the default), the cards you find are saved by themselves, once for each day, number of games and kind of card; this happens when you tap Find combinations, not while the app is closed, and a combination you remove is not put back. Reading one day costs about 7 requests of your daily allowance (you can choose 4 to 16).

**Pre-match Day choice:** Today, Tomorrow, or any of the next six days by name, so you can plan a weekend ahead. Further ahead, fewer matches have numbers, from fewer bookmakers, and the numbers can move before kickoff, so read again closer to the day; the tab says so from three days ahead. Auto-save files each day's picks under that date.

**Price / Volume over time (Record tab, needs your API-Sports key):** at the top of the Record tab, a collapsed section draws the live price of a match over the match clock, like a price chart on an exchange. Pick a live match (or use the one linked on the Bet tab), choose a market (Under or Over lines, Home/Draw/Away, Both teams score) and how often to read (30 seconds, 1 minute or 2 minutes). Goals are marked on the chart, a pause after a goal shows as a gap, and tapping or hovering (or the arrow keys) reads any point. The live feed has no traded volume, so the bars under the line are movement: how far the price moved since the previous reading. Each reading is one API request and is only taken while the page is open and on screen; the last 5 matches are kept on the device and are not part of a backup. It never reads faster than the app's own refresh rate, which slows down when your daily allowance runs low.

**If you used an older version:** the site no longer has a landing page. Its address now opens the panel, and your existing Home Screen icon and any `panel.html` link keep working. Your data lives in the browser's storage for this site and is shared by both addresses, so nothing is lost. After you update, tap Reload latest in Settings.

## Lock-screen alerts (optional)

A small Cloudflare Worker (`worker/worker.js`) checks live matches about once a minute with your API-Sports key, runs the panel's own rules, and pushes an alert to your phone or computer when a match passes, for example `BET UNDER 3.5 · Arsenal v Chelsea · 62' · 1–1`. It never places a bet. It sends one alert per match, follows your Market choice and entry minutes, and stays quiet while the panel is paused, in cool-off or done for the day.

**On the phone:** iPhone 16.4 or later. Alerts work only from the Home Screen app: in Safari tap Share, then Add to Home Screen, and open SPORTHUB from there. Copy a backup first (Settings, Back up and restore), because a new Home Screen icon starts with empty storage.

**On a computer:** Chrome, Edge, Firefox and Safari can all receive alerts in an ordinary tab, as long as the browser is open (a minimised window is fine). Open the panel, go to Settings, Alerts, paste the same server address and password, tap Turn on and allow notifications. Brave needs "Use Google services for push messaging" switched on in its settings.

**Several devices:** up to five devices can be on at once, and each gets every alert. One set of rules and one API key live on the server. The first device you turn on sets them. A device that joins a server that already has rules just receives alerts. To make it the one that sets the rules, tick "This device sets the rules and API key the server uses" in Settings, Alerts.

**Set up the Worker (about 10 minutes, once):**

1. Create a free Cloudflare account. Open Workers & Pages, create a Worker (Hello World), name it `sporthub-alerts` and deploy it.
2. Open Edit code, select everything, paste the contents of `worker/worker.js`, and deploy.
3. Create a KV namespace (Storage & Databases, KV). In the Worker open Settings, Bindings, Add, KV Namespace. Set Variable name to `STORE`, pick the namespace, deploy.
4. In Settings, Variables and Secrets, add a Secret named `TOKEN`. The value is a long password you make up.
5. In Settings, Triggers, Cron Triggers, add `* * * * *` (every minute).
6. Copy the Worker address (`https://sporthub-alerts.<your-name>.workers.dev`).

**Turn it on in the app:** Settings, Live data: save your API-Sports key. Then Alerts: paste the Worker address and the password, tap Turn on, allow notifications, tap Send test and lock the phone.

With a computer you can use `worker/wrangler.toml` instead: put the KV namespace id in it, then `npx wrangler deploy` and `npx wrangler secret put TOKEN`.

**Good to know**

- Your API key is stored on your own Worker (in its KV storage) so it can watch matches while the app is closed. Keep the Worker address and password private. Turning alerts off, or removing the key in the app, erases it from the Worker.
- Cloudflare's free plan allows 10 ms of computing per run, 50 outside calls per run and 1,000 KV saves a day. In testing a full day used about 250 saves and a busy run well under the call limit. If Cloudflare ever reports "exceeded CPU", the paid Workers plan removes that limit.
- The Worker looks every minute while a match is near your window and every few minutes otherwise, to save API requests. It reads your remaining daily requests from the API and slows down when they run low.
- iPhone Focus modes and notification settings can still silence alerts.
- The iPhone path has been confirmed with a real test alert on a lock screen. Computer alerts were tested against stand-ins for the browsers' push services, not the real ones. If a computer browser does not show alerts, use Check server in Settings and look at the browser's own notification settings first.
