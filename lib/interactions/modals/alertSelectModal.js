const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, MessageFlags, PermissionFlagsBits, InteractionContextType } = require("discord.js");
const { alertData, cooldownManager } = require("../../dataInstances");

/**
 * @type { import("../../typedefs").ModalExport }
 */
const exp = {
    data: {
        customId: "alertSelectModal"
    },

    execute: async (interaction) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const chosenAlert = interaction.fields.getStringSelectValues("selectionMenu")[0];

        const userCooldown = cooldownManager.getAlertUserCooldown(interaction.guildId, chosenAlert, interaction.user.id);
        if (userCooldown.isActive) {
            // ...
            return interaction.followUp({ content: `Please wait ${Math.floor(userCooldown.timeRemaining/1000/60)}m before sending another alert for ${chosenAlert}!` });
        }

        await cooldownManager.setAlertGlobalCooldown(interaction.guildId, chosenAlert, 10);
        await cooldownManager.setAlertUserCooldown(interaction.guildId, chosenAlert, interaction.user.id, 60);

        await interaction.followUp({ content: `You chose: ${chosenAlert}`, flags: MessageFlags.Ephemeral });
    }
}

module.exports = exp;