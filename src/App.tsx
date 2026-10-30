import {
    panel_color, panel_border_color, topbar_logo_color, topbar_version_text_color,
    topbar_settings_button_text_color
} from "./themes/theme_values.ts";
import {Settings} from "lucide-react";
import {motion} from "motion/react";
import {useState, useEffect} from "react";
import WorkspaceNavigator from "./components/ui/WorkspaceNavigator.tsx";
import {lynx_api} from "../api/sdk.ts"
import ChatEnvironment from "./features/ui/ChatEnvironment.tsx";
import {useSelectedId, useSelectedFolder, changeSelectedId} from "./shared_variables.ts"
import { loadPlugin } from "./runtime/pluginLoader";

type chat = {
    id: string;
    chatName: string;
    topic: string;
    subject: string;
    createdAt: string;
    chatType: string;
    messages: {
        id: number;
        role: "user" | "assistant";
        content: string;
        timestamp: string;
    }[];
};

export default function App() {

    useEffect(() => {
        const cleanup = loadPlugin();

        return () => {
            cleanup?.();
        };
    }, []);

    const selected_id = useSelectedId();
    const selected_folder = useSelectedFolder();

    const [selectedChat, setSelectedChat] = useState<chat | null>(null);

    useEffect(() => {
        changeSelectedId(null);
    }, []);

    useEffect(() => {
        let cancelled = false;

        if (!selected_id) {
            setSelectedChat(null);
            return;
        }

        async function loadChat() {
            try {
                const chat = await lynx_api.directories.core.getFileContent(
                    selected_folder,
                    selected_id!
                );

                if (!cancelled) {
                    setSelectedChat(chat);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load chat:", error);
                    setSelectedChat(null);
                }
            }
        }

        void loadChat();

        return () => {
            cancelled = true;
        };
    }, [selected_id, selected_folder]);

    useEffect(() => {
        void lynx_api.directories.core.createPaths()
    }, []);

    //@ts-ignore
    const [currentChat, setCurrentChat] = useState("");

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col select-none">
            {/*topbar*/}
            <div style={{
                backgroundColor: panel_color,
                borderBottom: `1px solid ${panel_border_color}`,
            }} className="w-full h-fit flex flex-row justify-between p-3.5 items-center">
                <div style={{
                    color: topbar_logo_color
                }} className="w-fit flex flex-row gap-2">
                    <img className="w-4.5 select-none" src={"/lynx_logo.svg"} alt={""}/>
                    <h1 className="instrumentsans text-lg text-left">Lynx</h1>
                </div>

                <div className="w-fit flex flex-row gap-2 items-center">
                    <p style={{
                        color: topbar_version_text_color
                    }} className="text-sm text-left">v0.1.0-alpha.1</p>

                    <motion.button
                        initial={{opacity: 1}} whileHover={{opacity: 0.7}}
                        className="w-fit h-fit flex flex-col items-center justify-center p-1 cursor-pointer">
                        <Settings color={topbar_settings_button_text_color} width={20} height={20} />
                    </motion.button>
                </div>
            </div>

            <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-row">
                <div style={{
                    backgroundColor: panel_color,
                    borderRight: `1px solid ${panel_border_color}`,
                }} className='w-70 min-w-70 h-full flex flex-col p-3 gap-2 transition-all'>
                    {/*@ts-ignore*/}
                    <WorkspaceNavigator header={"Chats"} icon={"message-circle"} parentFolder={"chats"} />
                    {/*@ts-ignore*/}
                    <WorkspaceNavigator header={"Flashcards"} icon={"playing-cards-fan"} parentFolder={"flashcards"} />
                    {/*@ts-ignore*/}
                    <WorkspaceNavigator header={"Notes"} icon={"notebook-pen"} parentFolder={"notes"} />
                    {/*@ts-ignore*/}
                    <WorkspaceNavigator header={"Quizzes"} icon={"list-todo"} parentFolder={"quizzes"} />
                </div>

                {selectedChat !== null && (
                    <ChatEnvironment
                        id={selectedChat.id}
                        chatName={selectedChat.chatName}
                        topic={selectedChat.topic}
                        subject={selectedChat.subject}
                        createdAt={selectedChat.createdAt}
                        chatType={selectedChat.chatType}
                        messages={selectedChat.messages}
                    />
                )}
            </div>
        </div>
    )
}