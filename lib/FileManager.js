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
    read() {
        return fs.promises.readFile(this.#filePath, "utf-8");
    }

    /**
     * Write to file.
     * 
     * @param { String } content 
     */
    write(content) {
        return fs.promises.writeFile(this.#filePath, content ?? "", "utf-8");
    }
}

module.exports = FileManager;