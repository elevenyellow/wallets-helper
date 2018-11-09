const Bitcoin = require('bitcoinjs-lib')
const createKeccakHash = require('keccak')
const secp256k1 = require('secp256k1')
// const { SYMBOL, NETWORK } = require('@elevenyellow.com/blockchain-helpers')
// const { getNetwork } = require('@elevenyellow.com/blockchain-helpers/networks')
const { toSmallUnit, toBigUnit, limitDecimals } = require('../')

const {
    addHexPrefix,
    privateToAddress,
    isValidAddress
    // privateToPublic,
    // sha3
} = require('ethereumjs-util')

const decimals = 18
// const network_mainnet = getNetwork({
//     symbol: SYMBOL.ETH,
//     name: NETWORK.MAINNET
// })
// const network_testnet = getNetwork({
//     symbol: SYMBOL.ETH,
//     name: NETWORK.TESTNET
// })

function getPrivateKeyFromSeed({ seed }) {
    const private_key = seed.keyPair.d.toBuffer()
    return addHexPrefix(private_key.toString('hex'))
}

function getAddressFromSeed({ seed }) {
    // https://github.com/bitcoinjs/bitcoinjs-lib/issues/1060
    let pubkey = seed.keyPair.getPublicKeyBuffer()
    if (pubkey.length !== 64)
        pubKey = secp256k1.publicKeyConvert(pubkey, false).slice(1)
    const address = createKeccakHash('keccak256')
        .update(pubKey)
        .digest()
        .slice(-20)
        .toString('hex')

    return toChecksumAddress(address)
    // const ethereumJsHdKey = require('ethereumjs-wallet/hdkey')
    // const xpub = getExtendedPublicKeyFromSeed({ seed })
    // const address = ethereumJsHdKey
    //     .fromExtendedKey(xpub)
    //     .getWallet()
    //     .getAddressString()
    // return toChecksumAddress(address)
}

function getAddressFromPrivateKey({ private_key }) {
    return toChecksumAddress(privateToAddress(private_key).toString('hex'))
}

function isAddress(address) {
    return isValidAddress(address) // /^(0x)?[0-9a-fA-F]{40}$/.test(string)
}

function toWei(value) {
    return limitDecimals(toSmallUnit({ value, decimals }), decimals)
}

function fromWei(value) {
    return limitDecimals(toBigUnit({ value, decimals }), decimals)
}

module.exports = {
    decimals,
    getPrivateKeyFromSeed,
    getAddressFromSeed,
    getAddressFromPrivateKey,
    isAddress,
    toWei,
    fromWei
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
