import Head from 'next/head'
import { useState, useEffect } from 'react';
import Web3 from 'web3'
import identityContract from '../blockchain/certificate'
import detectEthereumProvider from '@metamask/detect-provider';
import 'bulma/css/bulma.css'
import styles from '../styles/NftCertificate.module.css'

const NFTCertificate = () => {
    const [connectWalletError, setConnectWalletError] = useState('')
    const [nftContractsError, setNftContractsError] = useState('')
    const [createNftError, setCreateNftError] = useState('')
    const [createNftSuccess, setCreateNftSuccess] = useState('')
    const [issueNftError, setIssueNftError] = useState('')
    const [issueNftSuccess, setIssueNftSuccess] = useState('')
    const [nftContracts, setNftContracts] = useState([])
    const [tokenName, setTokenName] = useState('')
    const [tokenSymbol, setTokenSymbol] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [inputContractAddress, setInputContractAddress] = useState('')
    const [inputReceiverAddress, setInputReceiverAddress] = useState('')
    const [inputTokenURI, setInputTokenUri] = useState('')
    const [myContract, setMyContract] = useState(null)

    useEffect(() => {
        if (myContract && address) getNftContracts()
    }, [myContract]);

    function extractColumn(arr, column) {
        return arr.map(x => x[column])
    }

    const getNftContracts = async () => {
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
            console.log(typeof(nftAdresses), Array.isArray(array))
            for (var i=0; i < array[0].length; i++) {
                console.log(i, extractColumn(array, i))
                result.push(extractColumn(array, i))
            }
            setNftContracts(result)
            setNftContractsError('')
        } catch (error) {
            console.log('Error fetching NFT addresses', error)
            setNftContractsError(error.message)
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

    const updateTokenName = event => {
        setTokenName(event.target.value)
    }

    const updateTokenSymbol = event => {
        setTokenSymbol(event.target.value)
    }

    const updateInputContractAddress = event => {
        setInputContractAddress(event.target.value)
    }

    const updateInputReceiverAddress = event => {
        setInputReceiverAddress(event.target.value)
    }

    const updateInputTokenUri = event => {
        setInputTokenUri(event.target.value)
    }

    const createNftHandler = async() => {
        setIssueNftError('')
        setIssueNftSuccess('')
        setCreateNftError('')
        setCreateNftSuccess('Please wait...')
        if (web3 == 'undefined') await connectWalletHandler()
        
        try {
            const result = await myContract.methods.create_nft(tokenName, tokenSymbol).send({from: address, gasLimit: 25000000})
            console.log(result)
            console.log(result.events)
            console.log(result.events['tokenAddress'])
            setCreateNftError('')
            setCreateNftSuccess('Created NFT Contract at: ' + result.events['tokenAddress'])
            await getNftContracts()
        } catch (error) {
            setCreateNftError('Error creating NFT contract: ' + error.message)
            setCreateNftSuccess('')
        }
    }

    const issueNftHandler = async () => {
        setIssueNftError('')
        setIssueNftSuccess('Please wait...')
        setCreateNftError('')
        setCreateNftSuccess('')
        if (web3 == 'undefined') await connectWalletHandler()
        
        try {
            const result = await myContract.methods.issue_certificate(inputReceiverAddress, inputContractAddress, inputTokenURI).send({from: address, gasLimit: 25000000})
            console.log(result)
            console.log(result.events)
            const tokenAddress = result.events['NftIssued'].returnValues['tokenAddress']
            const tokenId = result.events['NftIssued'].returnValues['tokenId']
            console.log(tokenAddress)
            setIssueNftError('')
            setIssueNftSuccess('Issued NFT: ' + 'https://testnets.opensea.io/assets/' + tokenAddress + '/' + tokenId)
            await getNftContracts()
        } catch (error) {
            setIssueNftError('Error issuing NFT: ' + error.message)
            setIssueNftSuccess('')
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
                        </tr>
                    </thead>
                    <tbody>
                        {nftContracts && nftContracts.map((nft) => (
                            <tr key={nft[0]}>
                            <td>{nft[1]}</td>
                            <td>{nft[2]}</td>
                            <td><a href={'https://rinkeby.etherscan.io/token/'+nft[0]}>here</a></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              <div className='container mt-2'>
                  <button onClick={getNftContracts} className='button is-primary'>Get tokens</button>
                  <div className='container has-text-danger'>
                    <p>{nftContractsError}</p>
                  </div>
              </div>
          </section>
          
          <section className='mt-5'>
              <div className='container'>
                  <div className='field'>
                      <label className='label'>Create NFT contract</label>
                      <div className='control'>
                          <input onChange={updateTokenName} className='input' type='type' placeholder='Enter Token Name'></input>
                      </div>
                   </div>
                   <div className='field'>
                      <div className='control'>
                          <input onChange={updateTokenSymbol} className='input' type='type' placeholder='Enter Token Symbol'></input>
                      </div>
                   </div>
                   <button onClick={createNftHandler} className='button is-primary'>Create</button>
                   <div className='container has-text-danger'>
                    <p>{createNftError}</p>
                  </div>
                  <div className='container has-text-success'>
                    <p>{createNftSuccess}</p>
                  </div>
              </div>
          </section>
          <section className='mt-5'>
              <div className='container'>
                  <div className='field'>
                      <label className='label'>Issue NFT token</label>
                      <div className='control'>
                          <input onChange={updateInputReceiverAddress} className='input' type='type' placeholder='Enter receiver address'></input>
                      </div>
                   </div>
                   <div className='field'>
                      <div className='control'>
                          <input onChange={updateInputContractAddress} className='input' type='type' placeholder='Enter NFT contract address'></input>
                      </div>
                   </div>
                   <div className='field'>
                      <div className='control'>
                          <input onChange={updateInputTokenUri} className='input' type='type' placeholder='Enter token URI'></input>
                      </div>
                   </div>
                   <button onClick={issueNftHandler} className='button is-primary'>Issue</button>
                   <div className='container has-text-danger'>
                    <p>{issueNftError}</p>
                  </div>
                  <div className='container has-text-success'>
                    <p>{issueNftSuccess}</p>
                  </div>
              </div>
          </section>
        </div>
    )
}

export default NFTCertificate;