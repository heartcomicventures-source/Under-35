# SPORTHUB (Under 3.5 panel)

A goal-line checklist for live soccer. It checks a match against your own rules for Under and Over, says BET or NO BET, counts your bets for the day and keeps a record. It never places a bet and is not connected to any bookmaker.

## The website

This repository is the whole site. Publish it with GitHub Pages (Settings, Pages, Deploy from branch `main`, folder `/ (root)`).

| File | What it is |
| --- | --- |
| `index.html` | Landing page. Opened from a Home Screen icon or an installed app, it goes straight to the panel. `index.html?about` always stays on the landing page. |
| `panel.html` | The panel itself. One file, nothing else to load. |
| `sw.js` | Service worker. It only shows lock-screen alerts and opens the panel when one is tapped. It does not cache pages. |
| `manifest.webmanifest` | Home Screen / install settings. Starts at `panel.html`. |
| `icon-192.png`, `icon-512.png` | Icons. |
| `img/` | Screenshots for the landing page. |
| `worker/` | The optional alert server (Cloudflare Worker). |

**Phone:** one column. **Computer (a window 900 px wide or more):** two columns, with the inputs on the left and the decision on the right. The phone layout is the same as before.

**If you used an older version:** the existing Home Screen icon keeps working. It lands on the landing page for a moment and moves on to `panel.html`. Your data lives in the browser's storage for this site, so nothing is lost. After you update, tap Reload latest in Settings.

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
