//@ts-ignore
let ollamaStreaming: boolean = false;
let personality: string = "NO EMOJIS."

type chatMessage = {
    role: "user" | "assistant" | "system";
    content: string
};

/**
 * @param newPersonality This parameter should contain a string with the new personality the Ollama model should use.
 * **/
export function modifyAIPersonality(newPersonality: string) {
    if (!newPersonality) return;
    personality = newPersonality;
}

/**
 * @param status This parameter should contain a boolean (whether true or false) to modify whether Ollama-streaming should be enabled or disabled.
 * **/
export function toggleOllamaStreaming(status: boolean) {
    ollamaStreaming = status;
}

/**
 * @param message This parameter should contain a string with the message content that should be sent to the Ollama AI model.
 * @param conversationHistory This parameter should contain a array of type 'chatMessage' and is the conversation history to be given to the Ollama model so responses can be based of the conversations previous messages.
 * @param onToken
 * @returns The AI's response to the message.
 * **/
export async function ollamaCommunication(
    //@ts-ignore
    message: string,
    conversationHistory?: chatMessage[],
    onToken?: (token: string) => void
): Promise<string> {
    const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "qwen3:8b",
            messages: [
                { role: "system", content: personality },
                ...(conversationHistory ?? []),
            ],
            stream: true,
        }),
    });

    if (!response.body) throw new Error("No response stream available");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
            if (!line.trim()) continue;

            const data = JSON.parse(line);
            const token = data.message?.content ?? "";

            result += token;
            onToken?.(token);
        }
    }

    return result;
}