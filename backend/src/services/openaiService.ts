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
    // Create model (globally switched to 2.5-flash-lite as requested)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      ...(systemPrompt && { systemInstruction: systemPrompt }),
    });

    console.log("--- SEND CHAT MESSAGE ---");
    console.log("System Prompt:", systemPrompt);
    console.log("Messages count:", messages.length);

    // Convert messages to Gemini format with sanitization (merge consecutive same-role messages)
    const rawHistory = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const history: { role: string; parts: { text: string }[] }[] = [];

    for (const msg of rawHistory) {
      const lastMsg = history[history.length - 1];
      if (lastMsg && lastMsg.role === msg.role) {
        // Merge with previous message
        if (lastMsg.parts[0] && msg.parts[0]) {
          lastMsg.parts[0].text += "\n\n" + msg.parts[0].text;
        }
      } else {
        history.push(msg);
      }
    }

    // Ensure history starts with user (Gemini requirement)
    const firstMsg = history[0];
    if (firstMsg && firstMsg.role === 'model') {
      history.unshift({
        role: 'user',
        parts: [{ text: 'Please follow these instructions:' }] // Better dummy message
      });
    }

    console.log("Sanitized history length:", history.length);

    // Handle empty messages array
    if (history.length === 0) {
      throw new Error("No messages to send");
    }

    const chat = model.startChat({
      history: history.slice(0, -1),
    });

    // Get the last message safely
    const lastMessage = history[history.length - 1];

    console.log("Sending message:", lastMessage?.parts?.[0]?.text);

    if (!lastMessage || !lastMessage.parts[0]?.text) {
      console.error("Invalid last message structure:", JSON.stringify(lastMessage));
      throw new Error("Invalid last message");
    }

    const result = await chat.sendMessage(lastMessage.parts[0].text!);
    const text = result.response.text();
    console.log("Gemini response success");

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text;
  } catch (error: any) {
    console.error("🔥 GEMINI ERROR:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));

    // Log to file for debugging
    try {
      const fs = await import('fs');
      fs.appendFileSync('gemini-error.log', `\n[${new Date().toISOString()}] ERROR: ${error.message}\nSTACK: ${error.stack}\n`);
    } catch (e) {
      console.error("Failed to write log file");
    }

    throw new Error("Failed to get AI response: " + error.message);
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