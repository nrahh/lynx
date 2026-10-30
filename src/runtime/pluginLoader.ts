import activate from "../../api/extensions/lynx-developer-tools/src/index";

export function loadPlugin() {
    console.log("Loading Lynx Developer Tools...");

    try {
        const cleanup = activate();

        console.log("Lynx Developer Tools activated!");

        return cleanup;
    } catch (error) {
        console.error("Plugin activation failed:", error);
        throw error;
    }
}