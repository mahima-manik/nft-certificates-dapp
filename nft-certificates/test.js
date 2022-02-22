const IdentityContract = artifacts.require("IdentityManagement");

module.exports = async function(callback) {

    let accounts = await web3.eth.getAccounts();

    let instance = await IdentityContract.deployed();
    console.log("Contract instance fetched: ", instance.address);
    let result = null;
    try {
        result = await instance.certsToOwners(instance.address);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}