const crypto = require('crypto')
const Bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39crypto')

function getRandomMnemonic({ words } = { words: 24 }) {
    const strength = ((words / 3) * 32) / 8
    const entropy = crypto.randomBytes(strength)
    return bip39.entropyToMnemonic(entropy)
}

function getSeedFromMnemonic({ mnemonic, passphase = '', network }) {
    const mnemonic_hex = bip39.mnemonicToSeed(mnemonic, passphase)
    return Bitcoin.HDNode.fromSeedHex(mnemonic_hex, network)
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

function getAddressFromSeed({ seed, network, segwit = true }) {
    const keypair = seed.keyPair
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

function getAddressFromPrivateKey({ private_key, network, segwit }) {
    const keypair = Bitcoin.ECPair.fromWIF(private_key, network)
    return getAddressFromKeypair({ keypair, network, segwit })
}

function getPrivateKeyFromSeed({ seed }) {
    const keypair = seed.keyPair
    return keypair.toWIF().toString()
}

function derivePath({ seed, path }) {
    return seed.derivePath(path)
}

function deriveIndex({ seed, index }) {
    return seed.derive(index)
}

module.exports = {
    networks: Bitcoin.networks,
    getRandomMnemonic,
    getSeedFromMnemonic,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended,
    getAddressFromSeed,
    getAddressFromKeypair,
    getAddressFromPrivateKey,
    getPrivateKeyFromSeed,
    derivePath,
    deriveIndex
}
