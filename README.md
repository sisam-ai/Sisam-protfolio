# Sisam's Pixel Hideout

A responsive portfolio blending original cursed-energy anime visuals with block-built scenery. It includes animated effects, a student profile, project cards, social links, and two playable mini-games.

`block-blitz.html` is a separate beginner-friendly game: edit the HTML, CSS, and JavaScript in that one file, then open it in a browser to play.

## Preview locally

Open `index.html` in a browser. The site uses plain HTML, CSS, and JavaScript, so it does not need a build step.

## Personalize it

- Update the intro and project descriptions in `index.html`.
- Update the school and interests in the player profile section if they change.
- Replace the GitHub or LinkedIn profile links if either profile changes.
- Add project cards by duplicating an `<article class="project-card">` inside `.project-grid`.
- Adjust colors, spacing, and motion in `styles.css`.
- Game behavior and locally saved high scores are in `script.js`; the visual theme is in `extra.css`.

## GitHub Pages

Live site: https://sisam-ai.github.io/Sisam-protfolio/

The included workflow deploys the site from the `main` branch. After the workflow is pushed, select **Settings → Pages → GitHub Actions** if Pages is not already configured. The deployed site is publicly viewable even when its source repository is private. Private-repository Pages hosting requires an eligible GitHub plan.
