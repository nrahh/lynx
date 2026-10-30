import { useSyncExternalStore } from "react";

type ParentFolder = "chats" | "flashcards" | "notes" | "quizzes";

let selected_id: string | null = null;
let selected_folder: ParentFolder = "chats";

const listeners = new Set<() => void>();

export function changeSelectedId(id: string | null, folder: ParentFolder = "chats") {
    selected_id = id;
    selected_folder = folder;
    listeners.forEach(listener => listener());
}

export function getSelectedId() {
    return selected_id;
}

export function getSelectedFolder() {
    return selected_folder;
}

export function useSelectedId() {
    return useSyncExternalStore(
        listener => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        getSelectedId,
        getSelectedId
    );
}

export function useSelectedFolder() {
    return useSyncExternalStore(
        listener => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        getSelectedFolder,
        getSelectedFolder
    );
}