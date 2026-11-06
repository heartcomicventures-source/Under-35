# SPORTHUB (Under 3.5 panel)

A single-file goal-line checklist for live soccer. `index.html` is the whole app.

## Lock-screen alerts (optional)

A small Cloudflare Worker (`worker/worker.js`) checks live matches about once a minute with your API-Sports key, runs the panel's own rules, and pushes an alert to your phone when a match passes, for example `BET UNDER 3.5 · Arsenal v Chelsea · 62' · 1–1`. It never places a bet. It sends one alert per match, follows your Market choice and entry minutes, and stays quiet while the panel is paused, in cool-off or done for the day.

**On the phone:** iPhone 16.4 or later. Alerts work only from the Home Screen app: in Safari tap Share, then Add to Home Screen, and open SPORTHUB from there. Copy a backup first (Settings, Back up and restore), because a new Home Screen icon starts with empty storage.

**Set up the Worker (about 10 minutes, once):**

1. Create a free Cloudflare account. Open Workers & Pages, create a Worker (Hello World), name it `sporthub-alerts` and deploy it.
2. Open Edit code, select everything, paste the contents of `worker/worker.js`, and deploy.
3. Create a KV namespace (Storage & Databases, KV). In the Worker open Settings, Bindings, Add, KV Namespace. Set Variable name to `STORE`, pick the namespace, deploy.
4. In Settings, Variables and Secrets, add a Secret named `TOKEN`. The value is a long password you make up.
5. In Settings, Triggers, Cron Triggers, add `* * * * *` (every minute).
6. Copy the Worker address (`https://sporthub-alerts.<your-name>.workers.dev`).

**Turn it on in the app:** Settings, Live data: save your API-Sports key. Then Lock-screen alerts: paste the Worker address and the password, tap Turn on, allow notifications, tap Send test and lock the phone.

With a computer you can use `worker/wrangler.toml` instead: put the KV namespace id in it, then `npx wrangler deploy` and `npx wrangler secret put TOKEN`.

**Good to know**

- Your API key is stored on your own Worker (in its KV storage) so it can watch matches while the app is closed. Keep the Worker address and password private. Turning alerts off, or removing the key in the app, erases it from the Worker.
- Cloudflare's free plan allows 10 ms of computing per run, 50 outside calls per run and 1,000 KV saves a day. In testing a full day used about 250 saves and a busy run well under the call limit. If Cloudflare ever reports "exceeded CPU", the $5 Workers Paid plan removes that limit.
- The Worker looks every minute while a match is near your window and every few minutes otherwise, to save API requests. It reads your remaining daily requests from the API and slows down when they run low.
- iPhone Focus modes and notification settings can still silence alerts.
