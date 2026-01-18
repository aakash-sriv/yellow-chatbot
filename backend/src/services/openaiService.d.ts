interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}
export declare const sendChatMessage: (messages: Message[], systemPrompt?: string) => Promise<string>;
export {};
//# sourceMappingURL=openaiService.d.ts.map