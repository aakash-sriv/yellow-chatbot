import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export const sendChatMessage = async (
  messages: Message[],
  systemPrompt?: string
): Promise<string> => {
  try {
    // Create model with or without system instruction
    const model = systemPrompt
      ? genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
      })
      : genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

    // Convert messages to Gemini format
    const history = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Handle empty messages array
    if (history.length === 0) {
      throw new Error("No messages to send");
    }

    const chat = model.startChat({
      history: history.slice(0, -1),
    });

    // Get the last message safely
    const lastMessage = history[history.length - 1];

    if (!lastMessage || !lastMessage.parts[0]?.text) {
      throw new Error("Invalid last message");
    }

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text;
  } catch (error: any) {
    console.error("🔥 GEMINI ERROR:", error.message);
    throw new Error("Failed to get AI response");
  }
};

/**
 * Upload file to Gemini
 * Supports: images, PDFs, audio, video
 */
export const uploadFileToGemini = async (
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> => {
  try {
    // Write buffer to temporary file path (Gemini needs file path)
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}-${filename}`);

    // Write buffer to temp file
    await fs.writeFile(tempFilePath, fileBuffer);

    // Upload to Gemini
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: mimeType,
      displayName: filename,
    });

    // Clean up temp file
    await fs.unlink(tempFilePath);

    if (!uploadResult.file.uri) {
      throw new Error("File upload failed - no URI returned");
    }

    return uploadResult.file.uri;
  } catch (error: any) {
    console.error("Gemini file upload error:", error.message);
    throw new Error("Failed to upload file to Gemini");
  }
};