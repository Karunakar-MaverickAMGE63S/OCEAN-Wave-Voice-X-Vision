
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { RefineTone } from "../types";

const API_KEY = process.env.API_KEY || "";

// Initialize AI Client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const refineSentence = async (text: string, tone: RefineTone): Promise<string> => {
  if (!text.trim()) return "";
  
  const model = "gemini-3-flash-preview";
  
  const prompt = `Refine the following broken speech or AAC input into a natural, gramatically correct English sentence.
  
  Input: "${text}"
  Tone: ${tone}
  
  Return ONLY the refined sentence as a JSON string under the key "refined".`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refined: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.refined || text;
    }
    return text;
  } catch (error) {
    console.error("Refinement failed:", error);
    return text;
  }
};

export const generateSpeech = async (text: string, tone: RefineTone): Promise<string | null> => {
  if (!text.trim()) return null;

  // Map Tones to specific Gemini Voices to match "Peaceful American Woman" request
  // Available Voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
  // 'Kore' and 'Zephyr' are the most feminine/soothing.
  let voiceName = 'Zephyr'; // Default / Casual

  switch (tone) {
    case RefineTone.PROFESSIONAL:
      voiceName = 'Kore'; // Clear, authoritative but female
      break;
    case RefineTone.EMPATHETIC:
      voiceName = 'Zephyr'; // Soft, soothing
      break;
    case RefineTone.CASUAL:
    default:
      voiceName = 'Zephyr';
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;

  } catch (error) {
    console.error("TTS Generation failed:", error);
    return null;
  }
};

export const predictNextWords = async (text: string): Promise<string[]> => {
  if (!text.trim()) return [];
  
  const model = "gemini-3-flash-preview";
  
  // Prompt optimized for AAC context: fast, conversational, simple predictions
  const prompt = `Predict the next 3 most likely words to follow this text input: "${text}". 
  Context: AAC device for communication assistant.
  Output: JSON Array of 3 strings. Example: ["word1", "word2", "word3"]`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Prediction failed:", error);
    return [];
  }
};

export const getContextEmojis = async (base64Image: string): Promise<string[]> => {
  const model = "gemini-3-flash-preview";

  const prompt = `Analyze this image and identify the main object, action, or context.
  Provide exactly 5 distinct emojis that best represent this context for an AAC (Augmentative and Alternative Communication) user.
  Return only a JSON array of 5 emoji strings. Example: ["🍎", "🍽️", "🤤", "🥤", "🧺"]`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return ["❓", "🖼️", "⚠️", "🔄", "❌"];
  } catch (error) {
    console.error("Vision Analysis failed:", error);
    return ["❓", "🖼️", "⚠️", "🔄", "❌"];
  }
};
