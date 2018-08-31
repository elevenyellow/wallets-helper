const test = require('ava')
const {
    getRandomMnemonic,
    getSeedFromMnemonic,
    derivePath,
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
    toWei,
    fromWei
} = require('../ETH')

const network = networks.mainnet
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
    seed = derivePath({ seed, path: "m/44'/60'/0'/0/0" })
    const private_key = getPrivateKeyFromSeed({ seed })
    t.is(
        private_key,
        '0x3c83a5325864029bf3b37af0802f51722b2d9072b4aaf6cc06c8ea369d28f762'
    )
})

test('getAddressFromSeed', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    seed = derivePath({ seed, path: "m/44'/60'/0'/0/0" })
    const address = getAddressFromSeed({ seed })
    t.is(address, '0xF463dD22496D680f2f58C9c0a1628d8A01B88062')
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
    t.is(
        private_key,
        '0x9a36714ae0687d67115cf377e9a3b9c484958ca61df64f87a8f1b1493f46011d'
    )
})

// test('deriveIndex', async t => {
//     let seed = getSeedFromMnemonic({ mnemonic, network })
//     let seed1 = derivePath({ seed, path: "m/44'/0'/0'/0/25" })
//     let seed2 = derivePath({ seed, path: "m/44'/0'/0'/0" })
//     seed2 = deriveIndex({ seed: seed2, index: 25 })
//     let private_key1 = getPrivateKeyFromSeed({ seed: seed1 })
//     let private_key2 = getPrivateKeyFromSeed({ seed: seed2 })
//     t.is(private_key1, private_key2)
//     t.is(
//         private_key1,
//         '0x9a36714ae0687d67115cf377e9a3b9c484958ca61df64f87a8f1b1493f46011d'
//     )
// })

test('getExtendedPrivateKeyFromSeed', async t => {
    let seed = getSeedFromMnemonic({ mnemonic, network })
    let address1 = getAddressFromSeed({ seed, network })
    t.is(address1, '0x3398D7126b72AF327dd299F8E3e77E6E2A9a884f')
    let xprv = getExtendedPrivateKeyFromSeed({ seed })
    let seed_xprv = getSeedFromExtended({ extended: xprv })
    let private_key = getPrivateKeyFromSeed({ seed: seed_xprv })
    let address2 = getAddressFromSeed({ seed: seed_xprv, network })
    t.is(typeof xprv, 'string')
    t.deepEqual(seed, seed_xprv)
    t.is(
        private_key,
        '0x35f4696b6e1b925c98e2ec1784a8bef021e60bbaf4d1f3e5c01389b0a60b72d6'
    )
    t.is(address1, '0x3398D7126b72AF327dd299F8E3e77E6E2A9a884f')
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
    t.is(address, '0x3398D7126b72AF327dd299F8E3e77E6E2A9a884f')
})

test('isAddress', async t => {
    // mainnet
    t.is(isAddress('0xEcCab7Ac3e7441857DE4EffbE54413c08b6dd36B'), true)
    t.is(isAddress('0xeccab7ac3e7441857de4effbe54413c08b6dd36b'), true)
    // fails
    t.is(isAddress('0xEcCab7Ac3e7441857DE4EffbE54413c08b6dd36'), false)
    t.is(isAddress('EcCab7Ac3e7441857DE4EffbE54413c08b6dd36B'), false)
    // others
    t.is(isAddress('LKdtZXQX3v9Z7dGzPUtPxXrKLDJPTFi15n'), false)
    t.is(isAddress('38h7N7oPLvu2mWGuXGX3GZBEG2yFG41THb'), false)
})

test('toWei', async t => {
    const value = '1'
    t.is(toWei(value), '1000000000000000000')
})

test('fromWei', async t => {
    const value = '123456789'
    t.is(fromWei(value), '0.000000000123456789')
})
