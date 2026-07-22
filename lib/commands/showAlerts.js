const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const { alertData } = require("../dataInstances");

/**
 * @type { import("../typedefs").CommandExport }
 */
const exp = {
    data: new SlashCommandBuilder()
        .setName("show_alerts")
        .setDescription("Show all registered alerts for this server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),

    execute: async (interaction) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const guilds = await alertData.getAll(interaction.guildId);

        if (guilds.length === 0) {
            return interaction.followUp({ content: "There are currently no alerts for this server. Use /register to create one!", flags: MessageFlags.Ephemeral });
        }

        return interaction.followUp({ content: `All registered alerts for **${interaction.guild.name}**:\n${guilds.map(g => `- ${g.name} | <#${g.channelId}> | <@&${g.roleId}>`).join("\n")}\n\n*Use /unregister <name> to delete any of the above alerts*`, flags: MessageFlags.Ephemeral });
    }
}

module.exports = exp;