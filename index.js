const { ensureRequiredFilesExist } = require("./lib/utility/dataUtils");
const { Client, Events, GatewayIntentBits, ActivityType, Collection, MessageFlags } = require("discord.js");

// Before doing anything, ensure that all files and folders that are required have been created - do not import config file before this.
ensureRequiredFilesExist();

const cfg = require("./config.json");
const DataFileManager = require("./lib/DataFileManager");
const { loadCommands } = require("./lib/utility/commandUtils");

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

client.commands = new Collection();
loadCommands(client);

client.on(Events.InteractionCreate, async(interaction) => {
    if (interaction.isModalSubmit()) {
        console.log('modal', interaction.customId);
    }
    
    if (!interaction.isChatInputCommand()) return;

    const findCmd = interaction.client.commands.get(interaction.commandName);
    if (!findCmd) {
        console.warn(`Command '${interaction.commandName}' not found!`);
        return;
    }

    try {
        await findCmd.execute(interaction);
    } catch (err) {
        console.error("Error executing command:", err);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "An error occured while executing this command.",
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: "An error occured while executing this command.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
});

client.login(cfg.botToken);