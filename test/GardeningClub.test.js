const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test suite
describe("GardeningClub", function() {
    // test fixture
    async function deployGardeningClubFixture() {
        const GardeningClub = await ethers.getContractFactory("GardeningClub");
        const club = await GardeningClub.deploy();

        const [owner, addr1, addr2] = await ethers.getSigners();

        return { club, owner, addr1, addr2 };
    }

    it("Should correctly add plant", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await expect(club.addPlant("Rose")).to.emit(club, "PlantAdded").withArgs(0, "Rose", owner);
    });

    it("Should correctly get plant", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await club.addPlant("Rose")
        const plant = await club.getPlant(0);
        expect(plant[0]).to.be.equal('Rose')
        // expect(plant[1]).to.be.equal((await ethers.provider.getBlock('latest')).timestamp)
        expect(plant[2]).to.be.equal(owner)
    });

    it("Should correctly get all my plants", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await club.addPlant("Rose")
        await club.addPlant("Tulip")
        await club.addPlant("Lily")
        
        const myPlants = await club.getMyPlants()
        
        expect(myPlants[0]).to.be.equal(0)
        expect(myPlants[1]).to.be.equal(1)
        expect(myPlants[2]).to.be.equal(2)
    });

    it("Should correctly water plant", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await club.addPlant("Rose")

        await expect(club.waterPlant(0)).to.emit(club, "PlantWatered").withArgs(0, owner)
    });

    it("Should not let you access non-existing plants", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await expect(club.getPlant(0)).to.be.revertedWith("Invalid plant ID");
    });

    it("Should not let you water non-existing plants", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await expect(club.waterPlant(0)).to.be.revertedWith("Invalid plant ID");
    });

    it("Should not let you add empty plant names", async function() {
        const { club, owner } = await loadFixture(deployGardeningClubFixture);

        await expect(club.addPlant("")).to.be.revertedWith("Plant name cannot be empty");
    });

    it("Should not let you add empty plant names", async function() {
        const { club, owner, addr1 } = await loadFixture(deployGardeningClubFixture);
        
        await club.addPlant("Rose")
        await expect(club.connect(addr1).waterPlant(0)).to.be.revertedWith("You do not own this plant");
    });
})