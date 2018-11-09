const Bitcoin = require('bitcoinjs-lib')
const { SYMBOL, NETWORK } = require('@elevenyellow.com/blockchain-helpers')
const { getNetwork } = require('@elevenyellow.com/blockchain-helpers/networks')
const { toSmallUnit, toBigUnit, limitDecimals } = require('../')

const decimals = 8
const network_mainnet = getNetwork({
    symbol: SYMBOL.BTC,
    name: NETWORK.MAINNET
})
const network_testnet = getNetwork({
    symbol: SYMBOL.BTC,
    name: NETWORK.TESTNET
})

function getPrivateKeyFromSeed({ seed }) {
    const keypair = seed.keyPair
    return keypair.toWIF().toString()
}

function getAddressFromSeed({ seed, network, segwit = true }) {
    const keypair = seed.keyPair
    return getAddressFromKeypair({ keypair, network, segwit })
}

function getAddressFromPrivateKey({ private_key, network, segwit }) {
    const keypair = Bitcoin.ECPair.fromWIF(private_key, network)
    return getAddressFromKeypair({ keypair, network, segwit })
}

function getAddressFromKeypair({ keypair, network, segwit = true }) {
    if (!segwit) {
        return keypair.getAddress().toString()
    } else {
        const pub_key = keypair.getPublicKeyBuffer()
        const pub_key_hash = Bitcoin.crypto.hash160(pub_key)
        const redeem_script = Bitcoin.script.witnessPubKeyHash.output.encode(
            pub_key_hash
        )
        const redeem_script_hash = Bitcoin.crypto.hash160(redeem_script)
        const script_pub_key = Bitcoin.script.scriptHash.output.encode(
            redeem_script_hash
        )
        return Bitcoin.address.fromOutputScript(script_pub_key, network)
    }
}

function isAddress(address) {
    return (
        validateAddress({ address, network: network_mainnet }) ||
        validateAddress({ address, network: network_testnet })
    )
}

function validateAddress({ address, network, segwit }) {
    try {
        const { version } = Bitcoin.address.fromBase58Check(address)
        if (segwit === true) {
            return version === network.scriptHash
        }
        if (segwit === false) {
            return version === network.pubKeyHash
        }
        return version === network.pubKeyHash || version === network.scriptHash
    } catch (e) {
        return false
    }
}

function toSatoshis(value) {
    return limitDecimals(toBigUnit({ value, decimals }), decimals)
}

function fromSatoshis(value) {
    return limitDecimals(toSmallUnit({ value, decimals }), decimals)
}

function getRedeemScript(ecpair) {
    const pubKey = ecpair.getPublicKeyBuffer()
    const pubKeyHash = Bitcoin.crypto.hash160(pubKey)
    return Bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
}

module.exports = {
    decimals,
    getPrivateKeyFromSeed,
    getAddressFromSeed,
    getAddressFromPrivateKey,
    isAddress,
    validateAddress,
    toSatoshis,
    fromSatoshis,
    getRedeemScript
}
