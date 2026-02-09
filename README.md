| Phase | Feature | Action 🕹️ | Expected Result ✅ |
| :--- | :--- | :--- | :--- |
| Phase 1 | Eden Assistant (Blind Access) | Refresh page and Tap Anywhere on the background. | "Eden speaks: ""Hi there, you're on the welcome page."" A second tap anywhere auto-routes to Vision Pal." |
| Phase 2 | Navigation Hub | Hover over the floating A and E buttons at the bottom. | "Tooltips appear: ""OCEAN WAVE AAC"" (Communication) and ""VISION PAL"" (Live Eyes)." |
| Phase 3 | AAC Terminal (Speech) | Select symbols (e.g., EAT + Hungry) then hit REFINE. | "AI transforms ""Hungry Eat"" into ""I am hungry and would like to eat."" Clicking TALK plays high-quality audio." |
| Phase 3.1 | Context Cam (Visual AAC) | Click CONTEXT CAM and snap a photo of a nearby object. | "Gemini 3 analyzes the scene and populates the keyboard with relevant emojis and words (e.g., 🥥 for a mug)." |
| Phase 4 | Vision Pal (Live AI) | Click the E icon and speak: ""Eden, what am I holding?"" | Gemini Live processes the video stream and describes your surroundings with sub-second audio latency. |
| Phase 4.1 | System Control | Toggle the Mute icon or click EXIT SESSION. | The AI stops listening or the camera stream terminates, returning you safely to the Dashboard. |

View your app https://ocean-wave-voice-vision-416455034441.us-west1.run.app

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
