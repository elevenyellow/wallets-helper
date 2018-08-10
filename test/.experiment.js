const Bitcoin = require('bitcoinjs-lib')
const Ethereum = require('ethereumjs-util')
const { getSeedFromMnemonic, derivePath } = require('../BTC')
const mnemonic =
    'property bone kite yard announce enjoy legal load raven praise hurdle point'

let seed = getSeedFromMnemonic({ mnemonic })
seed = derivePath({ seed, path: "m/44'/60'/0'/0/0" })
var privKeyBuffer = seed.keyPair.d.toBuffer(32)
let pubkeyBuf = seed.keyPair.getPublicKeyBuffer()
addressBuffer = Ethereum.publicToAddress(pubkeyBuf)
hexAddress = addressBuffer.toString('hex')
checksumAddress = Ethereum.toChecksumAddress(hexAddress)
// let publicKeyHash = Bitcoin.crypto.hash160(pubkeyBuf)
console.log(pubkeyBuf.toString('hex'))
console.log(checksumAddress)
// console.log(Ethereum.pubToAddress(pubkeyBuf.toString('hex')))
// let address = Bitcoin.address.toBase58Check(
//     publicKeyHash,
//     Bitcoin.networks.bitcoin.pubKeyHash
// )
