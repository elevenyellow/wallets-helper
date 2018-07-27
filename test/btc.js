const test = require('ava')
const {
    networks,
    getRandomMnemonic,
    getSeedFromMnemonic,
    getExtendedPublicKeyFromSeed,
    getExtendedPrivateKeyFromSeed,
    getSeedFromExtended,
    getAddressFromSeed,
    getAddressFromPrivateKey,
    getPrivateKeyFromSeed,
    derivePath,
    deriveIndex
} = require('../BTC')

const network = networks.bitcoin
const mnemonic =
    'property bone kite yard announce enjoy legal load raven praise hurdle point'

test('getRandomMnemonic', async t => {
    const mnemonic1 = getRandomMnemonic({ words: 12 })
    const mnemonic2 = getRandomMnemonic({ words: 24 })
    t.deepEqual(mnemonic1.split(' ').length, 12)
    t.deepEqual(mnemonic2.split(' ').length, 24)
    t.deepEqual(mnemonic1, mnemonic1.toLowerCase())
})

// mnemonic = getRandomMnemonic()

// seed = getSeedFromMnemonic({ mnemonic, network })
// xprv = getExtendedPrivateKeyFromSeed({ seed })
// xpub = getExtendedPublicKeyFromSeed({ seed })
// seed = getSeedFromExtended({
//     extended: xprv,
//     network
// })
// seed = derivePath({ seed, path: "m/44'/0'/0'/0" })
// seed = deriveIndex({ seed, index: 0 })
// prv = getPrivateKeyFromSeed({ seed })

// console.log(mnemonic)
// console.log(xprv)
// console.log(xpub)
// console.log(prv)
// console.log(getAddressFromSeed({ seed, network }))
// console.log(getAddressFromSeed({ seed, segwit: false }))
// console.log(getAddressFromPrivateKey({ private_key: prv, network }))
// console.log(getAddressFromPrivateKey({ private_key: prv, segwit: false }))
