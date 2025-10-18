import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (prompt: string, mode: 'quality' | 'speed'): Promise<string | null> => {
  try {
    if (mode === 'quality') {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
    } else { // Speed mode
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    return null;
  } catch (error) {
    console.error(`Error generating image with Gemini API (Mode: ${mode}):`, error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("Invalid API Key. Please check your configuration.");
    }
    throw new Error("Failed to generate image. The model may have refused the prompt.");
  }
};
