interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}
export declare const sendChatMessage: (messages: Message[], systemPrompt?: string) => Promise<string>;
/**
 * Upload file to Gemini
 * Supports: images, PDFs, audio, video
 */
export declare const uploadFileToGemini: (fileBuffer: Buffer, filename: string, mimeType: string) => Promise<string>;
export {};
//# sourceMappingURL=openaiService.d.ts.map