🌊 OCEAN WAVE
The Multimodal Neural Interface for Clinical-Grade Accessibility
OCEAN WAVE is a dual-mode clinical intelligence platform designed to bridge the gap between human intent and environmental interaction. By unifying Intelligent AAC (Communication) and Vision Pal (Sighted Guidance), it provides a "Neural Co-Pilot" for individuals with speech, motor, and visual impairments.

🌟 Key Features
1. Intelligent AAC (Communication)
Context Cam: Uses Google AI to analyze the user's surroundings and instantly generate 5 contextually relevant emojis, reducing the cognitive load of symbol searching.

Dynamic Sentence Refinement: Converts shorthand or "broken" input (e.g., "Water want") into eloquent, natural language (e.g., "I would like some water, please") with adjustable tones (Casual, Professional, Empathetic).

Hybrid Input Logic: Seamlessly switch between AI-generated icons, manual emoji selection, and a standard keyboard.

2. Vision Pal (Sighted Guide)
Real-time Conversational AI: Powered by the Gemini Multimodal Live API, providing a low-latency video/audio stream for spatial awareness.

Medication Management: High-precision scanning of drug bottles to read dosages, expiration dates, and safety warnings—preventing errors in multi-medication households.

Document & Obstacle Reading: Conversational assistance for reading mail or navigating unfamiliar environments.

🏗️ Engineering Highlights
The "Neural Interface" Challenge
One of our primary hurdles was the Binary Audio Bridge. The Gemini Live API transmits raw PCM audio. We engineered a custom solution using the Web Audio API to handle:

Float32 to Int16 Conversion: Direct browser-level binary manipulation for real-time compatibility.

Low-Latency Video: Balancing frame rates (~2fps) with audio buffers to ensure the experience feels instantaneous without overwhelming the network.


📄 License
Distributed under the MIT License. See LICENSE for more information.

Ocean Wave — Bridging the gap between intent and the world.
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
