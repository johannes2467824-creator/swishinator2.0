# Swishinator — organized project

Upload the contents of this `swishinator` folder to the root of your GitHub Pages repository. Keep `index.html` at the repository root.

- `index.html`: page structure and screen templates
- `code/style.css`: shared and payment-screen styling
- `code/confirmation.css`: confirmation screen, particles and verification styling
- `code/main.js`: navigation and general UI
- `code/animations.js`: confirmation/verification animation
- `code/payments.js`: demo payment display, date and reference
- `code/saved-numbers.js`: saved contact functionality (browser localStorage)
- `code/sounds.js`: sound playback and audio loading
- `code/particles.js`: particle effects, soundpad gesture and secret ⭐ code
- `images/`: image assets
- `sounds/`: MP3 audio assets

The original uploaded ZIP remains unchanged. The current saved contacts are stored in your browser, not in this ZIP.

If testing locally, serve the folder with a local web server rather than opening `index.html` via `file://`, because sound loading uses `fetch()`.
