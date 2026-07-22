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
        console.log(`Registering for:\n- Guild: ${opts.guildId}\n- Channel: ${opts.channelId}\n- Role: ${opts.roleId}`);

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
}

module.exports = AlertData;