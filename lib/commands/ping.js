const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction } = require("discord.js");

/**
 * @type { import("../typedefs").CommandExport }
 */
const exp = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Example command"),

    execute: async (interaction) => {
        await interaction.reply("Pong!!!");
    }
}

module.exports = exp;