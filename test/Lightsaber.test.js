const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lightsaber", function() {
    // test fixture
    async function deployLightsaberFixture() {
        const Lightsaber = await ethers.getContractFactory("Lightsaber");
        const saber = await Lightsaber.deploy("red");

        const [owner, addr1, addr2] = await ethers.getSigners();

        return { saber, owner, addr1, addr2 };
    }

    it("should activate lightsaber", async function() {
        const { saber, owner } = await loadFixture(deployLightsaberFixture);

        await expect(saber.activateLightsaber()).to.emit(saber, 'LightsaberActivated').withArgs(owner)
        expect(await saber.getBatteryLevel()).to.equal(100)

        await expect(saber.activateLightsaber()).to.be.revertedWith('Lightsaber is already activated!')
    })

    it("should only allow the wielder to activate the lightsaber", async function() {
        const { saber, owner, addr1 } = await loadFixture(deployLightsaberFixture);
        let saber2 = saber.connect(addr1)

        await expect(saber2.activateLightsaber()).to.be.revertedWith('Only the wielder can use the lightsaber.')
    })

    it("should deactivate lightsaber", async function() {
        const { saber, owner } = await loadFixture(deployLightsaberFixture);
        
        await saber.activateLightsaber()
        await expect(saber.deactivateLightsaber()).to.emit(saber, 'LightsaberDeactivated').withArgs(owner)

        await expect(saber.deactivateLightsaber()).to.be.revertedWith('Lightsaber is not activated!')
    })

    it("should only allow the wielder to deactivate the lightsaber", async function() {
        const { saber, owner, addr1 } = await loadFixture(deployLightsaberFixture);

        let saber2 = saber.connect(addr1)

        await expect(saber2.deactivateLightsaber()).to.be.revertedWith('Only the wielder can use the lightsaber.')
    })

    it("should swing lightsaber", async function() {
        const { saber, owner } = await loadFixture(deployLightsaberFixture);
        
        await expect(saber.swingLightsaber()).to.be.revertedWith('Lightsaber is not activated!')

        await saber.activateLightsaber()
        await expect(saber.swingLightsaber()).to.emit(saber, 'LightsaberSwing').withArgs(owner, 99)
        await expect(saber.swingLightsaber()).to.emit(saber, 'LightsaberSwing').withArgs(owner, 98)
        await expect(saber.swingLightsaber()).to.emit(saber, 'LightsaberSwing').withArgs(owner, 97)

        expect(await saber.getBatteryLevel()).to.equal(97)
    })

    it("should recharge lightsaber", async function() {
        const { saber, owner } = await loadFixture(deployLightsaberFixture);
        
        await saber.activateLightsaber()
        await saber.swingLightsaber()
        await saber.swingLightsaber()
        await saber.swingLightsaber()

        await expect(saber.rechargeBattery(2)).to.emit(saber, 'LightsaberRecharged').withArgs(99)
        expect(await saber.getBatteryLevel()).to.equal(99)

        await saber.rechargeBattery(10)
        expect(await saber.getBatteryLevel()).to.equal(100)
    })

    it("should only allow the wielder to use the lightsaber", async function() {
        const { saber, owner, addr1 } = await loadFixture(deployLightsaberFixture);
        
        await saber.activateLightsaber()
        
        let saber2 = saber.connect(addr1)

        await expect(saber2.swingLightsaber()).to.be.revertedWith('Only the wielder can use the lightsaber.')
        await expect(saber2.rechargeBattery(10)).to.be.revertedWith('Only the wielder can use the lightsaber.')
    })
})