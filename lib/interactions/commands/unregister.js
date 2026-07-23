const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const { alertData } = require("../../dataInstances");

/**
 * @type { import("../typedefs").CommandExport }
 */
const exp = {
    data: new SlashCommandBuilder()
        .setName("unregister")
        .setDescription("Delete an existing alert from the server.")
        .addStringOption((opt) => opt.setName("name").setDescription("Name of the alert to delete").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),

    execute: async (interaction) => {
        const name = interaction.options.getString("name");
        const guildId = interaction.guildId;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            await alertData.unregister({
                name, guildId
            })

            return interaction.followUp({ content: `Successfully deleted alert '${name}'!`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            return interaction.followUp({ content: error.message, flags: MessageFlags.Ephemeral });
        }
    }
}

module.exports = exp;