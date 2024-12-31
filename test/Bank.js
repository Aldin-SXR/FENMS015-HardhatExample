const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
    async function deployBankFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("Bank");
        const bank = await Bank.deploy();

        return { bank, owner, addr1, addr2 };
    }

    it("Should return the correct balance", async function () {
        const { bank } = await loadFixture(deployBankFixture);

        expect(await bank.getBalance()).to.equal(0);
    });

    it("Should correctly update balance after deposit", async function () {
        const { bank } = await loadFixture(deployBankFixture);

        await bank.deposit({ value: ethers.parseEther("1") });

        expect(await bank.getBalance()).to.equal(ethers.parseEther("1"));
    });

    it("Should allow withdrawal within balance limit", async function () {
        const { bank, owner } = await loadFixture(deployBankFixture);

        await bank.deposit({ value: ethers.parseEther("1") });
        await bank.withdraw(owner.address, ethers.parseEther("0.5"));

        expect(await bank.getBalance()).to.equal(ethers.parseEther("0.5"));
    });

    it("Should transfer Ether correctly", async function () {
        const { bank, owner, addr1 } = await loadFixture(deployBankFixture);

        await bank.deposit({ value: ethers.parseEther("1") });
        await bank.withdraw(addr1.address, ethers.parseEther("1"));

        const addr1Balance = await ethers.provider.getBalance(addr1.address);
        expect(addr1Balance).to.equal(ethers.parseEther("10001"));

        const ownerBalance = await ethers.provider.getBalance(owner.address);
        expect(ownerBalance).to.be.lt(ethers.parseEther("10000"));
    });

    it("Should transfer Ether correctly - v2", async function () {
        const { bank, owner, addr1 } = await loadFixture(deployBankFixture);

        await expect(
            bank.deposit({ value: ethers.parseEther("1") })
        ).to.changeEtherBalance(owner.address, -ethers.parseEther("1"));

        await expect(
            bank.withdraw(addr1.address, ethers.parseEther("1"))
        ).to.changeEtherBalance(addr1.address, ethers.parseEther("1"));
    });

    it("Should transfer Ether correctly - v3", async function () {
        const { bank, owner, addr1 } = await loadFixture(deployBankFixture);

        await expect(
            bank.deposit({ value: ethers.parseEther("1") })
        ).to.changeEtherBalances(
            [owner, bank],
            [-ethers.parseEther("1"), ethers.parseEther("1")]
        );

        await expect(
            bank.withdraw(addr1.address, ethers.parseEther("0.5"))
        ).to.changeEtherBalances(
            [bank, addr1],
            [-ethers.parseEther("0.5"), ethers.parseEther("0.5")]
        );
    });

    it("Should revert withdrawal exceeding balance", async function () {
        const { bank, owner } = await loadFixture(deployBankFixture);

        await expect(
            bank.withdraw(owner.address, ethers.parseEther("1"))
        ).to.be.revertedWith("Not enough balance");

        // Assert only that a revert will happen; we do not care about the error message
        // await expect(
        //     bank.withdraw(owner.address, ethers.parseEther("1"))
        // ).to.be.reverted;
    });

    it("Should emit an event on deposit and withdraw", async function () {
        const { bank, owner, addr1 } = await loadFixture(deployBankFixture);

        await expect(
            bank.deposit({ value: ethers.parseEther("1") })
        ).to.emit(bank, "Deposit")
         .withArgs(owner, ethers.parseEther("1"));

         await expect(
            bank.withdraw(addr1, ethers.parseEther("1"))
        ).to.emit(bank, "Withdraw")
         .withArgs(owner, addr1, ethers.parseEther("1"));
    });
});

