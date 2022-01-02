// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await ethers.getSigners();
  const tokenName = "AcademyDAO";
  const tokenSymbol = "ADT";
  const tokenSupply = 100_000_000;
  const teamTokenAllocationPercentage = 0.2;
  const teamTokenAllocationAmount = tokenSupply * teamTokenAllocationPercentage;

  console.log(`deployer address: ${deployer.address}`);

  // Get the token contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(deployer.address, tokenName, tokenSymbol, tokenSupply);

  await token.deployed();

  console.log(`${tokenSymbol} token deployed to contract: ${token.address}`);
  console.log(`Minted ${tokenSupply} ${tokenSymbol} tokens to DAO address: ${deployer.address}`);

  // Get the vesting schedule contract to deploy
  const Vesting = await ethers.getContractFactory("VestingSchedule");
  const vesting = await Vesting.deploy(deployer.address, token.address);

  await vesting.deployed();

  console.log(`VestingSchedule contract deployed to: ${vesting.address}`);
  console.log(`Owner address: ${deployer.address}`);

  // Transfer team token allocation amount to vesting contract
  console.log(`Transferring ${teamTokenAllocationAmount} ${tokenSymbol} to vesting contract...`);
  const amount = ethers.utils.parseUnits(String(teamTokenAllocationAmount), 18);
  await token.transfer(vesting.address, amount);
  const vestingContractBalance = await token.balanceOf(vesting.address).toString();
  console.log(`Vesting contract ${tokenSymbol} balance: ${vestingContractBalance}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
