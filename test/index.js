const test = require('ava')
const {
    getCoin,
    getNetwork,
    getDerivationPath,
    validateMnemonic,
    limitDecimals,
    toBigUnit,
    toSmallUnit
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

test('getDerivationPath', async t => {
    t.is(getDerivationPath({ symbol: 'btc', index: 0 }), "m/49'/0'/0'/0/0")
    t.is(
        getDerivationPath({ symbol: 'btc', index: 0, segwit: false }),
        "m/44'/0'/0'/0/0"
    )
    t.is(
        getDerivationPath({ symbol: 'btc', index: 0, name: 0 }),
        "m/49'/0'/0'/0/0"
    )
    t.is(
        getDerivationPath({ symbol: 'btc', index: 0, name: 'TestNet' }),
        "m/49'/1'/0'/0/0"
    )
    t.is(getDerivationPath({ symbol: 'btc', index: 25 }), "m/49'/0'/0'/0/25")
    t.is(
        getDerivationPath({ symbol: 'btc', index: 25, account: 1 }),
        "m/49'/0'/1'/0/25"
    )
    t.is(
        getDerivationPath({
            symbol: 'btc',
            index: 25,
            account: 1,
            external: 2
        }),
        "m/49'/0'/1'/2/25"
    )
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

// test('toBigUnit toSmallUnit', async t => {
//     const value = '0.031413213141301200000001'
//     const sat = toBigUnit(value, 8)

//     t.is(toSmallUnit(sat, 8), value)
// })
