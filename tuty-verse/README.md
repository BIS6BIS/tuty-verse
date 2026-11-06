# Tuty-Verse

A non-commercial, fan-made birthday game and wishes mailbox for Tuty. Not affiliated with her, her agencies, broadcasters or any studio.

Open `index.html` in a browser (or use the VS Code "Live Server" extension). No build step, no installs.

## Files
| File | What it does |
|---|---|
| `index.html` | Page structure |
| `style.css` | Pixel-art styling, light and dark themes, laptop (landscape) and phone (vertical) layouts |
| `js/pixel.js` | Draws every icon, stage logo and the cat mascot from pixels (no emoji, no image files) |
| `js/audio.js` | Background music and click sounds, generated in code |
| `js/data.js` | Stages, wishes, form setup and the kindness filter. **Most edits happen here** |
| `js/app.js` | Game, mailbox, mascot builder, menu and controls |
| `js/games.js` | The three mini games: memory match, maze escape, sunflower catch |
| `img/` | Your photos (resized). Stages and the achievements heart point here |

## Wishes: how they work
- The 9 collected wishes are already in `WISH_ROWS` in `js/data.js` (one per line: `@username | message`). Add more the same way.
- Each fan gets their own little cat, with a fur, outfit and extras picked from their username.

### Direct wishes with Firebase (recommended: no form, no redirect)
1. Go to console.firebase.google.com, sign in, **Add project** (turn Analytics off).
2. Build > **Realtime Database** > Create database (any region) > start in **locked mode**.
3. Open the **Rules** tab, paste this and **Publish**. It lets visitors add wishes and read them, but never edit or delete:
```
{"rules":{"wishes":{".read":true,"$id":{".write":"!data.exists()",".validate":"newData.hasChildren(['handle','message','t'])","handle":{".validate":"newData.isString() && newData.val().length<=40"},"message":{".validate":"newData.isString() && newData.val().length<=300"},"t":{".validate":"newData.isNumber()"},"$other":{".validate":false}}}}}
```
4. On the **Data** tab copy the address at the top (like `https://YOUR-PROJECT-default-rtdb.firebaseio.com`) and paste it into `WISH_DB.url` in `js/data.js`.
5. To remove a wish you do not like, delete it on the Data tab.

### Or: Google Form + Sheet (older option, only used if `WISH_DB.url` is empty)
1. Create a Google Form with two short-answer questions: **X username** then **Message**.
2. "Get pre-filled link", fill both, and copy the link. It holds the `entry.NNNNNN` ids. Put the form's `.../formResponse` URL and the two ids into `FORM` (`action`, `handle`, `message`) in `js/data.js`.
3. In the Form's Responses tab, open the linked Google Sheet, then File > Share > **Publish to web**, choose the responses sheet and **CSV**, and paste that link into `FORM.sheetCsv`.

Once both are set, a wish sent from the game shows in the sender's mailbox at once, and in everyone else's mailbox within about 20 seconds (the mailbox re-reads the sheet). Until then, sending says it is not switched on yet, so no wish is silently lost.

**Moderation:** the kindness filter (insults, slurs, threats, links, @mentions, look-alike spellings) runs on every wish before it is sent and again before it is shown. A browser filter can be bypassed by a determined person, so open the response sheet now and then and delete any row you do not want shown: deleting the row removes it from the game.

## Put it online with GitHub Pages
1. Create a repo and upload everything in this folder (keep `index.html` at the top level and the `img` and `js` folders as they are).
2. Repo Settings > Pages > Deploy from a branch > `main` / `(root)` > Save.
3. After a minute the site is live at `https://YOURNAME.github.io/REPO/`. File names are case sensitive there, and they already match.

## Other things you can edit
- **Stages:** the `STAGES` list in `js/data.js` (each has a `motif`, which names its pixel logo in `js/pixel.js`).
- **Mascot options:** fur prints in `FURS`, outfits in `OUTFITS`, accessories in `PROPS` (all in `js/pixel.js`).
- **Limits:** `MAX_WISH`, `MAX_SENDS` and `SEND_GAP_MS` in `js/data.js`.

## Notes
- **Mascot:** each visitor's built mascot is kept for that browser tab only (session storage) and forgotten when the tab closes. Game progress and settings are kept on the device.
- **Sound:** browsers only allow audio after the first tap or key press, so music starts then. Music and sound effects can be turned off in the Menu (the round button on the right of the console, or the menu icon on screen).
- **Photos:** your own photos are in `img/`. Some older stage photos are still linked from other sites. If a site blocks them, a placeholder appears instead.
- **Backup:** the previous version of this project is in `../_backup-v1/`.
