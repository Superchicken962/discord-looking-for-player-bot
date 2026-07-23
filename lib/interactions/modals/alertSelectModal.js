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

        const alertCooldowns = cooldownManager.getGuild(interaction.guildId).getAlert(chosenAlert);

        const userCooldown = alertCooldowns.getUserCooldown(interaction.user.id);
        if (userCooldown.isActive) {
            console.log("User cooldown");
            // ...
            return interaction.followUp({ content: `Please wait ${Math.floor(userCooldown.timeRemaining/1000/60)}m before sending another alert for ${chosenAlert}!` });
        }

        const globalCooldown = alertCooldowns.getGlobalCooldown();
        if (globalCooldown.isActive) {
            console.log("Global cooldown");
            // ...
            return interaction.followUp({ content: `${chosenAlert} has already been alerted recently, please wait ${Math.floor(globalCooldown.timeRemaining/1000/60)}m before trying again!` });
        }

        await alertCooldowns.setGlobalCooldown(10);
        await alertCooldowns.setUserCooldown(interaction.user.id, 60);

        await interaction.followUp({ content: `You chose: ${chosenAlert}`, flags: MessageFlags.Ephemeral });
    }
}

module.exports = exp;