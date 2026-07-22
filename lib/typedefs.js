const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction } = require("discord.js");

/** @namespace { typedefs } */

/**
 * @typedef { Object } CommandExport
 * @property { SlashCommandBuilder } data
 * @property { (interaction: ChatInputCommandInteraction) => {} } execute
 */

/**
 * @typedef { Object } GuildAlert
 * @property { String } name
 * @property { String } roleId
 * @property { String } channelId
 */