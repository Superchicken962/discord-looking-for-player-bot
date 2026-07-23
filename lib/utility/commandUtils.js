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
 * Loop through each interaction in the interactions folder.
 * 
 * @param { (command: import("../typedefs").CommandExport, type: "command" | "modal") => void } callback - Callback to perform on valid commands.
 */
function forEachInteraction(callback) {
    const interactionPath = path.join(__dirname, "../interactions");
    const folders = fs.readdirSync(interactionPath);

    for (const folder of folders) {
        const files = fs.readdirSync(path.join(interactionPath, folder));

        for (const file of files) {
            if (!file.endsWith(".js")) continue;

            const pth = path.join(interactionPath, folder, file);
            const c = require(pth);

            // If it has the data and execute properties, call the callback (as the cmd is 'valid').
            if ("data" in c && "execute" in c) {
                // If the folder ends with an 's' (plural), then remove it as the type will not have it.
                const type = (folder.endsWith("s") ? folder.slice(0, -1) : folder);
                callback(c, type);
            }
        }
    }
}
exports.forEachInteraction = forEachInteraction;

/**
 * Load commands from the commands folder.
 * 
 * @param { import("discord.js").Client } botClient
 */
function loadCommands(botClient) {
    if (!botClient.commands) botClient.commands = new Collection();
    if (!botClient.modals) botClient.modals = new Collection();

    forEachInteraction((interaction, type) => {
        if (type === "command") {
            botClient.commands.set(interaction.data.name, interaction);
        } else if (type === "modal") {
            botClient.modals.set(interaction.data.customId, interaction);
        }
    });
}
exports.loadCommands = loadCommands;
