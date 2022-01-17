# ERC20 Token and Vesting Schedule Contract Example

This project extends the Hardhat advanced sample project and includes a simple ERC20 token contract as well as a vesting schedule contract.

## Getting started

Clone the repo and run `yarn install`

Once installed, here is a list of example commands you can run:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true yarn hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true yarn ts-node scripts/deploy.ts
yarn eslint '**/*.{js,ts}'
yarn eslint '**/*.{js,ts}' --fix
yarn prettier '**/*.{json,sol,md}' --check
yarn prettier '**/*.{json,sol,md}' --write
yarn solhint 'contracts/**/*.sol'
yarn solhint 'contracts/**/*.sol' --fix
```

## Setting up your `.env` file

If you want to deploy the contracts to a testnet like ropsten, you will need to first create a `.env` file using the [.env.example](./.env.example) file as a template. You'll need an etherscan API key (if you want to verify and publish the deployed contract to etherscan after deployment). You will also need to create an account with [alchemy](https://alchemy.com), create an app using the testnet you want to work with (ropsten in this case), and then get the API key by clicking on "view key" and copying the http address. Lastly, you'll need a mnemonic seed phrase for the dev wallet you want to use for testing.

## Running Locally

First, compile contracts:

```shell
npx hardhat compile
```

Next, start local node:

```shell
npx hardhat node
```

> *Note*: Using node v17.x will throw an error. Use node v16.x or older.

Finally, to deploy contracts:

```shell
npx hardhat run scripts/deploy.ts --network localhost
```

## Interacting with contracts running on localhost

To interact with your deployed contracts via the console, run:

```shell
npx hardhat console --network localhost
```

Then, to create the token objects, use this format:

```javascript
// Instantiate token object and attach to contract address
const Token = await ethers.getContractFactory("<CONTRACT_NAME>");
const token = Token.attach("<CONTRACT ADDRESS>");

// Get owner account address and other addresses
const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
```

Example transactions you can run from the console:

```javascript
// Get the owner balance and send your first transaction
const ownerBalance = await token.balanceOf(owner.address);

// Use .toString() method to avoid integer overflow errors
console.log(ownerBalance.toString());

// Send some 5000 tokens
const amount = ethers.utils.parseUnits(String(5000), 18);
const tx = await token.transfer(addr1.address, amount);

// View transaction info
console.log(tx)

// Verify balance of addr1
const addr1Balance = await token.balanceOf(addr1.address);
addr1Balance.toString();
```

## Chain Deployment

Before you can deploy the contracts, you'll need some testnet ETH. If you are using ropsten you can use one of the following faucets:

- [https://faucet.ropsten.be/](https://faucet.ropsten.be/)
- [https://faucet.dimensions.network/](https://faucet.dimensions.network/)
- [https://faucet.metamask.io/](https://faucet.metamask.io/)

> *Note: you might need to switch your metamask network to the corresponding testnet for some of these faucets to work*

Finally, to deploy the contracts simply run:

```shell
npx hardhat run scripts/deploy.ts --network ropsten
```

When you run this command, three main things will happen:

1. A new ERC20 [token](./contracts/Token.sol) will be created and the entire supply will be minted to the deployer address (from the mnemonic you provide)
2. A [vesting schedule](./contracts/VestingSchedule.sol) contract will be deployed
3. A transfer of x% of tokens (configurable in the [deployment script](./scripts/deploy.ts)) will be made from the deployer address to the vesting contract

> *Note: You can easily change variables in the [deployment script](./scripts/deploy.ts) to modify things like the name of the token, symbol, supply, amount to send to the vesting contract, etc...*

When the deployment is complete, you can go to etherscan (ensure you change etherscan to the correct network) and check the contract addresses of the token and the vesting contract (these will be logged to std out during deployment).

## Etherscan verification

If you want to execute contract methods from etherscan, you'll need to verify and publish the contract code.

Copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "contract arg 1" "contract arg 2"
```

## Interacting with deployed contracts

Once the contracts have been deployed and the code has been verified and published, you can interact with the methods of a contract by going to the contract address in etherscan and clicking the "contract" tab. To test the vesting contract out, click on "Write Contract", connect your metamask wallet, and click on the `addVestingSchedule` method. You'll need to provide an address which will be eligble to claim vested funds, the allocation amount (in wei; [this](https://etherscan.io/unitconverter) is a good tool for quick conversions), the vesting seconds, and the cliff seconds. As an example, here are the parameters you would enter if you wanted to allocate 250k tokens to a wallet with a 30 minute vesting schedule and a 10 minute cliff:

```json
{
    "account": "0x123abc123abc123abc123abc123abc",
    "allocation": 250000000000000000000000,
    "vestingSeconds": 1800,
    "cliffSeconds": 600,
}
```

Finally, click "write" and proceed to submit the transaction via metamask. Once the transaction has been mined, you can verify the vesting functionallity by clicking on the "Read Contract" section and triggering the `getClaimableAmount` method. Enter the account provided in the `addVestingSchedule` and if you try within 10 minutes of having added the vesting schedule, you should get 0 returned as you are still under the `cliffSeconds`. After 10 minutes, if you try it again, you should see how much is available to claim. If you want, you can also use the `claim` method in the "Write Contract" section to claim your vested amount of tokens using the vested wallet.

## Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
