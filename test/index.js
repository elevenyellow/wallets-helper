const test = require('ava')
const {
    getCoin,
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

test('toBigUnit toSmallUnit', async t => {
    const value = '0.03141321692811513'
    const sat = toSmallUnit({ value, decimals: 8 })
    t.is(toBigUnit({ value: sat, decimals: 8 }), value)
})

test('toBigUnit toSmallUnit using symbols', async t => {
    const value = '0.03141321692811513'
    const symbol = 'BTC'
    const sat = toSmallUnit({ value, symbol })
    const sat2 = toSmallUnit({ value, decimals: 8 })
    t.is(sat, sat2)
    t.is(toBigUnit({ value: sat, symbol }), value)
})
