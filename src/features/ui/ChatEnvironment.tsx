import {
    chat_area_assistant_message_text_color,
    chat_area_bg_color, chat_area_border_color, chat_area_message_container_bg_color,
    chat_area_message_container_border_color, chat_area_message_container_send_button_bg_color,
    chat_area_message_container_send_button_icon_color,
    chat_area_message_container_text_color, chat_area_user_message_bg_color, chat_area_user_message_text_color,
    chat_environment_topbar_button_bg_color, chat_environment_topbar_button_border_color,
    chat_environment_topbar_button_icon_color,
    chat_environment_topbar_chat_type_text_color,
    chat_environment_topbar_header_color
} from "../../themes/theme_values.ts";
import {motion} from "motion/react";
import {useState, useEffect, useRef} from "react";
import {ArrowUp, Info, Settings} from "lucide-react";
import {lynx_api} from "../../../api/sdk.ts";
import {getSelectedFolder} from "../../shared_variables.ts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type fileType = {
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
}

export default function ChatEnvironment(file: fileType) {

    const [value, setValue] = useState<string>("")
    const [messages, setMessages] = useState(file.messages);
    const messagesRef = useRef(file.messages);
    const shouldAutoScroll = useRef(true);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesRef.current = file.messages;
        setMessages(file.messages);
    }, [file.id]);

    useEffect(() => {
        if (!shouldAutoScroll.current) return;

        const container = messagesContainerRef.current;

        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    function handleScroll() {
        const container = messagesContainerRef.current;

        if (!container) return;

        const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight;

        if (distanceFromBottom > 30) {
            shouldAutoScroll.current = false;
        }
    }

    async function addMessage(message: string, role: "user" | "assistant") {
        const currentMessages = messagesRef.current;

        const highestId = Math.max(
            ...currentMessages.map(message => message.id),
            0
        );

        const updatedMessages = [
            ...currentMessages,
            {
                id: highestId + 1,
                role,
                content: message,
                timestamp: new Date().toISOString(),
            },
        ];

        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);

        const updatedFile = {
            ...file,
            messages: updatedMessages,
        };

        await lynx_api.directories.core.saveFileContent(
            getSelectedFolder(),
            file.id,
            updatedFile
        );
    }

    async function sendAndReceiveAiMessage() {
        const userMessage = value.trim();

        if (!userMessage) return;

        shouldAutoScroll.current = true;

        setValue("");

        try {
            await addMessage(userMessage, "user");
            await addMessage("", "assistant");

            let streamedText = "";

            await lynx_api.ai.ollama.ollamaCommunication(
                userMessage,
                messagesRef.current.slice(0, -1),
                (token) => {
                    streamedText += token;
                    updateLastMessage(streamedText);
                }
            );

            const updatedFile = {
                ...file,
                messages: messagesRef.current,
            };

            await lynx_api.directories.core.saveFileContent(
                getSelectedFolder(),
                file.id,
                updatedFile
            );

        } catch (error) {
            console.error("ai streaming failed:", error);
        }
    }

    function updateLastMessage(content: string) {
        const updatedMessages = [...messagesRef.current];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        lastMessage.content = content;

        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);
    }

    return (
        <div className="w-full h-full min-h-0 overflow-hidden flex flex-col gap-3 p-3">
            <div className="w-full h-fit flex flex-row items-center justify-between">
                <div className="w-fit h-fit flex flex-col">
                    <h1 style={{
                        color: chat_environment_topbar_header_color
                    }} className="text-lg">{file.chatName}</h1>
                    <p style={{
                        color: chat_environment_topbar_chat_type_text_color
                    }} className="text-sm">{file.chatType}</p>
                </div>

                <div className="w-fit h-fit flex flex-row gap-1.5">
                    <motion.button
                        initial={{opacity: 1}} whileHover={{opacity: 0.7}}
                        style={{
                            backgroundColor: chat_environment_topbar_button_bg_color,
                            border: `1px solid ${chat_environment_topbar_button_border_color}`
                        }} className="w-fit h-fit flex flex-col items-center justify-center p-2 rounded-md cursor-pointer">
                        <Info width={20} height={20} style={{
                            color: chat_environment_topbar_button_icon_color
                        }} />
                    </motion.button>

                    <motion.button
                        initial={{opacity: 1}} whileHover={{opacity: 0.7}}
                        style={{
                            backgroundColor: chat_environment_topbar_button_bg_color,
                            border: `1px solid ${chat_environment_topbar_button_border_color}`
                        }} className="w-fit h-fit flex flex-col items-center justify-center p-2 rounded-md cursor-pointer">
                        <Settings width={20} height={20} style={{
                            color: chat_environment_topbar_button_icon_color
                        }} />
                    </motion.button>
                </div>
            </div>

            <hr className="text-white/10" />

            <div style={{
                backgroundColor: chat_area_bg_color,
                border: `1px solid ${chat_area_border_color}`
            }} className="w-full flex-1 min-h-0 flex flex-col p-3 rounded-md gap-2 justify-between">
                <div ref={messagesContainerRef} onScroll={handleScroll} className="w-full flex-1 min-h-0 flex flex-col gap-2 overflow-y-scroll">
                    {messages.map((message, index) => (
                        message.role === "user" ? (
                            <div key={index} className="w-full h-fit flex flex-row justify-end">
                                <div style={{
                                    backgroundColor: chat_area_user_message_bg_color
                                }} className="w-fit h-fit p-2 rounded-lg">
                                    <h3 style={{
                                        color: chat_area_user_message_text_color
                                    }} className="text-right">{message.content}</h3>
                                </div>
                            </div>
                        ) : message.role === "assistant" && (
                            <div key={index} className="w-full h-fit flex flex-row justify-start">
                                <div className="w-fit h-fit p-2 rounded-lg">
                                    <h3 style={{
                                        color: chat_area_assistant_message_text_color
                                    }} className="text-left">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                pre({ children }) {
                                                    return (
                                                        <pre className="bg-transparent p-0 m-0 my-3 border-0">
                                                            {children}
                                                        </pre>
                                                    );
                                                },
                                                code({ className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || "");

                                                    return match ? (
                                                        <SyntaxHighlighter
                                                            style={oneDark}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            codeTagProps={{
                                                                style: {
                                                                    background: "transparent",
                                                                },
                                                            }}
                                                            customStyle={{
                                                                background: "#171717",
                                                                borderRadius: "12px",
                                                                padding: "16px",
                                                                border: "1px solid #303030",
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {String(children).replace(/\n$/, "")}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className="bg-transparent" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </h3>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                <div style={{
                    backgroundColor: chat_area_message_container_bg_color,
                    border: `1px solid ${chat_area_message_container_border_color}`
                }} className="w-full h-fit p-3 rounded-md flex flex-row items-center justify-between">
                    <input value={value} onChange={(e) => {setValue(e.target.value)}}  style={{
                        color: chat_area_message_container_text_color
                    }} className="w-full outline-none" placeholder={"ask anything..."}/>

                    <motion.button
                        onClick={() => sendAndReceiveAiMessage()}
                        initial={{opacity: 1}} whileHover={{opacity: 0.7}}
                        style={{
                            backgroundColor: chat_area_message_container_send_button_bg_color
                        }}
                        className="w-fit h-fit p-2 rounded-md cursor-pointer">
                        <ArrowUp width={20} height={20} style={{
                            color: chat_area_message_container_send_button_icon_color
                        }} />
                    </motion.button>
                </div>
            </div>
        </div>
    )
}