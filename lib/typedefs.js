const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChatInputCommandInteraction } = require("discord.js");

/** @namespace { typedefs } */

/**
 * @typedef { Object } CommandExport
 * @property { SlashCommandBuilder } data
 * @property { (interaction: ChatInputCommandInteraction) => {} } execute
 */