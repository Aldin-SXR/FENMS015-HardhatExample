const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const proxyModule = require('./LightsaberProxyModule.js')

module.exports = buildModule("LightsaberUpgradeModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);

    const { proxyAdmin, proxy } = m.useModule(proxyModule);

    const saberV2 = m.contract("LightsaberV2");

    // If you do not have an initialization function, use this:
    // m.call(proxyAdmin, "upgradeAndCall", [proxy, bankV2, "0x"], {
    //     from: proxyAdminOwner,
    // });

    // If you have an initialization function, use this instead:
    const encodedFunctionCall = m.encodeFunctionCall(saberV2, "initialize", ["red"]);

    m.call(proxyAdmin, "upgradeAndCall", [proxy, saberV2, encodedFunctionCall], {
        from: proxyAdminOwner,
    });

    return { proxyAdmin, proxy };
});
