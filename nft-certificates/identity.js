const MyContract = artifacts.require("Management");

module.exports = async function(callback) {

    let accounts = await web3.eth.getAccounts();

    let instance = await MyContract.deployed();
    console.log("Contract instance fetched: ", instance.address);
    let nftAddress = null;
    try {
        let txReceipt = await instance.create_nft("Mahima Manik", "MM");
        nftAddress = txReceipt.logs[0].args[0];
        console.log("New NFT contract created at address: ", nftAddress);
    } catch (error) {
        console.log(error);
    }

    try {
        await instance.issue_certificate(accounts[1], nftAddress, "https://ipfs.io/ipfs/QmaZmECGK1fUyuVtp6VJHjBBPgcETGnN6fS2AsDcGLsXBV", {from: accounts[0]});
        console.log("Issued a new token for contract address: ", nftAddress);
    } catch (error) {
        console.log(error);
    }

    try {
        let nftsList = await instance.get_nfts_created();
        console.log(nftsList);
    } catch (error) {
        console.log(error);
    }

    try {
        let holdersList = await instance.get_nft_holders(nftAddress);
        console.log(holdersList);
    } catch (error) {
        console.log(error);
    }

    callback();
}