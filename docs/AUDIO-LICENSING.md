# Audio provenance and licensing — Vidhi & Yash Directors' Cut

The project **does not generate any audio programmatically**. The Sound control defaults to OFF to comply with autoplay restrictions and respect guests.

The runtime references the following recordings, and they are **not included in this source archive**:

- `bell` — *Windchimes.ogg*, recorded by Esc861 in 2009; donated to the public domain. Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Windchimes.ogg
- `gate` — Mixkit preview sound effect: `https://assets.mixkit.co/active_storage/sfx/1492/1492-preview.mp3`
- `blossom` — Mixkit preview sound effect: `https://assets.mixkit.co/active_storage/sfx/1489/1489-preview.mp3`
- `sparkle` — Mixkit preview sound effect: `https://assets.mixkit.co/active_storage/sfx/911/911-preview.mp3`

The Mixkit sound-effects free license allows use within commercial and personal end products, but **does not allow redistributing the isolated source sound files with source-code bundles or templates**. Therefore no Mixkit audio bytes are bundled. Refer to https://mixkit.co/license/modal/sfxFree/ for license terms.

**Before public deployment:** Test all recordings and URLs from your actual hosting domain; remote preview links can expire or deny cross-origin access. For production reliability, download separately licensed effects under the applicable terms and host them as part of your *finished invitation website* if the license permits it; then adjust `src/components/AudioDirector.jsx` to point to your local copies. The browser uses `HTMLAudioElement.play()`, catches play errors, limits the volume, and never autoplays.

The hero illustrations in `public/art` were commissioned/generated for this invitation and have no implied connection with the actual venue or couple's photographs. They are illustrative placeholders, not factual depictions.
