const Bitcoin = require('bitcoinjs-lib')
const createKeccakHash = require('keccak')
const ethereumJsHdKey = require('ethereumjs-wallet/hdkey')
const bs58check = require('bs58check')
const {
    addHexPrefix,
    privateToAddress
    // isValidAddress,
    // privateToPublic,
    // sha3
} = require('ethereumjs-util')
const {
    getRandomMnemonic,
    getSeedFromMnemonic,
    derivePath,
    deriveIndex,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended
} = require('../BTC')

const networks = [
    {
        name: 'mainnet',
        config: Bitcoin.networks.bitcoin,
        path: {
            false: "m/44'/60'/0'/0",
            true: "m/44'/60'/0'/0" // segwit
        }
    },
    {
        name: 'testnet',
        config: Bitcoin.networks.bitcoin,
        path: {
            false: "m/44'/60'/0'/0",
            true: "m/44'/60'/0'/0" // segwit
        }
    }
]

function getPrivateKeyFromSeed({ seed }) {
    const private_key = seed.keyPair.d.toBuffer()
    return addHexPrefix(private_key.toString('hex'))
}

function getAddressFromSeed({ seed }) {
    const xpub = getExtendedPublicKeyFromSeed({ seed })
    const address = ethereumJsHdKey
        .fromExtendedKey(xpub)
        .getWallet()
        .getAddressString()
    return toChecksumAddress(address)
}

function getAddressFromPrivateKey({ private_key }) {
    return toChecksumAddress(privateToAddress(private_key).toString('hex'))
}

module.exports = {
    networks,
    getRandomMnemonic,
    getSeedFromMnemonic,
    getPrivateKeyFromSeed,
    getAddressFromSeed,
    getAddressFromPrivateKey,
    derivePath,
    deriveIndex,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended
}

// Private
function toChecksumAddress(address) {
    address = address.toLowerCase().replace('0x', '')
    let hash = createKeccakHash('keccak256')
        .update(address)
        .digest('hex')
    let ret = '0x'

    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }

    return ret
}
