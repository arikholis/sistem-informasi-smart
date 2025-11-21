import { GoogleGenAI } from "@google/genai";
import { UserRole } from "../types";

// Initialize the client with the API key from environment variables
// Note: In a real production app, this should be proxied through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIResponse = async (
  prompt: string,
  role: UserRole,
  contextData?: string
): Promise<string> => {
  try {
    const roleInstruction = getSystemInstructionForRole(role);
    
    const fullPrompt = `
      Context Data: ${contextData || 'No specific context provided.'}
      User Question: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: roleInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please try again.";
  }
};

const getSystemInstructionForRole = (role: UserRole): string => {
  const base = "You are 'EduBot', a helpful AI assistant integrated into the EduNexus School Information System.";
  
  switch (role) {
    case UserRole.ADMIN:
      return `${base} You are assisting a System Administrator. Provide technical summaries, SQL queries if asked (hypothetically), and system optimization tips. Be concise and professional.`;
    case UserRole.PRINCIPAL:
      return `${base} You are assisting the School Principal. Focus on high-level analytics, teacher performance summaries, and strategic advice for school management. Tone should be executive and formal.`;
    case UserRole.VICE_PRINCIPAL:
      return `${base} You are assisting the Vice Principal. Focus on scheduling logistics, event planning, student discipline policies, and operational efficiency.`;
    case UserRole.TEACHER:
      return `${base} You are assisting a Teacher. Help with lesson planning, grading rubrics, student engagement strategies, and classroom management advice.`;
    case UserRole.STUDENT:
      return `${base} You are assisting a Student. Explain complex academic concepts simply, help with study schedules, and provide motivation. Do NOT do their homework for them, but guide them.`;
    default:
      return base;
  }
};