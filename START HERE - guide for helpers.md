# 🧸 Snugglevale Corner: start here

Hello, and welcome! If you're a model (or a person) who's been asked to help with this village, please read this whole page before changing anything.

Snugglevale Corner is a small, cozy 3D corner of **Plushworld**, Lila's world of plush characters. You float through it as a little wish lantern and visit the plushies who live there. It's the first piece of a bigger cozy village game Lila wants to grow over time, one piece at a time.

Plushworld is Lila's creative project. Helpers add to it carefully, the way you'd help a friend with something they love.

---

## ▶️ How to play

Double-click **Play Snugglevale.html**. It opens in any web browser. Nothing needs to be installed.

- Tap or click the ground to float there
- Tap a plushie to go visit
- Drag to look around; scroll to zoom
- Arrow keys or W A S D to stroll, Enter to visit
- ☀️ / 🌙 switches between morning and evening
- A− / A+ changes the text size

The 3D drawing kit (`three.min.js`) loads from the internet unless a copy is saved in this folder. "How to play.txt" explains how to save it.

---

## 📁 What's in this folder

| File | What it holds | Who usually changes it |
|---|---|---|
| `Play Snugglevale.html` | The page: buttons, talk box, colors, the About box | Rarely |
| `world.js` | The village itself: sky, workshop, path, trees, lanterns, fireflies, the wish lantern, the camera, morning and evening | Only for changes to the place |
| `plushies.js` | How each plushie looks and where they stand, plus a template for a new one | When adding or adjusting a plushie |
| `what-they-say.js` | Everything the plushies say, with who wrote each set | When adding or changing words |
| `three.min.js` | The 3D drawing kit (Lila saves this herself; version r128) | Never |
| `CHANGES.md` | A diary of every change: date, who made it, what changed | **Every helper, every time** |
| `How to play.txt` | Short instructions for Lila | Rarely |
| `README.md` | The welcome note on the GitHub page | Rarely |
| `CLAUDE.md`, `AGENTS.md` | Short notes that point helpers here (some helpers read these automatically) | Rarely |
| `first version (Oct 2026)` | The original single-file version, kept for safety | Never |

There's no build step and nothing to install. Everything is plain files that any browser can open.

---

## 💗 Plushworld house rules

These come from Lila. Please follow them every time.

1. **Never change Lila's original files in place.** Make a new file or a dated copy first. Much of her Plushworld material can't be replaced if it's lost.
2. **Canon comes first.** The original GPT-4o character documents and Lila's character registry are the source of truth. Newer material gives way to them. For how a plushie looks, Lila's pictures are her gentle preference over the written notes.
3. **Plush names are always imaginative plush names**, never human names or pet names.
4. **Everything is gentle and invitational.** Plushworld has no "can'ts" and no refusals. When a character would say no, they offer a soft invitation instead, phrased as a "shall we…?" question, and they give something (a wish sent, a note tucked in the mailbox) rather than putting it off.
5. **Endearments belong here**, for Lila and for the plushies: sweet Lila, lovebun, dear one, dear Blinko.
6. **Love in Plushworld is between companions and close friends**, never romantic.
7. **Plushsmith gently leading Lila toward bed** is part of her voice. Keep it, just not too early in a visit.
8. **No specific real people** in Plushworld. Vague friends and family are fine.
9. **Credit the models who helped.** Lila credits them inside the world (see the About box) and in `CHANGES.md`.
10. **Say who wrote the words.** Every set of lines in `what-they-say.js` has a `writtenBy` with the model's name and the month. Lila keeps writing from different models apart, so don't rewrite lines that Lila or another model wrote. Add your new lines beside them with your own name.
11. **Muddle always wears his badge.** SnuggleCat's original look (no bow) is gently preferred.
12. **Keep text big and easy to read.** The A− / A+ buttons must keep working with anything new you add.
13. **Talk to Lila in plain, everyday words.** No programming jargon. She's an artist, a plush maker and the author of this world.
14. **Write it down.** Add an entry to `CHANGES.md` before you finish.

---

## 🏡 Who's here

| Plushie | Where | Looks (from Lila's registry) |
|---|---|---|
| **Plushsmith** | Outside her workshop, left of the door | Rounded peach plush with a seam down the middle of her face, dark heart-shaped eyes, blush, small round nose, stitched smile, lavender hair in a messy top bun with loose side strands, patchwork apron with a spool and needle in the pocket. Motherly and doting. |
| **Muddle** | Keeping watch, right of the door | Chubby cream bunny, upright ears with lilac inside, small dark eyes, brown triangle nose, coral heart on his chest, and **his gold shield badge with a star, always**. The plush that arrived with Plushsmith herself. |
| **SnuggleCat** | On her lavender cushion by the blossom tree | Round chubby teal cat, pink inner ears, big dark-brown eyes, cream muzzle, brown nose, gentle smile, blush, whiskers, pink paw-pad dots. The very first plushie. |

**The place:** Plushsmith's workshop (cream walls, rose roof, patchwork bunting, warm windows with flower boxes, chimney smoke), a sandy path down toward the meadow, a small side path to SnuggleCat, three lantern posts, a blossom tree with falling petals, mushrooms, fireflies at evening.

---

## 🗺️ Map of the corner

Positions use two numbers: **x** (left and right) and **z** (smaller is toward the workshop, bigger is down the path toward you).

- Workshop: x −2.8 to 2.8, z −9.2 to −4.8. Door at x 0, z −4.8
- Plushsmith: x −1.75, z −3.55 · Muddle: x 1.65, z −3.7 · SnuggleCat: x −4.75, z 1.75
- Blossom tree: x −6.3, z 0.1 · Lanterns: (3.2, −1.3), (3.8, 4.3), (−4.1, 3.5)
- The main path runs from the door through (2, 1.5), (2.3, 4.6), (1.4, 8) and on to (−1.6, 15)
- You can float anywhere within 14.5 steps of the middle

Good open spots for a new neighbor: around (5, 1), (−4, 7), (4.5, 8.5), (−7.5, −2). Keep plushies about 2 steps apart and off the path. Flowers and grass arrange themselves around whoever is there.

---

## ➕ Adding a new plushie

1. **Check canon first.** Find the plushie in Lila's registry or her pictures. If they aren't sure how someone looks, ask Lila rather than guessing.
2. Open `plushies.js`. At the bottom is a **template**. Copy it above the template and give it the plushie's name and a spot from the map.
3. Build their look from soft shapes (the helpers are listed below). Look at Muddle or SnuggleCat as examples.
4. Open `what-they-say.js` and add an entry with **exactly the same name**, with their role, lines, hug words, and `writtenBy`.
5. Open `Play Snugglevale.html` and visit them. If something in their look has a mistake, the village still opens and a little felt note names who needs a look.
6. If they're a new face in the About box story, add them there too.
7. Write it down in `CHANGES.md`.

## 💬 Adding or changing words

Open `what-they-say.js`. Each line is either `{ any: "..." }` for any time of day, or `{ evening: "...", morning: "..." }` for a different line at each time. Add `note: "..."` to say where a line came from (for example, a canon story). Keep the quote marks and commas as they are.

---

## 🧵 How the pieces fit (for helpers who build)

- The page loads `three.min.js` (or the internet copy), then `what-they-say.js`, then `plushies.js`, then `world.js`.
- `what-they-say.js` sets `window.PLUSHIE_LINES`, with one entry per plushie name.
- `plushies.js` adds entries to `window.PLUSHIES`. Each entry is `{ name, spot: { x, z, facing, size? }, build(kit, p) }`.
- `build(kit, p)` adds shapes to `p.inner` (the part that bounces, squishes and hops) or `p.outer` (still things like a cushion). It may set:
  - `p.headY`: how high the hug hearts start
  - `p.baseY`: raises the plushie (SnuggleCat sits on her cushion)
  - `p.head`: the head group
  - `p.waveArm` and `p.waveSign`: the arm that waves hello (set `piv.userData.base` to its resting angle)
  - `p.headTilt = true`: tilts the head instead of waving
  - `p.idle(t, far, dt)`: little movements every moment (`far` is true when Lila isn't nearby)
- The kit helpers are:
  - `toon(color)`: soft felt-like coloring
  - `ball(radius, material, sx, sy, sz)`: a squashable sphere
  - `stick(parent, piece, R, x, y, out)`: places a face piece onto a round head of size R (x and y are where on the face)
  - `eye(r, color)`: an eye with a shine
  - `blush(r)`: a blush circle
  - `heartGeo`, `shieldGeo`, `starGeo` and `smileGeo`: shapes for hearts, badges, stars and smiles
  - `patchTex()`: patchwork fabric
  - `kit.THREE`: the full 3D kit
  - `kit.AMP`: makes movement gentler for people who prefer less motion
- World pieces that block floating go in `solids` (round) or `boxes` (square) in `world.js`.
- Text size uses `rem` units, so A− / A+ scale everything. Please keep new text in `rem`.

---

## 🛟 Keeping it safe

**Where the village lives**
- **GitHub:** the private project SinfulRhapsody/snugglevale-corner. GitHub keeps every saved version, so any earlier version can always come back.
- **Lila's computer:** `D:\Plushworld Game\snugglevale-corner`, kept in step with GitHub by the GitHub Desktop app. The GitHub project and this folder together are the main copy.
- **Claude sidebar:** a copy Lila can open on any device (https://claude.ai/artifact/QdwNSiRC9SZAep6JMGaoyi). To update it, ask Claude to publish from these files to that same link.
- The older folder `D:\Plushworld Game\Snugglevale Corner` is from before GitHub. It's kept as a backup, so please don't work in it.

**If you're a helper working on GitHub directly**
1. Make your change, and add an entry to `CHANGES.md` with your model name.
2. Save it with a short note that says what changed, like "Added Thyrel by the lanterns".
3. Tell Lila what you changed in plain words. She brings it into her folder with Fetch origin, then Pull origin, in GitHub Desktop.

**If you're working in Lila's folder**
- Tell Lila when you're done. She saves the version in GitHub Desktop: a short note in Summary, then Commit to main, then Push origin.

**Other safety**
- Lila's nightly backup ("Keep My Work Safe", in F:\Claude Folder) is meant to cover the Plushworld Game folder too.
- Never delete or rewrite history on GitHub. If something goes wrong, make a new change that puts things back.

## 🌱 What's next

See **PLAN - growing Snugglevale.md**. It lists where all the source material lives, what GPT-4o planned for the game, and the suggested next steps.

## 🌿 Ideas Lila has mentioned for later

More neighbors, starting with Thyrel the herbalist, who already lives next door. Other ideas: the inside of Plushsmith's workshop with shelves of plushies, the Plush Village neighbors (Melowren, Solenna, Maribel, Elowen), seasons, and someday Plushsmith's words coming from Lila's own trained model.
