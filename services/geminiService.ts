
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export const generateFollowUpMessage = async (clientName: string, serviceName: string = "corte de cabelo infantil"): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve(`Olá ${clientName}! 😊 Já está na hora do próximo ${serviceName} do seu pequeno(a)? Adoraríamos revê-los! Agende um horário conosco. ✨`);
  }
  try {
    const prompt = `Crie uma mensagem curta, amigável e encantadora para WhatsApp, destinada a ${clientName}. O objetivo é lembrá-lo(a) que já faz um tempo desde o último ${serviceName} de seu filho(a) e convidá-lo(a) a agendar um novo horário. Use emojis infantis e um tom divertido. Não inclua links ou chamadas para clicar em botões, apenas o texto da mensagem. Seja breve, no máximo 3 frases.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
       config: {
        // Omitting thinkingConfig to use default (enabled for higher quality)
        temperature: 0.7, // Creative but not too random
      }
    });

    const text = response.text.trim();
    return text || `Olá ${clientName}! 😊 Hora de renovar o visual do seu pequeno(a)! Que tal agendar o próximo ${serviceName}? Estamos te esperando! ✂️🧸`;

  } catch (error) {
    console.error("Error generating follow-up message with Gemini:", error);
    // Fallback message
    return `Olá ${clientName}! 😊 Já está na hora do próximo ${serviceName} do seu pequeno(a)? Adoraríamos revê-los! Agende um horário conosco. ✨`;
  }
};

export const generateGeneralQueryResponse = async (query: string): Promise<{text: string, groundingChunks?: any[]}> => {
  if (!API_KEY) {
    return Promise.resolve({text: "Desculpe, o serviço de IA não está disponível no momento."});
  }
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: query,
      config: {
        tools: [{googleSearch: {}}], // Enable Google Search grounding
      },
    });

    return {
        text: response.text,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };

  } catch (error) {
    console.error("Error with general Gemini query:", error);
    return {text: "Ocorreu um erro ao processar sua pergunta. Tente novamente."};
  }
};
