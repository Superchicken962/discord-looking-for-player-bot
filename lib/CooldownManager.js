const path = require("node:path");
const DataFileManager = require("./DataFileManager");

class CooldownManager extends DataFileManager {
    constructor() {
        super(path.join(__dirname, "../data/cooldowns.json"), {});
    }

    #getGuild(id) {
        const property = this.getProperty(id, true) || {
            alerts: {},
            global: 0
        };

        return property;
    }

    #getAlertForGuild(guildId, alertName) {
        const guild = this.#getGuild(guildId);
        const alert = guild.alerts[alertName] || {
            global: 0,
            users: {}
        };

        return alert;
    }

    /**
     * Set a cooldown for a guild, accross all alerts and users.
     * @param { String } guildId 
     * @param { Number } mins 
     */
    #setGlobalCooldown(guildId, mins) {
        const now = new Date();
        const expiresAt = now.setMinutes(now.getMinutes() + mins);

        const guild = this.#getGuild(guildId);
        guild.global = expiresAt;

        return this.setProperty(guildId, guild, true);
    }

    /**
     * Set a cooldown for an alert in a guild across all users.
     * 
     * @param { String } guildId - Id of server.
     * @param { String } alertName - Name of alert.
     * @param { Number } mins - Cooldown time in minutes
     * @returns 
     */
    #setAlertGlobalCooldown(guildId, alertName, mins) {
        const now = new Date();
        const expiresAt = now.setMinutes(now.getMinutes() + mins);

        const guild = this.#getGuild(guildId);
        const alert = this.#getAlertForGuild(guildId, alertName);
        alert.global = expiresAt;

        // Ensure we save alert data.
        guild.alerts[alertName] = alert;

        return this.setProperty(guildId, guild, true);
    }

    /**
     * Set a cooldown for an alert in a guild for a given user.
     * 
     * @param { String } guildId 
     * @param { String } alertName 
     * @param { String } userId 
     * @param { Number } mins 
     */
    #setAlertUserCooldown(guildId, alertName, userId, mins) {
        const now = new Date();
        const expiresAt = now.setMinutes(now.getMinutes() + mins);

        const guild = this.#getGuild(guildId);
        const alert = this.#getAlertForGuild(guildId, alertName);

        alert.users[userId] = alert.users[userId] || {};
        alert.users[userId].id = userId;
        alert.users[userId].expires = expiresAt;

        return this.setProperty(guildId, guild, true);
    }

    /**
     * Gets / checks if a user has an active alert specific cooldown.
     * 
     * @param { String } guildId 
     * @param { String } alertName 
     * @param { String } userId 
     * @returns { AlertCooldownResponse }
     */
    #getAlertUserCooldown(guildId, alertName, userId) {
        const alert = this.#getAlertForGuild(guildId, alertName);

        const now = new Date();
        const cooldownExpiry = new Date(alert.users[userId]?.expires || 0);
        const hasExpired = (now > cooldownExpiry);

        return {
            isActive: !hasExpired,
            timeRemaining: hasExpired ? 0 : (cooldownExpiry - now)
        };
    }

    #getAlertGlobalCooldown(guildId, alertName) {
        const alert = this.#getAlertForGuild(guildId, alertName);

        const now = new Date();
        const cooldownExpiry = new Date(alert.global || 0);
        const hasExpired = (now > cooldownExpiry);

        return {
            isActive: !hasExpired,
            timeRemaining: hasExpired ? 0 : (cooldownExpiry - now)
        };
    }

    #getGlobalCooldown(guildId) {
        const guild = this.#getGuild(guildId);

        const now = new Date();
        const cooldownExpiry = new Date(guild.global || 0);
        const hasExpired = (now > cooldownExpiry);

        return {
            isActive: !hasExpired,
            timeRemaining: hasExpired ? 0 : (cooldownExpiry - now)
        };
    }

    #getAlertFuncs(guildId, alertName) {
        const alert = this.#getAlertForGuild(guildId, alertName);

        return {
            setUserCooldown: (userId, mins) => {
                return this.#setAlertUserCooldown(guildId, alertName, userId, mins);
            },
            getUserCooldown: (userId) => {
                return this.#getAlertUserCooldown(guildId, alertName, userId);
            },
            setGlobalCooldown: (mins) => {
                return this.#setGlobalCooldown(guildId, mins);
            },
            getGlobalCooldown: () => {
                return this.#getGlobalCooldown(guildId);
            },
        };
    }

    /**
     * Get cooldown options for a guild given the id.
     * 
     * @param { String } guildId 
     * @returns { GuildOptions }
     */
    getGuild(guildId) {
        return {
            getAlert: (alertName) => this.#getAlertFuncs(guildId, alertName),
            setGlobalCooldown: (mins) => {
                this.#setGlobalCooldown(guildId, mins);
            },
            getGlobalCooldown: () => {
                return this.#getGlobalCooldown(guildId);
            }
        };
    }
}

/** 
 * @typedef { Object } AlertCooldownResponse 
 * @property { Boolean } isActive - Is there an active cooldown?
 * @property { Number } timeRemaining - Time (miliseconds) remaining on cooldown (0 if no cooldown).
 **/

/**
 * @typedef { Object } GuildOptions
 * @property { (alertName: String) => AlertOptions } getAlert
 * @property { (mins: Number) => Promise<void> } setGlobalCooldown - Set cooldown across all alerts in guild.
 * @property { () => AlertCooldownResponse } getGlobalCooldown - Get cooldown that is applied across whole guild.
 */

/**
 * @typedef { Object } AlertOptions
 * @property { (userId: String, mins: Number) => Promise<void> } setUserCooldown - Set user cooldown for this alert.
 * @property { (userId: String) => AlertCooldownResponse } getUserCooldown - Get user cooldown for this alert.
 * @property { (mins: Number) => Promise<void> } setGlobalCooldown - Set global server cooldown for this alert.
 * @property { () => AlertCooldownResponse } getGlobalCooldown - Get global server cooldown for this alert.
 */

module.exports = CooldownManager;