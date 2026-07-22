const { ensureRequiredFilesExist } = require("./lib/dataUtils");
const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");

// Before doing anything, ensure that all files and folders that are required have been created - do not import config file before this.
ensureRequiredFilesExist();

const cfg = require("./config.json");
const DataFileManager = require("./lib/DataFileManager");

// If token has not been provided, show message and exit.
if (!cfg.botToken || !cfg.botClientId) {
    console.error("Bot token not provided in config.json! Ensure that all fields are entered before running.");
    process.exit(0);
}

// -- Discord stuff --
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (rc) => {
    console.log("[Bot] Logged in to", rc.user.tag);

    rc.user.setActivity({
        name: "custom",
        state: "👀 Something Something",
        type: ActivityType.Custom
    })
});

client.login(cfg.botToken);