# EMBER identity

Custom vector artwork created for this prototype: an angular ember silhouette with an E-shaped cutout, plus uppercase geometric lettering. The clipped corners echo the ember mark. This is a five-letter wordmark, not a complete font or a third-party typeface.

- `geometry.js`: shared editable path definitions.
- `wordmark.svg`: lettering alone, for headings or presentation slides.
- `icon.png`: opaque 1024px launcher icon.
- `foreground.png` and `monochrome.png`: Android adaptive icon layers.
- `splash.png`: transparent emblem and wordmark for the native splash screen.
- `export.mjs`: creates the SVG and PNG exports; run `node assets/brand/export.mjs` after changing the geometry.

The UI uses warm white (#f5f3ef), ember orange (#f07842), black, and charcoal. Buttons use a darker orange (#a9401c) to keep white labels legible.

`src/EmberBrand.js` renders the same paths in the app. Headings use only the wordmark. On a fresh launch, the emblem and wordmark appear together for a minimum of 1.1 seconds while local data loads. A load failure still leads to the retry screen. Tab changes do not replay the intro.

Expo Go has its own initial loading UI. The in-app intro appears after that loading step. Native splash and launcher configuration require a new app build; verify the final OS splash behavior in a release build. See https://docs.expo.dev/versions/v57.0.0/sdk/splash-screen/.

No third-party font or logo asset was used for this identity. The name and design have not undergone trademark clearance; originality of this drawing does not establish name availability or exclusive rights.
