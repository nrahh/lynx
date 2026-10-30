import {
    modifyAIPersonality,
    toggleOllamaStreaming,
    ollamaCommunication
} from "./ai/ollama";

import {
    lynxRootFolder,
    createPaths,
    createNew,
    getFiles,
    getFileContent,
    saveFileContent
} from "./directories/manager";

import { createUIOverlay } from "./ui/ui_handling";

export const lynx_api = {
    ai: {
        ollama: {
            modifyAIPersonality,
            toggleOllamaStreaming,
            ollamaCommunication
        }
    },

    directories: {
        core: {
            lynxRootFolder,
            createPaths,
            createNew,
            getFiles,
            getFileContent,
            saveFileContent
        }
    },

    ui: {
        ...createUIOverlay()
    }
};