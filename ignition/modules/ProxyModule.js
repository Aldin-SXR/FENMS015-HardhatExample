const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ProxyModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);

    const bank = m.contract("Bank");

    const proxy = m.contract("TransparentUpgradeableProxy", [
        bank,
        proxyAdminOwner,
        "0x",
    ]);

    const proxyAdminAddress = m.readEventArgument(
        proxy,
        "AdminChanged",
        "newAdmin"
    );

    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

    return { proxyAdmin, proxy };
});

