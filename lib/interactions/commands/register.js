const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const { alertData } = require("../../dataInstances");

/**
 * @type { import("../typedefs").CommandExport }
 */
const exp = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register a new alert that users will be able to use.")
        .addStringOption((opt) => opt.setName("name").setDescription("The name to give this alert").setRequired(true))
        .addChannelOption((opt) => opt.setName("channel").setDescription("The channel for alerts to be sent in").setRequired(true))
        .addRoleOption((opt) => opt.setName("role").setDescription("The role to be pinged when an alert is sent").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),

    execute: async (interaction) => {
        const guildId = interaction.guildId;
        const channelId = interaction.options.getChannel("channel").id;
        const roleId = interaction.options.getRole("role").id;
        const name = interaction.options.getString("name");

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            await alertData.register({
                name, guildId, channelId, roleId
            });

            return interaction.followUp({ content: "Successfully registered alert!", flags: MessageFlags.Ephemeral });
        } catch (error) {
            return interaction.followUp({ content: error.message, flags: MessageFlags.Ephemeral });
        }
    }
}

module.exports = exp;