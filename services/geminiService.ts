
import { GoogleGenAI, Type } from "@google/genai";
import { UserData } from "../types";

export const getCyberAuditLog = async (user: UserData) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      log: "КРИТИЧЕСКАЯ ОШИБКА: API_KEY не обнаружен в системе. Переход в автономный режим.",
      status: "OFFLINE_MODE"
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, immersive "Cyber-Audit Security Log" in Russian.
      Subject: ${user.name}
      Instagram: ${user.instagram}
      Style: Cyberpunk, tech-heavy, max 140 chars.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            log: { type: Type.STRING },
            status: { type: Type.STRING }
          },
          required: ["log", "status"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Audit Log Error:", error);
    return {
      log: "ПРОТОКОЛ ПЕРЕХВАТА: Сигнал ослаблен. Прямое соединение установлено.",
      status: "BYPASS"
    };
  }
};
