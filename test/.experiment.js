const Bitcoin = require('bitcoinjs-lib')
const Ethereum = require('ethereumjs-util')
const bs58check = require('bs58check')
const secp256k1 = require('secp256k1')
const createKeccakHash = require('keccak')

const { getSeedFromMnemonic, derivePath } = require('../BTC')

const mnemonic =
    'property bone kite yard announce enjoy legal load raven praise hurdle point'

let seed = getSeedFromMnemonic({ mnemonic })
seed = derivePath({ seed, path: "m/44'/60'/0'/0/0" })
let pubkeyBuf = seed.keyPair.getPublicKeyBuffer()
if (pubkeyBuf.length !== 64) {
    pubKey = secp256k1.publicKeyConvert(pubkeyBuf, false).slice(1)
}

function keccak(a, bits) {
    return createKeccakHash('keccak256')
        .update(a)
        .digest()
}

addr = keccak(pubKey).slice(-20)
console.log(addr.toString('hex'))

// var privKeyBuffer = seed.keyPair.d.toBuffer(32)
// addressBuffer = Ethereum.publicToAddress(pubkeyBuf)
// hexAddress = addressBuffer.toString('hex')
// checksumAddress = Ethereum.toChecksumAddress(hexAddress)
// // let publicKeyHash = Bitcoin.crypto.hash160(pubkeyBuf)
// console.log(pubkeyBuf.toString('hex'))
// console.log(checksumAddress)
// // console.log(Ethereum.pubToAddress(pubkeyBuf.toString('hex')))
// // let address = Bitcoin.address.toBase58Check(
// //     publicKeyHash,
// //     Bitcoin.networks.bitcoin.pubKeyHash
// // )
