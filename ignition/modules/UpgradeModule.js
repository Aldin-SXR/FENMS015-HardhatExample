const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const proxyModule = require('./ProxyModule.js')

module.exports = buildModule("UpgradeModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);

    const { proxyAdmin, proxy } = m.useModule(proxyModule);

    const bankV2 = m.contract("BankV2");

    // If you do not have an initialization function, use this:
    m.call(proxyAdmin, "upgradeAndCall", [proxy, bankV2, "0x"], {
        from: proxyAdminOwner,
    });

    // If you have an initialization function, use this instead:
    // const encodedFunctionCall = m.encodeFunctionCall(bankV2, "initialize", ["example param",]);

    // m.call(proxyAdmin, "upgradeAndCall", [proxy, bankV2, encodedFunctionCall], {
    //     from: proxyAdminOwner,
    // });

    return { proxyAdmin, proxy };
});

