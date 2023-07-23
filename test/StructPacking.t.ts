import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StructPacking", function () {

  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("StructPacking");
    const contract = await Contract.deploy();

    return { contract, owner, otherAccount};
  }

  describe("Deployment", function () {
    it("Should set the correct integer", async function () {
      const { contract } = await loadFixture(deployFixture);

      const n1: bigint = BigInt(1234);
      const n2: bigint = BigInt(4321);
      const b1 = false;
      const i = 0;

      await contract.pack(n1, n2, b1, i);
      let packedValue: bigint;
      packedValue = n1;
      packedValue |= n2 << BigInt(160);
      if (b1) packedValue |= BigInt(1 << 192);
      expect(await contract.entities(i)).to.eq(packedValue);

    });
    it("Should unpack an struct correctly", async function() {
      const { contract } = await loadFixture(deployFixture);

      const n1: bigint = BigInt(1234);
      const n2: bigint = BigInt(4321);
      const b1 = false;
      const i = 0;

      await contract.pack(n1, n2, b1, i);
      console.log("inputs: \n", 
        "n1: ", n1.toString(), "\n",
        "n2: ", n2.toString(), "\n",
        "b1: ", b1, "\n",
        "i: ", i, "\n",
      );

      const {_n1, _n2, _b1} = await contract.unpack(i);

      console.log("outputs: \n", 
        "_n1: ", _n1.toString(), "\n",
        "_n2: ", _n2.toString(), "\n",
        "_b1: ", _b1, "\n",
      );
      
      expect(_n1).to.eq(n1);
      expect(_n2).to.eq(n2);
      expect(_b1).to.eq(b1);


    })
  });
});
