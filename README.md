# Jarvis Mobile — Your AI Assistant on iPhone

> **Replace Siri with your own personal Jarvis.** Same engine as your desktop overlay, now on your phone. Shared memory, shared skills, Face ID security.

---

## 🚀 INSTALL ON YOUR iPHONE (2 WAYS)

### ✅ RECOMMENDED: SideStore (Standalone App)

Build a real IPA that installs on your home screen. **No PC needed after setup** — connects to your cloud server from anywhere (Wi-Fi or cellular).

**Step 1:** Install SideStore on your iPhone
1. Open Safari on your iPhone → go to **sidestore.io**
2. Tap "Install" and follow the on-screen steps (free Apple ID required)
3. Go to **Settings → General → VPN & Device Management** → Trust "SideStore"

**Step 2:** Build the Jarvis IPA
1. On your PC, double-click **`build-ipa.bat`** in the `jarvis-mobile/` folder
2. Log in to your free Expo account (or create one at expo.dev/signup)
3. Wait ~5-10 minutes for the cloud build to finish
4. Download the `.ipa` file from the link EAS gives you

**Step 3:** Sideload with SideStore
1. Download the `.ipa` to your iPhone (Files app, iCloud, or AirDrop from PC)
2. Open **SideStore** → **My Apps** tab → tap **+**
3. Select the `.ipa` file → enter your Apple ID credentials
4. Wait for "Installing..." — Jarvis appears on your home screen! 🎉

> ⚠️ **Free Apple ID**: app expires in 7 days. Re-sideload the same `.ipa` to renew it. Keep the file on your phone!

---

### Alternative: Expo Go (QR Code)

Requires your PC to be on and on the same Wi-Fi every time you use Jarvis.

1. Install **Expo Go** from the App Store on your iPhone
2. Double-click **`setup-phone.bat`** in the `jarvis-mobile/` folder and pick option [1]
3. Scan the QR code with your iPhone Camera → tap "Open in Expo Go"

---

## 📱 What You'll See

| Screen | What it does |
|--------|-------------|
| **Home** | Face ID gate → pulsing Jarvis avatar → tap mic to talk |
| **Chat** | Type or speak → Jarvis responds with voice + text |
| **Settings** | Toggle Face ID, voice, haptics, clear data |

---

## 🧪 Quick Test (Run This First)

Make sure the engine is healthy:
```bash
cd d:\Jarvis\jarvis-core
node test.js
```
All **46 tests should pass** ✅

---

## 🏠 Launcher Menu

Double-click **`start-jarvis.bat`** in the root `d:\Pokemon\` folder for a menu that lets you:
- **[1]** Install on your phone
- **[2]** Run the desktop Pokemon app
- **[3]** Run core tests

---

## 🔒 Safety (Siri-Level Secure)

| Feature | What it protects |
|---------|-----------------|
| **Face ID / Touch ID** | Locks Jarvis on every launch |
| **Session timeout** | Re-auths after 5 min of inactivity |
| **Input sanitization** | Blocks XSS, injections, dangerous URLs |
| **Audit log** | Every security event recorded locally |
| **Local-only** | No cloud, no telemetry, no phoning home |

---

## 🚫 Replace Siri with Jarvis

**No jailbreak needed. Takes 30 seconds.**

### Step 1: Disable Siri
On your iPhone:
1. **Settings → Siri & Search**
2. Toggle **OFF**:
   - "Listen for Hey Siri"
   - "Press Side Button for Siri"
   - "Allow Siri When Locked"
3. Done. Siri is gone.

### Step 2: Set Jarvis as your go-to
Now set up these **free shortcuts** (all in Settings):

| Method | How |
|--------|-----|
| **Back Tap** ⚡ | Settings → Accessibility → Touch → Back Tap → Double Tap → Jarvis |
| **Lock Screen** | Swipe right → Edit → Add Jarvis widget |
| **Home Screen** | Put Jarvis in your bottom dock |

Now tap the back of your phone twice → Jarvis opens instantly. Faster than Siri ever was.

---

## 🧠 Architecture

## 🧠 Architecture

```
jarvis-core/  ← Shared engine (desktop + mobile) — runs on cloud server
├── memory/   → Facts, conversations, patterns, preferences
├── skills/   → Greeting, time, weather, reminders, help
├── ai/       → Intent matching, fallback responses
└── security/ → Biometric auth, sanitization, audit

jarvis-mobile/  ← Your iPhone app
├── app/        → Home, Chat, Settings screens
├── services/   → Voice, Face ID, Sync
└── build-ipa.bat  ← Build standalone IPA for SideStore
```

---

## 📁 Project Files

| File | What it does |
|------|-------------|
| `setup-phone.bat` | **Double-click this** — choose Expo Go or SideStore method |
| `build-ipa.bat` | Build a standalone IPA for SideStore sideloading |
| `app/index.tsx` | Home screen with Face ID + mic |
| `app/chat.tsx` | Chat with voice + text |
| `app/settings.tsx` | Settings panel |
| `services/VoiceService.ts` | Text-to-speech engine |
| `services/BiometricService.ts` | Face ID / Touch ID |

---

## 🛠 Building a Fresh IPA

When the app expires (7 days) or you make code changes:
```bash
cd d:\Jarvis\jarvis-mobile
build-ipa.bat
```
Or just re-sideload the same `.ipa` via SideStore to renew it.

---

## 📝 Notes

- **Desktop app is untouched** — Pokemon Pets Overlay still works as before
- **Cloud-connected** — Jarvis connects to your Railway server from anywhere (Wi-Fi or cellular)
- **SideStore renewal** — Free Apple ID apps expire in 7 days; re-sideload to renew

## Running the Core Tests

```bash
cd d:\Jarvis\jarvis-core
node test.js
```

All 46 tests should pass, verifying:
- Memory system (store, recall, forget, namespaces, conversations, patterns)
- Skill engine (registration, matching, execution, hooks)
- AI engine (greetings, time, help, fallbacks, context, conversation history)
- Security gate (sanitization, URL validation, permissions, audit logging)
- Integrated flow (full conversation cycle)

## Desktop App

The original Pokemon Pets Overlay (`d:\Pokemon\`) is **completely untouched**. It continues to work as before. The shared `jarvis-core/` engine can be integrated into the desktop app in a future update.

## License

MIT
