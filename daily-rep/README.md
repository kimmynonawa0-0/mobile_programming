# EMBER prototype

A React Native / Expo prototype for **Daily Workout & Rep Tracker**. The dark interface takes inspiration from the supplied workout screenshots.

## Run

Use Node.js 22.13 or newer. From this folder:

```sh
npm install
npm start
```

Scan the QR code with an Expo Go version compatible with SDK 57. The computer and phone should be on the same network. For a browser preview, run `npm run web`. Android emulator users can run `npm run android`; the iOS simulator requires macOS.

## Three tabs

EMBER uses a custom vector wordmark and ember emblem. The logo/name intro plays on launch, while screen headers show only the name. See [branding assets and launch behavior](assets/brand/README.md) for editing/export instructions and Expo Go limitations.

- **Workout:** start an empty session or a quick-start template, search the exercise list, add/remove exercises, edit reps and optional kilograms, add sets, check off completed sets, and save.
- **History:** search saved sessions, see aggregate counts, and open a session's exercise/set details.
- **Profile:** edit a local display name and view workout, rep, and minute totals. This is not an account.

Two tabs (Workout and History) would also satisfy the core topic. Three are used here to give the profile from the references a useful place without crowding the logging screen.

## Storage and scope

The routine shortcuts are **Bodyweight** and **With equipment**. The Add Exercise picker includes offline muscle thumbnails, target labels, and equipment/muscle filters. Thumbnail artwork is adapted from the MIT-licensed react-native-body-highlighter project; see [asset credits and license](assets/muscles/README.md). The images illustrate target muscles rather than exercise technique.

There is no server, authentication, user database, or SQLite setup. AsyncStorage stores one JSON document (`daily-rep-v1`) with a display name and completed sessions on the current device/browser. Saving awaits the storage write before updating history, and failures show a retryable message. Clearing app/browser data removes these records; they do not sync across devices.

Unfinished workouts remain available when switching tabs but are not persisted after closing/reloading the app. Only checked sets are saved; uncompleted exercises are omitted. Session duration is elapsed time rounded to minutes, minimum one minute. Templates are fixed starting points, and saved sessions are read-only in this prototype.

## Code walkthrough for the technical defense

- `App.js`: reusable UI components, the three screens, navigation, and shared data/storage state.
- `src/workouts.js`: exercise catalog, draft construction, validation, and summary calculations.
- `src/workouts.test.mjs`: checks for validation, completed-set filtering, totals, and preserving the editable draft.
- `app.json`: Expo app name, appearance, and platform configuration.

`View` groups elements; Flexbox (`flex`, `flexDirection`, `gap`) controls layout. `Text` displays labels; `TextInput` captures names, reps, and weight; `Pressable` handles actions and checkbox feedback. `ScrollView` contains workout forms, while `FlatList` renders exercise search and history lists. `Modal` presents the picker, confirmation, and session details with Android back handling. Safe-area and keyboard components keep controls usable around system UI.

React `useState` updates the screen after input. Context shares saved data between tabs. React Navigation's bottom-tab navigator keeps navigation state and preserves the mounted workout screen. AsyncStorage loads once on launch and saves JSON on explicit user actions. A ref locks concurrent saves to avoid duplicate submissions.

## Verify

```sh
node --test src/workouts.test.mjs
npx expo install --check
npx expo export --platform web
```

Manual demonstration:

1. Start an empty workout and try saving: a validation message should appear.
2. Add Push-ups, enter 12 reps, check the first set, then switch tabs and return. The draft should remain.
3. Save the workout. History should show one session, one set, and 12 reps.
4. Open the session and check its details. Search for Push-ups.
5. Save a display name in Profile. Reload and verify both the name and completed session remain.
6. Start a template, add a set, remove an exercise, and test both canceling and confirming discard.
7. On a phone, check the number keyboard, scrolling, bottom tabs, and Android back behavior in modals.

Expo reference: https://docs.expo.dev/versions/v57.0.0/
