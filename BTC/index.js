const crypto = require('crypto')
const Bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39crypto')

const networks = [
    {
        name: 'mainnet',
        config: Bitcoin.networks.bitcoin,
        path: {
            false: "m/44'/0'/0'/0",
            true: "m/49'/0'/0'/0" // segwit
        }
    },
    {
        name: 'testnet',
        config: Bitcoin.networks.testnet,
        path: {
            false: "m/44'/1'/0'/0",
            true: "m/49'/1'/0'/0" // segwit
        }
    }
]

function getRandomMnemonic({ words } = { words: 24 }) {
    const strength = ((words / 3) * 32) / 8
    const entropy = crypto.randomBytes(strength)
    return bip39.entropyToMnemonic(entropy)
}

function getSeedFromMnemonic({ mnemonic, network, passphase = '' }) {
    const mnemonic_hex = bip39.mnemonicToSeed(mnemonic, passphase)
    return Bitcoin.HDNode.fromSeedHex(mnemonic_hex, network)
}

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

function isAddress(address) {
    return (
        validateAddress({ address, network: networks[0].config }) ||
        validateAddress({ address, network: networks[1].config })
    )
}

function validateAddress({ address, network, segwit }) {
    try {
        const { version } = Bitcoin.address.fromBase58Check(address)
        if (segwit === true) {
            return version === network.scriptHash
        } else if (segwit === false) {
            return version === network.pubKeyHash
        }
        return version === network.pubKeyHash || version === network.scriptHash
    } catch (e) {
        return false
    }
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
    getSeedFromExtended,
    isAddress,
    validateAddress
}
