import {
    workspace_navigator_bg_color,
    workspace_navigator_border_color,
    workspace_navigator_header_container_bg_color,
    workspace_navigator_header_icon_color, workspace_navigator_header_text_color,
    workspace_navigator_selected_item_bg_color,
    workspace_navigator_selected_item_border_color,
    workspace_navigator_selected_item_text_color, workspace_navigator_unselected_item_bg_color,
    workspace_navigator_unselected_item_text_color
} from "../../themes/theme_values.ts";

import {useState, useEffect} from "react";

import * as icons from "lucide-react";
import {ChevronRight, Plus} from "lucide-react";

import {motion} from "motion/react";
import GeneralPopup from "./popups/GeneralPopup.tsx";

import {lynx_api} from "../../../api/sdk.ts";
import {changeSelectedId, useSelectedId} from "../../shared_variables.ts";

// @ts-ignore
type iconName = {
    [K in keyof typeof icons as K extends string
        ? Uncapitalize<K> extends `${infer First}${infer Rest}`
            ? `${Lowercase<First>}${Rest}`
            : never
        : never]: (typeof icons)[K]
};

type type_parentFolder = "chats" | "flashcards" | "notes" | "quizzes";

type workspaceNavigatorProps = {
    header: string,
    icon: string,
    parentFolder: type_parentFolder
}

// @ts-ignore
export default function WorkspaceNavigator(props: workspaceNavigatorProps, selectedItem: string) {

    const [expanded, setExpanded] = useState<boolean>(false);
    //this usestate is used for the open states of the popup
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [files, setFiles] = useState<{ id: string; name: string }[]>([]);

    const selected_id = useSelectedId();

    const iconKey = props.icon
        .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
        .replace(/^./, letter => letter.toUpperCase()) as keyof typeof icons;

    const Icon = icons[iconKey];

    if (typeof Icon !== "object" && typeof Icon !== "function") {
        return null;
    }

    async function loadFiles() {
        const entries = await lynx_api.directories.core.getFiles(
            props.parentFolder,
            "chatName"
        );

        setFiles(entries);
    }

    useEffect(() => {
        if (expanded) {
            void loadFiles();
        }
    }, [expanded, props.parentFolder]);

    return (
        expanded ? (
            <div style={{
                backgroundColor: workspace_navigator_bg_color,
                border: `1px solid ${workspace_navigator_border_color}`,
            }} className="w-full h-50 flex flex-col rounded-md">
                <div onClick={() => {setExpanded(false)}} style={{
                    backgroundColor: workspace_navigator_header_container_bg_color,
                    borderBottom: `1px solid ${workspace_navigator_border_color}`,
                }} className="w-full h-fit flex flex-row justify-between p-2.5 items-center">
                    <div className="w-fit flex flex-row gap-2 items-center">
                        {/* @ts-ignore */}
                        <Icon size={20} color={workspace_navigator_header_icon_color} />
                        <h1 style={{
                            color: workspace_navigator_header_text_color
                        }} className="text-left">{props.header}</h1>
                    </div>
                    <button onClick={() => {setExpanded(false)}} className="w-fit h-fit flex flex-col items-center justify-center p-0.5 cursor-pointer rotate-90">
                        <ChevronRight size={20} color={workspace_navigator_header_icon_color} />
                    </button>
                </div>
                {/*create button*/}
                <div className="w-full h-full flex flex-col gap-1.5 p-2 overflow-y-scroll scrollbar-thumb-white/10">
                    <motion.button onClick={() => {setShowPopup(true)}} initial={{opacity: 1}} whileHover={{opacity: 0.7}}
                                   className="w-full h-10 flex flex-row gap-1.5 items-center justify-center bg-white/5 rounded-md cursor-pointer">
                        <Plus width={20} height={20} color={workspace_navigator_header_icon_color} />
                        <h3 style={{
                            color: workspace_navigator_header_text_color
                        }}>Create</h3>
                    </motion.button>
                    <div className="w-full h-full flex flex-col gap-1.5 overflow-y-scroll">
                        {files.map((file) => (
                            <motion.button
                                onClick={() => {
                                    changeSelectedId(String(file.id), props.parentFolder);
                                }}
                                style={{
                                    backgroundColor: selected_id === String(file.id) ? workspace_navigator_selected_item_bg_color : workspace_navigator_unselected_item_bg_color,
                                    border: selected_id === String(file.id) ? `1px solid ${workspace_navigator_selected_item_border_color}` : "none",
                                    color: selected_id === String(file.id) ? workspace_navigator_selected_item_text_color : workspace_navigator_unselected_item_text_color
                                }}
                                key={file.id} className="w-full h-fit flex flex-row gap-1.5 p-1.5 items-center justify-center rounded-md cursor-pointer">
                                <h3 className=" w-full text-left">
                                    {file.name}
                                </h3>
                            </motion.button>
                        ))}
                    </div>
                </div>
                {showPopup && (
                    <GeneralPopup
                        header="Create"
                        description="Please enter the following."
                        fields={[
                            {title: "Chat Name", description: "Enter the chat name.", fieldType: "string"},
                            {title: "Topic", description: "Enter the topic.", fieldType: "string"},
                            {title: "Subject", description: "Enter the subject.", fieldType: "string"},
                        ]}
                        onSubmit={async (values) => {
                            const chatName = values[0];
                            const topic = values[1];
                            const subject = values[2];

                            await lynx_api.directories.core.createNew(
                                props.parentFolder,
                                String(chatName),
                                String(topic),
                                String(subject),
                                String(props.header)
                            );

                            await loadFiles();
                            setShowPopup(false);
                        }}
                        onCancel={() => setShowPopup(false)}
                    />
                )}
            </div>
        ) : (
            <div style={{
                backgroundColor: workspace_navigator_bg_color,
                border: `1px solid ${workspace_navigator_border_color}`,
            }} className="w-full h-fit flex flex-col rounded-md">
                <div onClick={() => {setExpanded(true)}} style={{
                    backgroundColor: workspace_navigator_header_container_bg_color
                }} className="w-full h-fit flex flex-row justify-between p-2.5 items-center">
                    <div className="w-fit flex flex-row gap-2 items-center">
                        {/* @ts-ignore */}
                        <Icon size={20} color={workspace_navigator_header_icon_color} />
                        <h1 style={{
                            color: workspace_navigator_header_text_color
                        }} className="text-left">{props.header}</h1>
                    </div>
                    <button onClick={() => {setExpanded(true)}} className="w-fit h-fit flex flex-col items-center justify-center p-0.5 cursor-pointer">
                        <ChevronRight size={20} color={workspace_navigator_header_icon_color} />
                    </button>
                </div>
            </div>
        )
    );
}