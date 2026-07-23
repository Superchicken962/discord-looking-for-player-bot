const { Collection, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const cfg = require("../../config.json");

/**
 * Loop through each command in the commands folder.
 * 
 * @param { (command: import("../typedefs").CommandExport) => void } callback - Callback to perform on valid commands.
 */
function forEachCommand(callback) {
    const commandPath = path.join(__dirname, "../interactions/commands");
    const commands = fs.readdirSync(commandPath);

    // Loop through each command in folder.
    for (const cmd of commands) {
        if (!cmd.endsWith(".js")) continue;

        const pth = path.join(commandPath, cmd);
        const c = require(pth);

        // If it has the data and execute properties, call the callback (as the cmd is 'valid').
        if ("data" in c && "execute" in c) {
            callback(c);
        }
    }
}
exports.forEachCommand = forEachCommand;

/**
 * Load commands from the commands folder.
 * 
 * @param { import("discord.js").Client } botClient
 */
function loadCommands(botClient) {
    if (!botClient.commands) botClient.commands = new Collection();

    forEachCommand((command) => {
        botClient.commands.set(command.data.name, command);
    });
}
exports.loadCommands = loadCommands;
