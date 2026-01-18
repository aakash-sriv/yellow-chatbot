// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleAIFileManager } from "@google/generative-ai/server";
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);
// interface Message {
//   role: "system" | "user" | "assistant";
//   content: string;
// }
// /**
//  * Send chat messages to Gemini 2.0 Flash (FREE tier)
//  */
// export const sendChatMessage = async (
//   messages: Message[],
//   systemPrompt?: string
// ): Promise<string> => {
//   try {
//     // Create model with or without system instruction
//     const model = systemPrompt
//       ? genAI.getGenerativeModel({
//           model: "gemini-2.0-flash-exp",
//           systemInstruction: systemPrompt,
//         })
//       : genAI.getGenerativeModel({
//           model: "gemini-2.0-flash-exp",
//         });
//     // Convert messages to Gemini format
//     const history = messages
//       .filter((m) => m.role !== "system")
//       .map((m) => ({
//         role: m.role === "assistant" ? "model" : "user",
//         parts: [{ text: m.content }],
//       }));
//     // Handle empty messages array
//     if (history.length === 0) {
//       throw new Error("No messages to send");
//     }
//     const chat = model.startChat({
//       history: history.slice(0, -1),
//     });
//     // Get the last message safely
//     const lastMessage = history[history.length - 1];
//     if (!lastMessage || !lastMessage.parts[0]?.text) {
//       throw new Error("Invalid last message");
//     }
//     const result = await chat.sendMessage(lastMessage.parts[0].text);
//     const text = result.response.text();
//     if (!text) {
//       throw new Error("Empty response from Gemini");
//     }
//     return text;
//   } catch (error: any) {
//     console.error("Gemini API error:", error.message);
//     throw new Error("Failed to get AI response");
//   }
// };
// /**
//  * Upload file to Gemini (Supports images, PDFs, audio, video)
//  * FREE tier supports up to 2GB file uploads!
//  */
// export const uploadFileToGemini = async (
//   fileBuffer: Buffer,
//   filename: string,
//   mimeType: string
// ): Promise<string> => {
//   try {
//     // Upload file with proper parameters
//     const uploadResult = await fileManager.uploadFile(fileBuffer, {
//       mimeType: mimeType,
//       displayName: filename,
//     });
//     if (!uploadResult.file.uri) {
//       throw new Error("File upload failed - no URI returned");
//     }
//     return uploadResult.file.uri;
//   } catch (error: any) {
//     console.error("Gemini file upload error:", error.message);
//     throw new Error("Failed to upload file to Gemini");
//   }
// };
// /**
//  * Kept for backward compatibility (old function name)
//  */
// export const uploadFileToOpenAI = uploadFileToGemini;
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const sendChatMessage = async (messages, systemPrompt) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });
        const history = messages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n");
        const prompt = systemPrompt
            ? `SYSTEM: ${systemPrompt}\n${history}\nASSISTANT:`
            : `${history}\nASSISTANT:`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text;
    }
    catch (error) {
        console.error("🔥 GEMINI ACTUAL ERROR:", error);
        throw new Error("Failed to get AI response");
    }
};
//# sourceMappingURL=openaiService.js.map