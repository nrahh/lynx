import {modifyAIPersonality, toggleOllamaStreaming, ollamaCommunication} from "./ai/ollama";
import {lynxRootFolder, createPaths, createNew, getFiles} from "./directories/manager.ts"

export const lynx_api = {
    ai: {
        ollama: {
            modifyAIPersonality: modifyAIPersonality,
            toggleOllamaStreaming: toggleOllamaStreaming,
            ollamaCommunication: ollamaCommunication
        }
    },
    directories: {
        core: {
            lynxRootFolder: lynxRootFolder,
            createPaths: createPaths,
            createNew: createNew,
            getFiles: getFiles
        }
    }
}