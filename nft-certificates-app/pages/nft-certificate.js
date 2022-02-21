import Head from 'next/head'
import { useState } from 'react';
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider';
import 'bulma/css/bulma.css'
import styles from '../styles/NftCertificate.module.css'
const NFTCertificate = () => {
    const [error, setError] = useState('')
    let web3

    const connectWalletHandler = async () => {
        const provider = await detectEthereumProvider();
        console.log("Entering handler")
        if (provider) {
            try {
                // It is metamask ethereum provider API
                await provider.request({ method: "eth_requestAccounts" })
                web3 = new Web3(provider)
                console.log("Conection successful")
                setError('')
            } catch (error) {
                setError(error.message)
            }
        } else {
            // Metamask not installed
            setError("Please install Metamask")
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
              <div className='container'>
                  <p>Something goes here</p>
              </div>
          </section>
          <section>
              <div className='container has-text-danger'>
                  <p>{error}</p>
              </div>
          </section>
        </div>
    )
}

export default NFTCertificate;