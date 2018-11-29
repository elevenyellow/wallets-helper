const crypto = require('crypto')
const Bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39crypto')

function getRandomMnemonic({ words } = { words: 24 }) {
    const strength = ((words / 3) * 32) / 8
    const entropy = crypto.randomBytes(strength)
    return bip39.entropyToMnemonic(entropy)
}

function getSeedFromMnemonic({ mnemonic, network, passphase = '' }) {
    const mnemonic_hex = bip39.mnemonicToSeed(mnemonic, passphase)
    return Bitcoin.HDNode.fromSeedHex(mnemonic_hex, network)
}

function derivePath({ seed, path }) {
    return seed.derivePath(path)
}

function deriveIndex({ seed, index }) {
    return seed.derive(index)
}

function getExtendedPublicKeyFromSeed({ seed }) {
    return seed.neutered().toBase58()
}

function getExtendedPrivateKeyFromSeed({ seed }) {
    return seed.toBase58()
}

function getSeedFromExtended({ extended, network }) {
    return Bitcoin.HDNode.fromBase58(extended, network)
}

function getRedeemScript(ecpair) {
    const pubKey = ecpair.getPublicKeyBuffer()
    const pubKeyHash = Bitcoin.crypto.hash160(pubKey)
    return Bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
}

function generatePath({ purpose, coin, account, change, index }) {
    let path = `m/${purpose}'`
    const toadd = []
    if (coin !== undefined) toadd[0] = coin
    if (account !== undefined) toadd[1] = account
    if (change !== undefined) toadd[2] = change
    if (index !== undefined) toadd[3] = index
    for (let i = 0; i < toadd.length; i++) {
        path += `/${toadd[i] || 0}`
        if (i < 2) path += `'`
    }
    return path
}

module.exports = {
    getRandomMnemonic,
    getSeedFromMnemonic,
    derivePath,
    deriveIndex,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended,
    validateMnemonic: bip39.validateMnemonic,
    getRedeemScript,
    generatePath
}

// // Private
// function pickNetwork({ symbol, name }) {
//     const coin = getCoin({ symbol })
//     const { networks } = coin
//     if (name === undefined) {
//         return networks[0]
//     }
//     name = String(name).toLowerCase()
//     if (networks.hasOwnProperty(name)) {
//         return networks[name]
//     }
//     return networks.find(n => n.name === name)
// }
