import "../../../index.css"
import {motion} from "motion/react";
import {X} from "lucide-react";

//this popup is of type "GeneralPopup". its main purpose is for displaying fields. it should not be used for displaying error messages.

type popupValue = string | number | boolean | null;

//the properties which should be put when this component is used
type generalPopupProps = {
    header: string,
    description?: string,
    fields: {
        title: string,
        description?: string,
        fieldType: "string" | "boolean" | "number"
    }[],
    onSubmit: (value: popupValue[]) => void,
    onCancel: () => void,
}

//the promise may return a string, boolean, or number
export default function GeneralPopup({header, description, fields, onSubmit, onCancel}: generalPopupProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 backdrop-blur-md">
            <div className="w-fit h-fit flex z-50 flex-col p-5 gap-3 rounded-lg bg-[#1B1B1B] border border-[#333333]">
                <div className="w-full h-fit flex flex-row justify-between">
                    <div className="w-full h-fit flex flex-col">
                        <h1 className="text-white text-left text-lg">{header}</h1>
                        <p className="text-white/30">{description}</p>
                    </div>

                    <button onClick={onCancel} className="w-fit h-fit flex flex-col items-center justify-center p-0.5">
                        <X width={20} height={20} color="white" />
                    </button>
                </div>
                <hr className="text-white/10" />

                {fields.map((field) => {
                    return (
                        <div key={field.title} className="w-fit h-fit flex flex-col gap-3">
                            <div className="w-full h-fit flex flex-col">
                                <h3 className="text-md text-white/80">{field.title}</h3>
                                <p className="text-white/50 text-sm">{field.description || null}</p>
                            </div>

                            {
                                field.fieldType === "string" ? (
                                    <input id={field.title} type={"text"} className={"text-white/85 w-80 p-2 bg-black/30 rounded-md border border-white/5"}/>
                                ) : field.fieldType === "boolean" ? (
                                    <input id={field.title} type={"checkbox"} className={"text-white/85 w-80 p-2 bg-black/30 rounded-md border border-white/5"}/>
                                ) : field.fieldType === "number" ? (
                                    <input id={field.title} type={"number"} className={"number-input text-white/85 w-80 p-2 bg-black/30 rounded-md border border-white/5"}/>
                                ) : null
                            }
                        </div>
                    )
                })}

                <hr className="text-white/10" />

                <motion.button
                    initial={{opacity: 1}} whileHover={{opacity: 0.7}}
                    onClick={() => {
                        const values = fields.map((field) => {
                            const input = document.getElementById(field.title) as HTMLInputElement;

                            if (field.fieldType === "boolean") return input.checked;
                            if (field.fieldType === "number") return input.value === "" ? null : input.valueAsNumber;
                            return input.value;
                        });

                        onSubmit(values);
                    }}
                    className="w-full p-2 bg-[#2D62B7] rounded-md text-white cursor-pointer">
                    Submit
                </motion.button>
            </div>
        </div>
    )
}