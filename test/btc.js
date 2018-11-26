const test = require('ava')
const {
    getRandomMnemonic,
    getSeedFromMnemonic,
    derivePath,
    deriveIndex,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended
} = require('../')
const {
    networks,
    getPrivateKeyFromSeed,
    getAddressFromSeed,
    getAddressFromPrivateKey,
    isAddress,
    validateAddress
} = require('../BTC')
const { SYMBOL, NETWORK } = require('@elevenyellow.com/blockchain-helpers')
const { getNetwork } = require('@elevenyellow.com/blockchain-helpers/networks')

const network_mainnet = getNetwork({
    symbol: SYMBOL.BTC,
    name: NETWORK.MAINNET
})
const network_testnet = getNetwork({
    symbol: SYMBOL.BTC,
    name: NETWORK.TESTNET
})

const network = network_mainnet
const mnemonic =
    'property bone kite yard announce enjoy legal load raven praise hurdle point'

test('getRandomMnemonic', async t => {
    const mnemonic1 = getRandomMnemonic({ words: 12 })
    const mnemonic2 = getRandomMnemonic({ words: 24 })
    t.is(mnemonic1.split(' ').length, 12)
    t.is(mnemonic2.split(' ').length, 24)
    t.is(mnemonic1, mnemonic1.toLowerCase())
})

test('getSeedFromMnemonic', async t => {
    const seed = getSeedFromMnemonic({ mnemonic, network })
    t.is(typeof seed, 'object')
})

test('getPrivateKeyFromSeed', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    seed = derivePath({ seed, path: "m/49'/0'/0'/0/0" })
    const private_key = getPrivateKeyFromSeed({ seed })
    t.is(private_key, 'L2fEgQek5FGVwrGgkAxJGeQBBAAtpGxr2eHzcTn7SQXwN3T4r61D')
})

test('getAddressFromSeed', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    seed = derivePath({ seed, path: "m/49'/0'/0'/0/0" })
    const address_segwit = getAddressFromSeed({ seed, network })
    const address_regular = getAddressFromSeed({ seed, network, segwit: false })
    t.is(address_segwit, '3Ld6pXThgQEavFdWzZACiSaArheSLF5Mwd')
    t.is(address_regular, '1CVDiedHHFrCf5ZjdPoDcQJCxbjbHbqFYD')
})

test('getAddressFromPrivateKey', async t => {
    const seed = getSeedFromMnemonic({ mnemonic, network })
    const private_key = getPrivateKeyFromSeed({ seed })
    const address_seed = getAddressFromSeed({ seed, network })
    const address_private = getAddressFromPrivateKey({ private_key, network })
    t.is(address_seed, address_private)
    const address_seed2 = getAddressFromSeed({ seed, network, segwit: false })
    const address_private2 = getAddressFromPrivateKey({
        private_key,
        network,
        segwit: false
    })
    t.is(address_seed2, address_private2)
})

test('derivePath', async t => {
    const seed = getSeedFromMnemonic({ mnemonic, network })
    const seed_rerived = derivePath({ seed, path: "m/44'/0'/0'/0/25" })
    t.deepEqual(Object.keys(seed), Object.keys(seed_rerived))
    const private_key = getPrivateKeyFromSeed({ seed: seed_rerived })
    t.is(private_key, 'L2PUoVDh2hpKzfRGcbuQW9NHssEBbX7gEuWobWhzmqan2iKVhtcL')
})

test('deriveIndex', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    let seed1 = derivePath({ seed, path: "m/44'/0'/0'/0/25" })
    let seed2 = derivePath({ seed, path: "m/44'/0'/0'/0" })
    seed2 = deriveIndex({ seed: seed2, index: 25 })
    let private_key1 = getPrivateKeyFromSeed({ seed: seed1 })
    let private_key2 = getPrivateKeyFromSeed({ seed: seed2 })
    t.is(private_key1, private_key2)
    t.is(private_key1, 'L2PUoVDh2hpKzfRGcbuQW9NHssEBbX7gEuWobWhzmqan2iKVhtcL')
})

test('getExtendedPrivateKeyFromSeed', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    let address1 = getAddressFromSeed({ seed, network })
    t.is(address1, '38h7N7oPLvu2mWGuXGX3GZBEG2yFG41THb')
    let xprv = getExtendedPrivateKeyFromSeed({ seed })
    let seed_xprv = getSeedFromExtended({ extended: xprv })
    let private_key = getPrivateKeyFromSeed({ seed: seed_xprv })
    let address2 = getAddressFromSeed({ seed: seed_xprv, network })
    t.is(typeof xprv, 'string')
    t.deepEqual(seed, seed_xprv)
    t.is(private_key, 'Ky2bHBM83SHKgFEPokMo7LGZLeR9bUCpdw2LyudmAZbZC4QU8CpE')
    t.is(address1, '38h7N7oPLvu2mWGuXGX3GZBEG2yFG41THb')
    t.is(address1, address2)
})

test('getExtendedPublicKeyFromSeed', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    let xpub = getExtendedPublicKeyFromSeed({ seed })
    let seed_xpub = getSeedFromExtended({ extended: xpub })
    let address = getAddressFromSeed({ seed: seed_xpub })
    try {
        // This does not work because xpub can't generate private keys
        getPrivateKeyFromSeed({ seed: seed_xpub })
    } catch (e) {
        t.is(true, true)
    }
    t.is(typeof xpub, 'string')
    t.is(address, '38h7N7oPLvu2mWGuXGX3GZBEG2yFG41THb')
})

test('isAddress', async t => {
    // mainnet
    t.is(
        isAddress({
            address: '15PWEzk1969ZKeT51cYu1Fcp1KPhMwAJGb',
            network: network_mainnet
        }),
        true
    )
    t.is(
        isAddress({
            address: '38h7N7oPLvu2mWGuXGX3GZBEG2yFG41THb',
            network: network_mainnet
        }),
        true
    ) // segwit
    // testnet
    t.is(
        isAddress({
            address: 'n3us2VsMjMcepehnDQXGB8pSXJ5XkSbsRZ',
            network: network_testnet
        }),
        true
    )
    t.is(
        isAddress({
            address: '2MtChAUk4oXWhFPxPAPwh68Xw42ZfAux6xh',
            network: network_testnet
        }),
        true
    ) // segwit
    // fails
    t.is(
        isAddress({ address: 'LKdtZXQX3v9Z7dGzPUtPxXrKLDJPTFi15n', network }),
        false
    ) // ltc
    t.is(isAddress({ address: 'dadada', network }), false)
})

test('validateAddress', async t => {
    t.is(
        validateAddress({
            address: '15PWEzk1969ZKeT51cYu1Fcp1KPhMwAJGb',
            network: network_mainnet,
            segwit: false
        }),
        true
    )
    t.is(
        validateAddress({
            address: '38h7N7oPLvu2mWGuXGX3GZBEG2yFG41THb',
            network: network_mainnet,
            segwit: true
        }),
        true
    )
    t.is(
        validateAddress({
            address: 'n3us2VsMjMcepehnDQXGB8pSXJ5XkSbsRZ',
            network: network_testnet,
            segwit: false
        }),
        true
    )
    t.is(
        validateAddress({
            address: '2MtChAUk4oXWhFPxPAPwh68Xw42ZfAux6xh',
            network: network_testnet,
            segwit: true
        }),
        true
    )

    // fails
    t.is(
        validateAddress({
            address: '15PWEzk1969ZKeT51cYu1Fcp1KPhMwAJGb',
            network: network_mainnet,
            segwit: true
        }),
        false
    )

    t.is(
        validateAddress({
            address: '2MtChAUk4oXWhFPxPAPwh68Xw42ZfAux6xh',
            network: network_testnet,
            segwit: false
        }),
        false
    )
})
