const AlertData = require("./AlertData");
const CooldownManager = require("./CooldownManager");

const alertData = new AlertData();
const cooldownManager = new CooldownManager();

module.exports = {
    alertData, cooldownManager
};