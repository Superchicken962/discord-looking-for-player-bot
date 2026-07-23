const { SlashCommandBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, InteractionContextType, LabelBuilder } = require("discord.js");
const { alertData } = require("../dataInstances");

/**
 * @type { import("../typedefs").CommandExport }
 */
const exp = {
    data: new SlashCommandBuilder()
        .setName("alert")
        .setDescription("Send an alert to other users that you are looking for players.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setContexts(InteractionContextType.Guild),

    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId("alertSelectModal")
            .setTitle("Looking for Players");

        
        const allAlerts = alertData.getAll(interaction.guildId);

        const select = new StringSelectMenuBuilder()
            .setCustomId("selectionMenu")
            .setPlaceholder("Select one")
            .setRequired(true)
            .addOptions(allAlerts.map(a => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(a.name)
                    .setDescription("Alert other users that you are looking for people to play")
                    .setValue(a.name);
            }));

        const selectLabel = new LabelBuilder()
            .setLabel("Choose a server to send an alert for")
            .setStringSelectMenuComponent(select);
            

        modal.addLabelComponents(selectLabel);

        await interaction.showModal(modal);
    }
}

module.exports = exp;