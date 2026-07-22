const path = require("node:path");
const DataFileManager = require("./DataFileManager");

class AlertData extends DataFileManager {
    constructor() {
        super(path.join(__dirname, "../data/alerts.json"), {});
    }

    /**
     * Register an alert.
     * 
     * @param { Object } opts - Options.
     * @param { String } opts.name - Name / title of alert.
     * @param { String } opts.guildId - Guild id. 
     * @param { String } opts.channelId - Id of channel to send alert in.
     * @param { String } opts.roleId - Id of role to mention.
     * @returns { Promise<Boolean> } Success?
     * @throws { Error } - Error with specific message that can be passed on to user - will not give direct error code for internal error.
     */
    async register(opts) {
        if (!opts.name || !opts.guildId || !opts.channelId || !opts.roleId) {
            throw new Error("Invalid arguments!");
        }

        const gData = this.getProperty(opts.guildId, true) || [];

        if (gData.find(g => g.name == opts.name)) {
            throw new Error("An alert with this name already exists!");
        }

        gData.push({
            name: opts.name,
            roleId: opts.roleId,
            channelId: opts.channelId,
        });

        try {
            await this.setProperty(opts.guildId, gData, true);
            return true;
        } catch (err) {
            console.error("Error while trying to register alert:", err);
            throw new Error("An error occured while trying to register the alert");
        }
    }

    /**
     * Unregister an alert.
     * 
     * @param { Object } opts - Options.
     * @param { String } opts.name - Name / title of alert to delete.
     * @param { String } opts.guildId - Id of server that has the alert.
     */
    async unregister(opts) {
        if (!opts.name || !opts.guildId) return false;

        const gData = this.getProperty(opts.guildId) || [];
        // If there is no data for the guild, there was never a registered alert - return true because it did not really fail.
        if (gData.length === 0) return true;

        // Similiarly, if alert is not found in existing data just return true.
        const alertIndex = gData.findIndex(a => a.name === opts.name);
        if (alertIndex === -1) return true;

        gData.splice(alertIndex, 1);

        try {
            await this.setProperty(opts.guildId, gData);
            return true;
        } catch (err) {
            console.error("Error while trying to delete alert:", err);
            return false;
        }
    }

    /**
     * Get all alerts for a guild.
     * 
     * @param { String } guildId - Id of server. 
     * @returns { import("./typedefs").GuildAlert[] }
     */
    getAll(guildId) {
        if (!guildId) return [];

        // Use structured clone to copy array so it won't modify the original data.
        const gData = structuredClone((this.getProperty(guildId) || []));
        return gData;
    }
}

module.exports = AlertData;