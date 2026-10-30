import { createElement, type ComponentType } from "react";
import { createRoot } from "react-dom/client";

export function createUIOverlay() {
    return {
        createUIOverlay(component: ComponentType) {
            console.log("Creating Lynx UI overlay");

            const container = document.createElement("div");

            container.id = "lynx-plugin-overlay";

            Object.assign(container.style, {
                position: "fixed",
                inset: "0",
                width: "100vw",
                height: "100vh",
                zIndex: "2147483647",
                pointerEvents: "auto"
            });

            document.body.appendChild(container);

            const root = createRoot(container);
            root.render(createElement(component));

            return {
                close() {
                    root.unmount();
                    container.remove();
                }
            };
        }
    };
}