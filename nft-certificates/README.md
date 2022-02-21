To add truffle to the project: 
```
mkdir nft-certificates
cd nft-certificates
npm init
truffle init
npm install dotenv
npm install @truffle/hdwallet-provider
npm install @openzeppelin/contracts
```

Truffle commands:
1. `truffle compile`:
2. `truffle migrate`: 
3. truffle exec <file-name>.js:

Use `--reset` flag to repeat the deployment at a new contract address. Use `--network` to specify the network name, specified in truffle-config.js.