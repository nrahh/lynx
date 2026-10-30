import Interface from "./Interface";
import { lynx_api } from "../../../sdk";

export default function activate() {
    console.log("Plugin activated!");

    return lynx_api.ui.createUIOverlay(Interface);
}