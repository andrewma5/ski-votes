# Catskills ski trip vote: setup (about 10 minutes, $0)

Two pieces: a Google Sheet that stores votes, and a GitHub Pages site that shows the trip and sends votes to the Sheet.

## 1. Make the vote backend (Google Sheet + Apps Script)

1. Create a new Google Sheet (any name, e.g. "Ski trip votes").
2. In the Sheet: **Extensions → Apps Script**.
3. Delete what's in `Code.gs`, paste in the contents of this repo's `Code.gs`, and save.
4. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions prompt (Google will warn that the app is unverified; it's your own script, so choose Advanced → Go to project).
6. Copy the **Web app URL** (it ends in `/exec`).

## 2. Connect the page

Open `index.html`, find this line near the bottom:

```js
const API="PASTE_YOUR_APPS_SCRIPT_URL_HERE";
```

and replace the placeholder with your `/exec` URL.

## 3. Publish on GitHub Pages

1. Create a new GitHub repo (public is fine; it holds no secrets) and upload `index.html` to the root.
2. Repo **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
3. After a minute your site is live at `https://<your-username>.github.io/<repo-name>/`. Send that link to the group.

## How it behaves

- Each person's browser gets its own voter id, so resending updates their row instead of adding a new one. Voting from a second device creates a second row (delete it in the Sheet if that happens).
- Results stay hidden until you've sent your ticket. This is a page-level lock, not real secrecy: anyone curious enough could open the `/exec` URL and read the raw votes.
- The page refreshes results every 30 seconds.
- You can see every ticket as a readable row in the Sheet's **Votes** tab.

## If you change the script later

Use **Deploy → Manage deployments → Edit → Version: New version** so the `/exec` URL stays the same.
