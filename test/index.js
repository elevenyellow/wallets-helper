const test = require('ava')
const { getCoin, getNetwork } = require('../')

test('getCoin', async t => {
    const btc1 = getCoin({ symbol: 'btc' })
    const btc2 = require('../BTC')
    t.is(btc1, btc2)
})

test('getCoin not found', async t => {
    try {
        getCoin({ symbol: 'dadada' })
    } catch (e) {
        t.is(typeof e, 'string')
    }
})

test('getNetwork default', async t => {
    const { networks } = require('../BTC')
    const network = getNetwork({ symbol: 'btc' })
    t.is(networks.mainnet, network)
})

test('getNetwork', async t => {
    const { networks } = require('../BTC')
    const network_index = getNetwork({ symbol: 'btc', name: 0 })
    const network_name = getNetwork({ symbol: 'btc', name: 'MainNet' })
    t.is(networks.mainnet, network_index)
    t.is(networks.mainnet, network_name)
})

test('getNetwork not found symbol', async t => {
    try {
        getNetwork({ symbol: 'dada' })
    } catch (e) {
        t.is(typeof e, 'string')
    }
})

test('getNetwork not found name', async t => {
    const network = getNetwork({ symbol: 'btc', name: 'dadada' })
    t.is(undefined, network)
})

test('getNetwork testnet', async t => {
    const { networks } = require('../BTC')
    const network_index = getNetwork({ symbol: 'btc', name: 1 })
    const network_name = getNetwork({ symbol: 'btc', name: 'TESTNET' })
    t.is(networks.testnet, network_index)
    t.is(networks.testnet, network_name)
})
