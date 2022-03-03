# nft-certificates
Easy NFT creation and management platform.

It enables anyone to:
1. Create their own NFT contract with no coding hustle!
2. Standardize and personalize their NFTs by adding attributes to the NFT.
3. Start issuing NFTs with a simple form! IPFS and JSON uploads already taken care.
3. Instantly view the collection and NFT issued on Opensea
4. Make a great collection of NFTs and share with the world.

## Use cases
1. Startups issuing NFTs to their early adopters
2. College issuing NFTs to their students
3. Receiving NFTs for course completion
4. Competitions issuing NFTs to the winners
5. Easy verification of NFTs on blockchain

## Let's talk Tech (Tech-Talk)

Initial Requirements:
1. Authority should be able to add the certificate to the blockchain.
2. Only authority should be able to issue the certificate to individuals.
3. Issue certificate as NFT
4. Verify that the certificate is issued to the given address.
5. One address should be able to create more than one NFTs and mint each of them separately.

Technology used:
1. Solidity: Language for writing smart contract
2. Truffle: Framework for Ethereum smart contract development. Provides the compiler for smart contracts.
3. Ganache: Local Ethereum blockchain network with accounts and ether initialized.
4. Metamask wallet: It is a browser extension to store account keys. This Ether is used in deploying/interacting with the contract.
5. Infura: Blockchain development suite, provides set of APIs to connect to Ethereum and IPFS network.
6. Rinkeby: Ethereum testnet. It uses Proof-of-authority.
7. Dotenv: For storing environmental variable constants and accessing them in config. Used to store private keys of wallets
8. Openzeppeline: Boiler plate smart contract code. ERC20 and ERC721 are golden standards for fungible and NFT tokens respectively. This library is most widely used and therefore tested by the industry.


On the front end we have used Javascript and <a href="https://nextjs.org" target="_blank">Next.js</a>: It is a React framework for developing single page Javascript applications. It provides server side rendering and page based routing. 

## Testnet Deployments
1. Main contract address: https://rinkeby.etherscan.io/address/0x49922c934203E1c5d996B150685DDbb87C4FCd9b
2. NFT contract deployed: https://rinkeby.etherscan.io/token/0x016236f58Cc65Bd6Ec9026121Ff563Bc7AcF6342
3. NFT issued: https://testnets.opensea.io/assets/0x016236f58cc65bd6ec9026121ff563bc7acf6342/2

## Screenshots

![View and Issue NFT](screenshot1.png)

![Issue NFT](screenshot4.png)

![Create NFT](screenshot2.png)