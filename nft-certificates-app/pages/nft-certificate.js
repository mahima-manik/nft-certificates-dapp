import Head from 'next/head'
import { useState, useEffect } from 'react';
import Web3 from 'web3'
import identityContract from '../blockchain/certificate'
import detectEthereumProvider from '@metamask/detect-provider';
import 'bulma/css/bulma.css'
import styles from '../styles/NftCertificate.module.css'

const NFTCertificate = () => {
    const [connectWalletError, setConnectWalletError] = useState('')
    const [nftContractsMessage, setNftContractsMessage] = useState('')
    const [createNftMessage, setCreateNftMessage] = useState('')
    const [issueNftMessage, setIssueNftMessage] = useState('')
    const [nftContracts, setNftContracts] = useState([])
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [myContract, setMyContract] = useState(null)

    useEffect(() => {
        if (myContract && address) getNftContracts()
    }, [myContract]);

    function extractColumn(arr, column) {
        return arr.map(x => x[column])
    }

    function updateText (id, status, message) {
        document.getElementById(id).className = 'container has-text-'+status
        const funName = 'set' + id;
        // console.log("Fun name is ", funName)
        eval(funName)(message);
    }
    
    const getNftContracts = async () => {
        updateText ('NftContractsMessage', 'danger')
        if (web3 == 'undefined') await connectWalletHandler()
        
        try {
            const nftAdresses = await myContract.methods.get_nft_addresses().call({from: address})
            console.log(nftAdresses)
            const resLength = Object.keys(nftAdresses).length

            // Converting object to Array type
            var array = []
            for (var i=0; i < resLength; i++) {
                array.push(nftAdresses[i])
            }
                        
            console.log(nftAdresses[0].length)
            var result = []
            for (var i=0; i < array[0].length; i++) {
                // console.log(i, extractColumn(array, i))
                result.push(extractColumn(array, i))
            }
            setNftContracts(result)
            updateText('NftContractsMessage', 'info', '')
            
        } catch (error) {
            console.log('Error fetching NFT addresses', error)
            updateText('NftContractsMessage', 'danger', error.message)
        }
    }

    const connectWalletHandler = async () => {
        /* Check if metamask is installed */
        const provider = await detectEthereumProvider();
        console.log("Entering handler")
        if (provider) {
            try {
                // It is metamask ethereum provider API
                /* Requesting wallet connect */
                await provider.request({ method: "eth_requestAccounts" })
                web3 = new Web3(provider)
                setWeb3(web3)
                console.log("Conection successful")
                setConnectWalletError('')
                /* Get accounts List */
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                /* Create local vm copy */
                const vm = identityContract(web3)
                setMyContract(vm)
                setConnectWalletError('')
            } catch (error) {
                setConnectWalletError(error.message)
            }
        } else {
            // Metamask not installed
            setConnectWalletError("Please install Metamask")
        }
    }

    const createNftHandler = async() => {
        updateText('IssueNftMessage', 'info', '')
        updateText('CreateNftMessage', 'info', 'Please wait...')
        
        if (web3 == 'undefined') await connectWalletHandler()
        const inputs = document.querySelectorAll("#createNftform input")
        
        let tokenName, tokenSymbol, attributeName
        inputs.forEach(input => {
            if (input.name == 'tokenName') tokenName = input.value
            else if (input.name == 'tokenSymbol') tokenSymbol = input.value
            else if (input.name == 'attributeName') attributeName = input.value
        })

        let attributeNames = [attributeName]
        let attributeTypes = ["string"]

        console.log(tokenName, tokenSymbol, attributeName)
        try {
            const result = await myContract.methods.create_nft(tokenName, tokenSymbol, attributeNames, attributeTypes).send({from: address, gasLimit: 25000000})
            console.log(result)
            console.log(result.events)
            const tokenAddress = result.events['NftCreated'].returnValues['tokenAddress']
            console.log(tokenAddress)
            getNftAttributes(tokenAddress)
            updateText('CreateNftMessage', 'success', 'Created NFT Contract at: ' + tokenAddress)
            await getNftContracts()
        } catch (error) {
            updateText('CreateNftMessage', 'danger', 'Error creating NFT contract: ' + error.message)
        }
    }

    function remove(el) {
        var element = el;
        element.remove();
    }
    const addNftAttributes = () => {
        var button = document.getElementById("add-attributes");
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            let value = document.getElementById('attribute').value
            if (value == "") return false
            document.getElementById('attribute').value = ""
            const newNode = document.createElement("div");
            newNode.className = 'box'
            newNode.innerHTML = value + "<button class='delete is-medium ml-2'></button>"
            document.getElementById("createNftform").insertBefore(newNode, this);
            return false;
        });
    }

    const issueNftHandler = async () => {
        updateText('CreateNftMessage', 'info', '')
        updateText('IssueNftMessage', 'info', 'Please wait...')
        if (web3 == 'undefined') await connectWalletHandler()
        
        const inputs = document.querySelectorAll("#issueNftform input")
        
        let receiverAddress, nftContract, tokenUri
        inputs.forEach(input => {
            if (input.name == 'receiverAddress') receiverAddress = input.value
            else if (input.name == 'nftContract') nftContract = input.value
            else if (input.name == 'tokenUri') tokenUri = input.value
        })

        console.log(receiverAddress, nftContract, tokenUri)
        try {
            const result = await myContract.methods.issue_certificate(receiverAddress, nftContract, tokenUri).send({from: address, gasLimit: 25000000})
            // console.log(result)
            // console.log(result.events)
            const tokenAddress = result.events['NftIssued'].returnValues['tokenAddress']
            const tokenId = result.events['NftIssued'].returnValues['tokenId']
            console.log(tokenAddress, tokenId)
            updateText('IssueNftMessage', 'success', 'Issued NFT: ' + 'https://testnets.opensea.io/assets/' + tokenAddress + '/' + tokenId)
            await getNftContracts()
        } catch (error) {
            updateText('IssueNftMessage', 'danger', 'Error issuing NFT: ' + error.message)
        }
    }

    const getNftAttributes = async (contractAddress) => {
        if (web3 == 'undefined') await connectWalletHandler()
        try {
            const result = await myContract.methods.get_nft_attributes(contractAddress).call({from: address})
            console.log(result)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className={styles.main}>
          <Head>
            <title>NFT Certificate</title>
            <meta name="description" content="Create your own organization's NFT and distribute" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <nav className="navbar mt-4 mb-4">
            <div className='container'>
                <div className='navbar-brand'>
                    <h1>NFT Certificates</h1>
                </div>
                <div className='navbar-end'>
                    <button onClick={connectWalletHandler} className='button is-primary'>Connect Wallet</button>
                </div>
            </div>
          </nav>

          <section>
              <div className='container has-text-danger'>
                  <p>{connectWalletError}</p>
              </div>
          </section>

          <section>
              <div className='container'>
                <table className="table is-striped is-bordered is-hoverable">
                    <thead className='bold'>
                        <tr>
                            <th>Token name</th>
                            <th>Token symbol</th>
                            <th>Token address</th>
                            <th>Issue count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nftContracts && nftContracts.map((nft) => (
                            <tr key={nft[0]}>
                            <td>{nft[1]}</td>
                            <td>{nft[2]}</td>
                            <td><a href={'https://rinkeby.etherscan.io/token/'+nft[0]} target="_blank">etherscan</a></td>
                            <td>{nft[3]}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              <div className='container mt-2'>
                  <button onClick={getNftContracts} className='button is-primary'>Get tokens</button>
                  <div id='NftContractsMessage' className='container has-text-info'>
                    <p>{nftContractsMessage}</p>
                  </div>
              </div>
          </section>
          
          <section className='mt-5'>
              <div className='container' id='createNftform'>
                   <div className='field'>
                      <label className='label'>Create NFT contract</label>
                      <div className='control has-icons-left'>
                          <input className='input' type='type' name='tokenName' placeholder='Enter Token Name'></input>
                          <span className="icon is-small is-left">
                            <i class="fas fa-user"></i>
                          </span>
                      </div>
                   </div>
                   <div className='field'>
                      <div className='control'>
                          <input className='input' type='type' name='tokenSymbol' placeholder='Enter Token Symbol'></input>
                      </div>
                   </div>
                   <div className='field'>
                        <div className='control'>
                                <input className='input' type='type' name='attributeName' id='attribute' placeholder='Enter Attribute Name'></input>
                        </div>
                   </div>
                   <button onClick={addNftAttributes} className='button is-info is-light is-small mr-2' id='add-attributes'>Add NFT attributes</button>
                   <button onClick={createNftHandler} className='button is-primary'>Create</button>
                   <div id='CreateNftMessage' className='container has-text-info'>
                    <p>{createNftMessage}</p>
                  </div>
              </div>
          </section>
          <section className='mt-5'>
              <div className='container' id='issueNftform'>
                  <div className='field'>
                      <label className='label'>Issue NFT token</label>
                      <div className='control'>
                          <input className='input' type='type' name='receiverAddress' placeholder='Enter receiver address'></input>
                      </div>
                   </div>
                   <div className='field'>
                      <div className='control'>
                          <input className='input' type='type' name='nftContract' placeholder='Enter NFT contract address'></input>
                      </div>
                   </div>
                   <div className='field'>
                      <div className='control'>
                          <input className='input' type='type' name='tokenUri' placeholder='Enter token URI'></input>
                      </div>
                   </div>
                   <button onClick={issueNftHandler} className='button is-primary'>Issue</button>
                  <div id='IssueNftMessage' className='container has-text-info'>
                    <p>{issueNftMessage}</p>
                  </div>
              </div>
          </section>
        </div>
    )
}

export default NFTCertificate;