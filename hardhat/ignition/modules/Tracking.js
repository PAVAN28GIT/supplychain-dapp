const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("TockenModule", (m) => {

  const trackingcontract = m.contract("Tracking");

  return { trackingcontract };
});
