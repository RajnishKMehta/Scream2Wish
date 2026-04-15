<div align="center">

# <img align="right" src="assets/images/splash-light.png" alt="blue mermaid" height="64" width="auto" />Scream2Wish<img align="left" src="assets/images/splash-dark.png" alt="red mermaid" height="64" width="auto" />

<img align="center" src="assets/images/logo16x9.png" alt="Scream2Wish" height="54" width="auto" />

*A submission for the [DEV April Fools Challenge 2026](https://dev.to/challenges/aprilfools-2026)*

[![Platform: Android 10+](https://img.shields.io/badge/Platform-Android_10+-green.svg?style=plastic)](https://github.com/RajnishKMehta/Scream2Wish/releases/latest)
[![release version](https://img.shields.io/github/v/release/RajnishKMehta/Scream2Wish?include_prereleases&style=plastic&logo=android&color=ef4444&cacheSeconds=300
)](https://github.com/RajnishKMehta/Scream2Wish/releases/latest)
[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000020?logo=expo&style=plastic)](https://expo.dev)

[**📱 Download APK**](https://github.com/RajnishKMehta/Scream2Wish/releases/latest/download/app.apk) · [**🌐 Wishes Board**](https://rajnishkmehta.github.io/Scream2Wish) · [**📦 Wishes Repo**](https://github.com/RajnishKMehta/Scream2Wish-wishes)

</div>

## What Is This?

Scream2Wish is a completely 100% useful👀, mildly chaotic Android app that forces you to **scream as loud as you can** to break a genie's lamp and only then lets you make a wish.

Your wish gets sent to the internet via a Cloudflare Worker → GitHub Actions pipeline and lives forever in a public repo. In return, you get to read a random stranger's note. Whether that's comforting or unsettling is entirely up to you.

#### It is a fun project made for timepass and ***learn***.

---

## Download

[![Download APK](https://img.shields.io/badge/Download%20APK-Latest%20Release-ef4444?style=for-the-badge&logo=android)](https://github.com/RajnishKMehta/Scream2Wish/releases/latest/download/app.apk)

Install on Android 10+ devices (sideloading required enable "Install from unknown sources" in settings).

---

## The Full Experience

### Step 1 — Permissions Gate
The app opens with an animated permission screen asking for microphone access (to detect your screams) and vibration (to annoy you while you're idle). You cannot proceed without granting both. The back button is "defective."

### Step 2 — joke Login
A suspiciously serious login screen asks for your **real name** and a **password**. The name is used throughout the experience. The password has a specific validation rule figure it out yourself. Enter it wrong enough times and a video overlay starts playing in the background to make you regret your life choices. A sound effect also plays. You have been warned.

### Step 3 — The Lamp
A countdown from 5. Then the main event.

A genie lamp sits in the center of the screen. A vertical amplitude meter in the top right corner reflects your scream in real time. **The louder you scream, the faster the lamp breaks.** Stop screaming for even a second and the lamp fully resets to normal. The phone vibrates at you constantly while you're silent encouragement.

- **25% progress** — the lamp starts cracking. The genie speaks to you via text-to-speech.
- **55% progress** — the lamp is half destroyed.
- **100% progress** — the lamp shatters and one of three characters emerges:

| Value | Character | Probability |
|-------|-----------|-------------|
| `0` | <img align="left" src="assets/images/in/red_mermaid.png" alt="Red Mermaid" height="48" width="auto" /> Red Mermaid (yes, from genie lamp😁) | 30% |
| `1` | <img align="left" src="assets/images/in/ginie.png" alt="Genie" height="48" width="auto" /> Genie | 35% |
| `2` | <img align="left" src="assets/images/in/blue_mermaid.png" alt="Blue Mermaid" height="48" width="auto" /> Blue Mermaid | 35% |

### Step 4 — Make Your Wish
The character that emerged from the lamp greets you via text-to-speech and asks you to type your wish. Then it asks you to leave a note for the world. Both steps have a skip option, but after all that screaming, why would you?

### Step 5 — The End
The end screen shows two tabs: **Random Note** (default) and **My Note**.

**Random Note** fetches a stranger's message from the public wishes repo — their name, their note, and when they screamed. If the fetch fails, you see the error reason and a retry button.

**My Note** shows the note you left, plus the live send status. The app automatically retries sending up to **6 times** per session (immediate → 3 s → 5 s → 5 s → …). The attempt counter lives in memory and resets on every app open, so you always get 6 fresh auto-retries. If all 6 fail, a **Retry send** button appears. A 401/403 auth error stops auto-retries for the session (but manual retry still works and auto-retry resumes on next open). Once sent, a green indicator confirms your note is out in the world.

You can share your wish at any point.

That's it. There is no restart button. The app is done with you.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Android App (Expo)                        │
│                                                                  │
│  Permission Gate → Fake Login → Scream Main → End Screen        │
│                                                                  │
│  On every open:  trySendWish() runs in background               │
│  On end screen:  fetchAndStoreRandomWish() runs in background    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ POST  (wish + note + name)
                               │ Header: x-api-key
                               ▼
              ┌────────────────────────────────┐
              │   Cloudflare Worker             │
              │   scream2wish.rajnishkmehta     │
              │   .workers.dev                  │
              │                                 │
              │  Validates API key              │
              │  Forwards repository_dispatch   │
              │  to GitHub API                  │
              └────────────────┬───────────────┘
                               │ repository_dispatch event
                               ▼
              ┌────────────────────────────────┐
              │   GitHub Actions               │
              │   (Scream2Wish-wishes repo)    │
              │                                │
              │  wish-handler.yml              │
              │  Generates a unique ID         │
              │  Saves wish JSON to repo       │
              │  Updates index.json            │
              └────────────────┬───────────────┘
                               │ committed to main branch
                               ▼
              ┌────────────────────────────────┐
              │   Public JSON Store             │
              │   /wishes/index.json           │  ← array of all IDs
              │   /wishes/{id}.json            │  ← individual wish
              └──────────┬─────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
      App reads     Website reads  Anyone can
      random wish   all wishes     read the raw
      on end screen publicly       GitHub JSON
```

### Why a Cloudflare Worker in the middle?

You cannot safely embed a GitHub token inside a mobile APK it would be publicly extractable. The Cloudflare Worker holds the GitHub token securely as an environment secret. The app only needs a rotating API key to talk to the Worker, which is far easier to rotate without a new app release.

#### Why still use an API key if it can be extracted from the APK?

Yes, an API key inside an APK isn’t fully secure and can be extracted with enough knowledge. But it still adds a useful layer of protection.
Without any key, the API would be completely open and anyone could spam it easily. Requiring a key creates a basic barrier that prevents casual misuse and automated abuse.
It’s not perfect security, but **it’s a practical way to reduce spam and keep things under control.**

---

## Tech Stack

### App
| Tech | Purpose |
|------|---------|
| [Expo](https://expo.dev) + [React Native](https://reactnative.dev) | Core framework |
| [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) | Real-time microphone metering for scream detection |
| [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/) | Text-to-speech for the genie / mermaid character |
| [expo-video](https://docs.expo.dev/versions/latest/sdk/video/) | Punishing video overlay on the login screen |
| [expo-router](https://expo.github.io/router) | File-based navigation |
| [expo-updates](https://docs.expo.dev/eas-update/introduction/) | OTA updates — no store release required for fixes |
| [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) | Fast local key-value storage |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | Smooth animations |
| [lucide-react-native](https://lucide.dev) | Icons |

### Infrastructure
| Tech | Purpose |
|------|---------|
| [Cloudflare Workers](https://workers.cloudflare.com) | Secure API proxy between app and GitHub |
| [GitHub Actions](https://github.com/features/actions) | Wish persistence pipeline |
| [GitHub Pages](https://pages.github.com) + [Vite](https://vitejs.dev) | Public wishes board website |
| [EAS Build](https://docs.expo.dev/build/introduction/) | Automated APK builds via GitHub Actions |

---

## Local Storage Reference

| Key | Type | Value | Description |
|-----|------|-------|-------------|
| `name` | `string` | any | User's real name from login |
| `ginie` | `number` | `0` / `1` / `2` | Which character emerged from the lamp (0 = Red Mermaid, 1 = Genie, 2 = Blue Mermaid) |
| `isginiereleased` | `boolean` | `true` / `false` | Whether the lamp was fully broken. Gates re-entry into main/index screens. |
| `mywish` | `string` | any | The wish the user typed |
| `mynote` | `string` | any | The user's personal note (required, not optional) |
| `iscompleted` | `boolean` | `true` / `false` | Whether the user completed the wish + note flow |
| `issent` | `boolean` | `true` / `false` | Whether the wish was successfully sent to the server |
| `rnote` | `string` | any | A random stranger's note fetched from the wishes repo |
| `rnotefrom` | `string` | any | The name of who wrote that note |
| `rnoteat` | `string` | unix ms as string | When that stranger screamed (displayed as human-readable local time) |

---

## Running Locally

**Prerequisites:** Node.js, pnpm, an Android device (emulators won't work — no real mic metering)

```bash
# Clone the repo
git clone https://github.com/RajnishKMehta/Scream2Wish.git
cd Scream2Wish

# Install dependencies
pnpm install

# Set environment variables
# Create a .env file:
# EXPO_PUBLIC_WISH_WORKER_URL=https://scream2wish.rajnishkmehta.workers.dev
# EXPO_PUBLIC_WISH_WORKER_API=your_api_key_here

# Start Expo dev server
pnpm dlx expo start
```

To build a standalone APK:

```bash
# Requires EAS CLI and an Expo account
eas build --platform android --profile preview
```

---

## Deploying the Worker

The Cloudflare Worker lives in `action-trigger-worker/`. It requires two environment secrets set in the Cloudflare dashboard:

| Secret | Description |
|--------|-------------|
| `GITHUB_TOKEN` | A GitHub fine-grained token with `repo` write access to `Scream2Wish-wishes` |
| `API_KEY` | The API key the app uses to authenticate with the Worker |

```bash
cd action-trigger-worker
pnpm install
pnpm dlx wrangler deploy
```

---

## Related Repos

| Repo | Description |
|------|-------------|
| [Scream2Wish](https://github.com/RajnishKMehta/Scream2Wish) | This repo: app + worker |
| [Scream2Wish-wishes](https://github.com/RajnishKMehta/Scream2Wish-wishes) | Public JSON store of all submitted wishes |

---

## Why Does This Exist?

The [DEV April Fools Challenge 2026](https://dev.to/challenges/aprilfools-2026) prompt was simple: build something completely useless or silly. Something that makes people ask *"why on earth did they build this?"*

The answer here is: because it required a scream-detection algorithm, a Cloudflare Worker, a GitHub Actions pipeline, three different characters (two of which are mermaids coming out of a lamp), text-to-speech, real-time vibration feedback, fake login validation, OTA updates, and a public wishes board all in service of letting someone type a wish into their phone.

It is overengineered on purpose. It is useless on purpose. And it absolutely works.

---

## License

[MIT](./LICENSE) - free to use, fork, or scream at.

---

<div align="center">

Made with chaos and questionable priorities by [Rajnish Mehta](https://github.com/RajnishKMehta)

[![GitHub](https://img.shields.io/badge/GitHub-RajnishKMehta-181717?logo=github)](https://github.com/RajnishKMehta)
[![Dev.to](https://img.shields.io/badge/Dev.to-RajnishKMehta-0A0A0A?logo=devdotto)](https://dev.to/RajnishKMehta)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-RajnishKMehta-0A66C2?logo=linkedin)](https://linkedin.com/in/RajnishKMehta)
[![Twitter](https://img.shields.io/badge/Twitter-RajnishKMehta-1DA1F2?logo=twitter)](https://twitter.com/RajnishKMehta)
[![Instagram](https://img.shields.io/badge/Instagram-RajnishKMehta-E4405F?logo=instagram)](https://instagram.com/RajnishKMehta)

</div>
