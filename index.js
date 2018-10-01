const crypto = require('crypto')
const Bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39crypto')
const BigNumber = require('bignumber.js')

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

function getDerivationPath({
    symbol,
    name,
    segwit = true,
    account,
    external,
    index
}) {
    const network = pickNetwork({ symbol, name })
    const toadd = []
    let path = network.path[segwit] || network.path.true || network.path.false
    if (account !== undefined) toadd[0] = account
    if (external !== undefined) toadd[1] = external
    if (index !== undefined) toadd[2] = index
    for (let i = 0; i < toadd.length; i++) {
        path += `/${toadd[i] || 0}`
        if (i === 0) path += `'`
    }
    return path
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

// https://github.com/dperish/prettyFloat.js/blob/master/prettyFloat.js
function limitDecimals(value, max_decimals = Infinity) {
    const parts = /^(\d+)\.(\d+)$/.exec(String(value))
    if (parts === null) return value
    const integer = parts[1]
    let decimals = parts[2].split('')

    // Cutting
    decimals = decimals.splice(0, max_decimals)

    // Removing tailing 0
    for (var i = 0, total = decimals.length; i < total; i++)
        if (decimals[total - i - 1] !== '0') break
    decimals = decimals.splice(0, total - i)

    return decimals.length === 0 ? integer : integer + '.' + decimals.join('')
}

function toBigUnit(value, decimals) {
    return BigNumber(value)
        .times(Math.pow(10, decimals))
        .toFixed()
}

function toSmallUnit(value, decimals) {
    return BigNumber(value)
        .div(Math.pow(10, decimals))
        .toFixed()
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
    validateMnemonic: bip39.validateMnemonic,
    limitDecimals,
    toBigUnit,
    toSmallUnit
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
