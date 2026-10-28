import { modifyAIPersonality, toggleOllamaStreaming, ollamaCommunication } from "./ai/ollama";

export const lynx_api = {
    ai: {
        ollama: {
            modifyAIPersonality: modifyAIPersonality,
            toggleOllamaStreaming: toggleOllamaStreaming,
            ollamaCommunication: ollamaCommunication
        }
    }
}