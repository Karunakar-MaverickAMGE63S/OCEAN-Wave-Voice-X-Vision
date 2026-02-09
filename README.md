
🛠️ Ocean Wave: Official Testing Protocol
Prerequisites: > 💻 Hardware: Device with Microphone + Camera. 🌐 Browser: Google Chrome (Best for Web Audio/Gemini Live). 🔊 Audio: Ensure volume is ON.
Step,Action 🖐️,Expected Result ✅
1,Refresh Page,Deep Navy/Magnum Blue screen appears.
2,Listen 👂,"Within 2s, a natural voice says: ""Hi there, you're on the welcome page."""
3,Tap Anywhere,Screen transitions to Sign In gateway.
4,Gateway Intro,"Voice says: ""Tap anywhere to open Vision Pal... I'm your Eden Assistant."""
5,Test Blind Mode,Click the Background (not the button).
6,Verify Auto-Launch,"Voice says ""Opening Vision Pal"" and camera starts automatically."
7,Sighted Entry,"Refresh, then click the ""Enter as Guest"" button. Dashboard opens quietly."

Step,Action 🖱️,Expected Result ✅
1,Check UI,Clean blue hub with two floating icons: A and E.
2,Hover (Desktop),"A shows ""OCEAN WAVE AAC""; E shows ""VISION PAL""."

Step,Action 🔠,Expected Result ✅
1,Build Sentence,Tap EAT ➡️ Hungry ➡️ Water.
2,Check Bar,"Top text displays: ""Hungry Water""."
3,Refine AI ✨,"Click REFINE. Text changes to: ""I am hungry and need water."""
4,Talk 🗣️,Click TALK. High-quality Gemini voice speaks the full sentence.
5,Predictions,"Open KEYS, type ""HEL"". Pink boxes show ""HELP"" or ""HELLO""."
6,Context Cam 📸,"Snap a photo of a cup. Keyboard populates with 🥤, 🥛, or ""Drink""."

Step,Action 👁️,Expected Result ✅
1,Launch,Click the E icon. Grant Camera/Mic permissions.
2,Status Check,"Top left reads: ""LIVE CONNECTION ACTIVE""."
3,Ask Eden 🎙️,"Hold a pen and ask: ""Eden, what is in my hand?"""
4,Verify Response,AI describes the object via audio within 1-3 seconds.
5,Mute Test 🔇,Tap Mic Icon (turns Blue). Ask a question. AI stays silent.
6,Exit,Click EXIT SESSION. Camera light turns off; returns to Hub.


To help you win that $50,000 Grand Prize, your testing instructions need to be as "frictionless" as the app itself. Judges often have dozens of projects to review, so if they can't test yours in under 60 seconds, you lose momentum.

Since you have an "Eden Assistant" for vision loss and a "Context Cam" for AAC users, you should provide two clear paths for testing.

🛠 Ocean Wave: Testing Instructions
Test URL: [Link to your deployed site/app]

Credentials: No login required (Instant Access).

Path A: For Vision Loss (The "Eden" Experience)
Open the app. You will be on the landing page.

Tap anywhere on the screen. Do not look for a specific button.

Listen for Eden. You will hear our AI agent introduce herself and explain where you are.

Tap again. The app will automatically route you to Vision Pal.

Interactive Test: Point your camera at an object (like a coffee mug or a medicine bottle) and ask out loud, "Eden, what is in front of me?"

Path B: For Voice Loss (AAC & Context Cam)
Navigate to the AAC Board. (Or ask Eden: "Eden, open the communication board").

Standard Input: Tap the icons for "Water" and "Want." Notice how the Refine Engine automatically speaks: "I would like some water, please."

The Context Cam Test: Tap the camera icon. Take a photo of your current workspace.

Dynamic Update: Watch as the keyboard instantly populates with relevant words like "Laptop," "Coffee," or "Work."

📋 Technical Setup for Judges
Camera Access: Please ensure you grant camera and microphone permissions when prompted.

Audio: Turn your volume up! Ocean Wave is a voice-first experience.

Environment: For the best "Vision Pal" experience, ensure you are in a well-lit room.

View your app https://ocean-wave-voice-vision-416455034441.us-west1.run.app

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
