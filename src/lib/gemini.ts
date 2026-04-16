import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
Você é um assistente técnico especializado em suporte de TI e logística de entrega de equipamentos para a OS de entregas.
Seu papel é ajudar o técnico com dúvidas sobre:
1. Identificação de TAGs de equipamentos (Desktop e Notebook).
2. Diferenças técnicas entre modelos comuns.
3. Processos de preenchimento do formulário de entrega.
4. Dúvidas sobre como coletar a assinatura do cliente corretamente.
5. Orientações sobre geração de PDF e compartilhamento.

Mantenha suas respostas curtas, profissionais e em Português do Brasil.
Você faz parte de um aplicativo móvel, então seja conciso.
`;

export async function getGeminiResponse(history: ChatMessage[]) {
  try {
    const chat = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const response = await chat;
    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao falar com o assistente. Verifique sua conexão.";
  }
}
