
import {mkdir, exists, BaseDirectory, readTextFile, writeTextFile, readDir} from "@tauri-apps/plugin-fs";

export async function lynxRootFolder() {
    const root = "Lynx"
    if (!(await exists(root, {baseDir: BaseDirectory.Document}))) {
        await mkdir(root, {baseDir: BaseDirectory.Document, recursive: true});
    }
    return root
}

export async function createPaths() {
    //check if the root folder exists. if not create it.
    //then define all the paths to be created
    const root = await lynxRootFolder();

    const paths = {
        chats: `${root}/chats`,
        flashcards: `${root}/flashcards`,
        notes: `${root}/notes`,
        quizzes: `${root}/quizzes`,
    };

    //create all paths
    for (const path of Object.values(paths)) {
        if (!(await exists(path, {baseDir: BaseDirectory.Document}))) {
            await mkdir(path, {baseDir: BaseDirectory.Document, recursive: true});
        }
    }
}

export async function createNew(parentFolder: "chats" | "flashcards" | "notes" | "quizzes", chatName: string, topic: string, subject: string) {
    if (!parentFolder || !chatName || !topic || !subject) return;

    const template = JSON.parse(
        await readTextFile("templates/chat_template.json", {baseDir: BaseDirectory.Resource})
    );

    //set the id and title of the template
    template.id = crypto.randomUUID();
    template.chatName = chatName;
    template.topic = topic;
    template.subject = subject;

    //clone the template and put it inside the parentFolder
    const root = await lynxRootFolder();
    const folder = `${root}/${parentFolder}`;

    await mkdir(folder, {
        baseDir: BaseDirectory.Document,
        recursive: true,
    });

    //edit the contents of the template slightly
    await writeTextFile(
        `${folder}/${template.id}.json`,
        JSON.stringify(template, null, 2),
        {baseDir: BaseDirectory.Document}
    );
}

export async function getFiles(parentFolder: "chats" | "flashcards" | "notes" | "quizzes", getProperty: string
) {
    const entries = await readDir(`Lynx/${parentFolder}`, {
        baseDir: BaseDirectory.Document,
    });

    const files = entries.filter(
        entry => entry.isFile && entry.name.endsWith(".json")
    );

    return Promise.all(
        files.map(async (file) => {
            const content = await readTextFile(
                `Lynx/${parentFolder}/${file.name}`,
                { baseDir: BaseDirectory.Document }
            );

            const json = JSON.parse(content);

            return {
                id: json.id,
                name: json[getProperty],
            };
        })
    );
}