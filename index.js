const crypto = require('crypto')
const Bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39crypto')

const requires = {}

function getCoin({ symbol }) {
    symbol = symbol.toUpperCase()
    if (!requires.hasOwnProperty(symbol)) {
        try {
            requires[symbol] = require(`./${symbol}`)
        } catch (e) {
            throw `Symbol ${symbol} not found`
        }
    }
    return requires[symbol]
}

function getNetwork({ symbol, name }) {
    const network = pickNetwork({ symbol, name })
    if (network) return network.config
}

function getDerivationPath({ symbol, name, segwit = true }) {
    const network = pickNetwork({ symbol, name })
    if (network)
        return network.path[segwit] || network.path.true || network.path.false
}


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



module.exports = {     
    getCoin, 
    getNetwork,
    getDerivationPath,
    getRandomMnemonic,
    getSeedFromMnemonic,
    derivePath,
    deriveIndex,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended,
    validateMnemonic: bip39.validateMnemonic
}

// Private
function pickNetwork({ symbol, name }) {
    const coin = getCoin({ symbol })
    const { networks } = coin
    if (name === undefined) {
        return networks[0]
    }
    name = String(name).toLowerCase()
    if (networks.hasOwnProperty(name)) {
        return networks[name]
    }
    return networks.find(n => n.name === name)
}
