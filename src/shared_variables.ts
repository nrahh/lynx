import { useSyncExternalStore } from "react";

let selected_id: string | null = null;
const listeners = new Set<() => void>();

export function changeSelectedId(id: string | null) {
    selected_id = id;
    listeners.forEach(listener => listener());
}

export function getSelectedId() {
    return selected_id;
}

export function useSelectedId() {
    return useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        getSelectedId,
        getSelectedId
    );
}