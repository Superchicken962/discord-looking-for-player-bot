const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const { alertData } = require("../../dataInstances");

/**
 * @type { import("../../typedefs").ModalExport }
 */
const exp = {
    data: {
        customId: "alertSelectModal"
    },

    execute: async (interaction) => {
        console.log("Received", interaction.customId);
        // ...
    }
}

module.exports = exp;