# Assignment 6 — jQuery

**Nurlanov Adil · IT-2505**

Repository: https://github.com/Nurlanov-Adil/Assignment-6-jQuery

## Run

Open `index.html` in a browser and choose Task 1 or Task 2. No installation, build step or internet connection is needed.

For GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root).

## Files

- `task1/` — the original Selector Detective task, with all 20 cases.
- `task2/` — a copy extended with spotlight, animated details, moving and sorting.
- `assets/party-data.js` — the 21 guests from the assignment picture.
- `assets/style.css` — shared layout and appearance; no CSS transitions or animations.
- `assets/vendor/` — local jQuery 3.7.1.
- `assets/avatars/` — local Open Peeps avatars, including Miras.
- `screenshots/` — screenshots used in the report.
- `Assignment6_NurlanovAdil.docx` — report.

Each case rebuilds the page from the current party model and searches the DOM with one jQuery chain. Moves update the model. Adding Miras and removing Natasha are individual case demonstrations and reset before the next case. Sort toggles between time order and picture order. Reset party restores the original picture.

## Credits

- jQuery 3.7.1: https://jquery.com/ — MIT license, included in `assets/vendor/jquery-LICENSE.txt`.
- Open Peeps by Pablo Stanley: https://www.openpeeps.com/ — CC0.
- Avatar SVGs generated using https://www.dicebear.com/styles/open-peeps/.
