const test = require('ava')
const { getCoin, validateMnemonic } = require('../')

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
