const { REST, Routes } = require("discord.js");
const { forEachCommand } = require("./lib/utility/commandUtils");
const cfg = require("./config.json");

/**
 * Deploy commands globally.
 */
(async() => {
    const commands = [];

    forEachCommand((cmd) => {
        commands.push(cmd.data.toJSON());
    });

    const rest = new REST().setToken(cfg.botToken);

    try {
        const data = await rest.put(Routes.applicationCommands(cfg.botClientId), { body: commands });

        console.log(`Successfully deployed / reloaded ${commands.length} commands!`);
    } catch (err) {
        console.error("Error deploying commands globally:", err);
    }
})();