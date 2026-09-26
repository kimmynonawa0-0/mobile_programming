# EMBER

A workout tracking app for logging exercises, sets, reps, and weights. Built with React Native and Expo, EMBER stores completed sessions locally and provides a searchable workout history.

**Status:** Functional prototype. No account or backend service is required.

## Features

- Start an empty workout or use a Push, Pull, Arms, or Legs template.
- Browse 48 exercises with muscle illustrations, equipment labels, search, and filters.
- Add or remove exercises, adjust sets and reps, and record optional weights in kilograms.
- Mark completed sets and save a session to History.
- Review session details and search by workout or exercise name.
- View total workouts, completed sets, and reps in Profile.

The interface uses a dark theme with EMBER branding and three bottom tabs: Workout, History, and Profile.

## Getting started

### Requirements

- Node.js 22.13 or newer and npm
- Expo Go compatible with Expo SDK 57 for testing on a phone
- A shared network connection between the computer and phone

Run these commands from the `daily-rep` directory:

```sh
npm install
npx expo start
```

Scan the QR code with Expo Go. To use the browser preview, press `w` in the terminal or run:

```sh
npm run web
```

For an Android emulator, run `npm run android`. The iOS simulator requires macOS and can be started with `npm run ios`. Emulator and simulator tooling must be installed separately.

## Logging a workout

1. Select **Start Empty Workout** or a routine template.
2. Add exercises and enter reps and optional weight for each set.
3. Check off the sets you complete.
4. Select **Finish & save workout** to save the session and open History.

Only checked sets are saved. Exercises without completed sets are omitted, and at least one completed set is required to save a workout.

The **Go back** button stays visible while scrolling. If no sets are checked, it closes the workout immediately, including any unchecked edits. If any sets are checked, it asks for confirmation before discarding the session.

Routine templates are editable starting points. They do not define a weekly training schedule.

## Local storage

Completed sessions are stored as JSON using AsyncStorage under the key `daily-rep-v1`. Data loads when the app opens; a session appears in History after its storage write succeeds.

- Saved sessions remain available after restarting the app.
- Active workouts remain available when switching tabs, but are lost on closing or reloading the app.
- Data is local to the device or browser and does not sync across devices.
- Clearing the app's storage or browser site data removes saved sessions.

The stored document retains a legacy name field for compatibility. Profile displays a fixed **Prototype User** identity; there is no name editor or authentication flow.

## Current limitations

- Saved sessions are read-only; editing and deleting history are not implemented.
- Exercises use reps and optional kilograms. Timed holds and distance-based activities are not supported.
- Session duration in History measures elapsed time from starting to saving, including breaks. It is rounded to minutes with a minimum of one minute; there is no live workout timer.
- Muscle illustrations identify representative targets, not exercise technique or every muscle involved.
- Expo Go displays its own initial loading UI before the EMBER intro. Native splash appearance must be verified in a standalone release build.

## Project structure

| File or directory | Purpose |
| --- | --- |
| `App.js` | Screens, navigation, shared state, and local storage integration |
| `src/exerciseCatalog.js` | Exercise names, equipment, and target muscle metadata |
| `src/ExercisePicker.js` | Exercise search, filters, and selection |
| `src/workouts.js` | Workout creation, validation, and summary calculations |
| `src/workouts.test.mjs` | Workout logic tests |
| `src/routines.js` | Push, Pull, Arms, and Legs templates |
| `src/RoutineIcon.js` | Vector routine illustrations |
| `src/MuscleThumbnail.js` | Target muscle thumbnails |
| `src/EmberBrand.js` | EMBER wordmark and launch intro |
| `assets/brand/` | Branding geometry, exported assets, and export script |
| `assets/muscles/` | Body illustration paths and license notices |
| `app.json` | Expo app configuration |

Application source is written in JavaScript and JSX. Files with the `.mjs` extension are JavaScript ES modules used for tests and asset generation.

## Development checks

Run the workout logic tests:

```sh
npm test
```

Check Expo dependency compatibility and generate a web build:

```sh
npx expo install --check
npx expo export --platform web
```

The web export is written to `dist/`. Generated bundles are build artifacts; make changes in the source files rather than editing bundled JavaScript.

Before a release, verify saving and reloading sessions, navigating between tabs, exercise filtering, exit confirmation, keyboard behavior, and layout on a physical device.

## Assets and credits

EMBER's wordmark, emblem, and routine icons are project vector assets. See the [branding documentation](assets/brand/README.md) for asset exports and launch configuration.

Muscle illustrations are adapted from [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter), copyright (c) 2022 ELABBASSI Hicham, under the MIT license. The [asset documentation](assets/muscles/README.md) records their source and modifications. Retain the accompanying [license notice](assets/muscles/LICENSE) when redistributing these assets.
