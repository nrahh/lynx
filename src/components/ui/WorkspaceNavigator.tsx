import {
    workspace_navigator_bg_color,
    workspace_navigator_border_color,
    workspace_navigator_header_container_bg_color,
    workspace_navigator_header_icon_color, workspace_navigator_header_text_color
} from "../../themes/theme_values.ts";

import {useState} from "react";

import * as icons from "lucide-react";
import {ChevronRight} from "lucide-react";

// @ts-ignore
type iconName = {
    [K in keyof typeof icons as K extends string
        ? Uncapitalize<K> extends `${infer First}${infer Rest}`
            ? `${Lowercase<First>}${Rest}`
            : never
        : never]: (typeof icons)[K]
};

type workspaceNavigatorProps = {
    header: string,
    icon: string,
    parentFolder: string
}

// @ts-ignore
export default function WorkspaceNavigator(props: workspaceNavigatorProps, selectedItem: string) {

    const [expanded, setExpanded] = useState<boolean>(false);

    const iconKey = props.icon
        .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
        .replace(/^./, letter => letter.toUpperCase()) as keyof typeof icons;

    const Icon = icons[iconKey];

    if (typeof Icon !== "object" && typeof Icon !== "function") {
        return null;
    }


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