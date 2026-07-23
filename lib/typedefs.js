const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction, ModalSubmitInteraction } = require("discord.js");

/** @namespace { typedefs } */

/**
 * @typedef { Object } CommandExport
 * @property { SlashCommandBuilder } data
 * @property { (interaction: ChatInputCommandInteraction) => {} } execute
 */

/**
 * @typedef { Object } ModalExport
 * @property { Object } data
 * @property { String } data.customId - Custom id of modal.
 * @property { (interaction: ModalSubmitInteraction) => {} } execute
 */

/**
 * @typedef { Object } GuildAlert
 * @property { String } name
 * @property { String } roleId
 * @property { String } channelId
 */