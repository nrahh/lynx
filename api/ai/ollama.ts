let ollamaStreaming: boolean = false;
let personality: string = "you are a helpful educational ai which helps get information reliably and accurately."

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
 * @returns The AI's response to the message.
 * **/
export async function ollamaCommunication(message: string, conversationHistory?: chatMessage[]): Promise<string> {
    const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3",
            messages: [
                {role: "system", content: personality},
                ...(conversationHistory ?? []),
                {role: "user", content: message},
            ],
            stream: ollamaStreaming
        })
    })

    const data = await response.json();
    return data.message.content;
}