import ContractJson from "../../nft-certificates/build/contracts/Management.json";

/* Contract instance with all its methods and events  */
const identityContract = web3 => {
    if (!('abi' in ContractJson) ||  ContractJson.abi == undefined) throw "Compile Truffle contract"
    if (!('networks' in ContractJson) || !('4' in ContractJson.networks)) throw "Migrate the truffle contract to Rinkeby test network"

    const rinkebyContractAddress = ContractJson.networks[4].address;
    return new web3.eth.Contract(ContractJson.abi, rinkebyContractAddress);
}

export default identityContract;