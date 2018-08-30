const test = require('ava')
const {
    getCoin,
    getNetwork,
    getDerivationPath,
    validateMnemonic,
    limitDecimals,
    toSatoshi,
    fromSatoshi
} = require('../')

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
    t.is(networks[0].config, network)
})

test('getNetwork', async t => {
    const { networks } = require('../BTC')
    const network_index = getNetwork({ symbol: 'btc', name: 0 })
    const network_name = getNetwork({ symbol: 'btc', name: 'MainNet' })
    t.is(networks[0].config, network_index)
    t.is(networks[0].config, network_name)
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
    t.is(networks[1].config, network_index)
    t.is(networks[1].config, network_name)
})

test('getDerivationPath default', async t => {
    const { networks } = require('../BTC')
    const network = getDerivationPath({ symbol: 'btc' })
    t.is(networks[0].path.true, network)
})

test('getDerivationPath', async t => {
    const { networks } = require('../BTC')
    const network_index = getDerivationPath({ symbol: 'btc', name: 0 })
    const network_name = getDerivationPath({ symbol: 'btc', name: 'MainNet' })
    const network_segwit = getDerivationPath({
        symbol: 'btc',
        name: 'MainNet',
        segwit: false
    })
    const network_segwitnotfound = getDerivationPath({
        symbol: 'btc',
        name: 'testnet',
        segwit: 'dadadada'
    })
    t.is(networks[0].path.true, network_index)
    t.is(networks[0].path.true, network_name)
    t.is(networks[0].path.false, network_segwit)
    t.is(networks[1].path.true, network_segwitnotfound)
})

test('validateMnemonic', async t => {
    const mnemonic =
        'property bone kite yard announce enjoy legal load raven praise hurdle point'
    t.is(validateMnemonic(mnemonic), true)
})

test('limitDecimals', async t => {
    t.is(limitDecimals('1.1234567890'), '1.123456789')
    t.is(limitDecimals('1.1234567890', 5), '1.12345')
    t.is(limitDecimals('1.1234567890', 2), '1.12')
    t.is(limitDecimals('1.1234567890', 3), '1.123')
    t.is(limitDecimals('1.1234567890', 4), '1.1234')
    t.is(limitDecimals('1.1234567890', 20), '1.123456789')
    t.is(limitDecimals('1.00', 2), '1')
    t.is(limitDecimals('1.00000000000000001', 2), '1')
    t.is(limitDecimals('1.04000000000000001', 2), '1.04')
    t.is(limitDecimals('1', 2), '1')
    t.is(limitDecimals('65486585', 2), '65486585')
    t.is(
        limitDecimals(
            '1.12345678901234567890123456789012345678901234567890',
            30
        ),
        '1.12345678901234567890123456789'
    )
})

// test('toSatoshi fromSatoshi', async t => {
//     const value = '0.031413213141301200000001'
//     const sat = toSatoshi(value, 8)

//     t.is(fromSatoshi(sat, 8), value)
// })
