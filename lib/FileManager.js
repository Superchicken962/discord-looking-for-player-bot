const fs = require("node:fs");
const { createFileIfNotExist } = require("./utility/dataUtils");

class FileManager {
    #filePath;

    /**
     * @param { fs.PathLike } path - Path to file.
     * @param { String } defContent - Default content if file does not exist. 
     */
    constructor(path, defContent) {
        this.#filePath = path;

        createFileIfNotExist(path, defContent);
    }

    /**
     * Reads file content
     * 
     * @returns { Promise<String> }
     */
    async read() {
        const file = await fs.promises.open(this.#filePath, "r");
        const content = await file.readFile({ encoding: "utf-8" });
        await file.close();

        return content.toString();

        // return fs.promises.readFile(this.#filePath, "utf-8");
    }

    /**
     * Write to file.
     * 
     * @param { String } content 
     */
    async write(content) {
        const file = await fs.promises.open(this.#filePath, "w");
        await file.writeFile(content ?? "", "utf-8");
        return file.close();

        // return fs.promises.writeFile(this.#filePath, content ?? "", "utf-8");
    }
}

module.exports = FileManager;