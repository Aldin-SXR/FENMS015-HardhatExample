const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const proxyModule = require('./ProxyModule.js')

module.exports = buildModule("UpgradeModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);

    const { proxyAdmin, proxy } = m.useModule(proxyModule);

    const bankV2 = m.contract("BankV2");

    m.call(proxyAdmin, "upgradeAndCall", [proxy, bankV2, "0x"], {
        from: proxyAdminOwner,
    });

    return { proxyAdmin, proxy };
});

