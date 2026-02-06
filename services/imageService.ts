
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'cyber_car_asset_v1';

export const generateRaffleImage = async (): Promise<string | null> => {
  // Check session cache first
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) return cached;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY missing for image generation");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A high-end cinematic photo of a white 2015 Mercedes-Benz C-Class (W205), parked on a night street with rain and neon cyberpunk lights. HUD graphics overlays. Hyper-realistic, 4k.',
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        sessionStorage.setItem(CACHE_KEY, dataUrl); // Cache for session
        return dataUrl;
      }
    }
    return null;
  } catch (error) {
    console.warn("Image generation failed, using fallback:", error);
    return null;
  }
};
