const fs = require("node:fs");
const path = require("node:path");

/**
 * Create a file if it does not exist already.
 * 
 * @param { fs.PathLike } path - File path.
 * @param { String } content - File content to write if creating.
 */
function createFileIfNotExist(path, content) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, content ?? "", "utf-8");
    }
}
exports.createFileIfNotExist = createFileIfNotExist;

/**
 * Creates a directory if it does not exist already.
 * 
 * @param { fs.PathLike } dir - Directory path.
 */
function createDirectoryIfNotExist(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
exports.createDirectoryIfNotExist = createDirectoryIfNotExist;

/**
 * Ensures required files and folders exist.
 */
function ensureRequiredFilesExist() {
    createDirectoryIfNotExist(path.join(__dirname, "../data/"));
    createFileIfNotExist(path.join(__dirname, "../config.json"), JSON.stringify({
        botToken: "",
        botClientId: ""
    }, null, 4));
}
exports.ensureRequiredFilesExist = ensureRequiredFilesExist;
