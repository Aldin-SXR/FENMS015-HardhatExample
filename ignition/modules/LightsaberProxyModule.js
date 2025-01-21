const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LightsaberProxyModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);

    const saber = m.contract("Lightsaber");

    // necessary since there was a constructor (initialize function)
    const encodedFunctionCall = m.encodeFunctionCall(saber, "initialize", ["red"]);

    const proxy = m.contract("TransparentUpgradeableProxy", [
        saber,
        proxyAdminOwner,
        encodedFunctionCall, // additional code runs (this is "0x" if there is no constructor)
    ]);

    const proxyAdminAddress = m.readEventArgument(
        proxy,
        "AdminChanged",
        "newAdmin"
    );

    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

    return { proxyAdmin, proxy };
});
