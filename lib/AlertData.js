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
     * @param { String } opts.guildId - Server id. 
     * @param { String } opts.channelId - Id of channel to send alert in.
     * @param { String } opts.roleId - Id of role to mention.
     * @returns { Promise<Boolean> } Success?
     */
    async register(opts) {
        // TODO: Mayeb handle success code better - perhaps throw errors with messages?
        if (!opts.name || !opts.guildId || !opts.channelId || !opts.roleId) return false;

        const gData = this.getProperty(opts.guildId) || [];
        gData.push({
            name: opts.name,
            roleId: opts.roleId,
            channelId: opts.channelId
        });

        try {
            await this.setProperty(opts.guildId, gData);
            return true;
        } catch (err) {
            console.error("Error while trying to register alert:", err);
            return false;
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
}

module.exports = AlertData;