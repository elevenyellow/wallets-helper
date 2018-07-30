const requires = {}

function getCoin({ symbol }) {
    symbol = symbol.toUpperCase()
    if (requires[symbol] === undefined) {
        try {
            requires[symbol] = require(`./${symbol}`)
        } catch (e) {
            throw `${symbol} not found`
        }
    }
    return requires[symbol]
}

function getNetwork({ symbol, name }) {
    const coin = getCoin({ symbol })
    const { networks } = coin
    if (name === undefined) {
        return networks[0]
    } else {
        name = String(name).toLowerCase()
        if (networks.hasOwnProperty(name)) {
            return networks[name]
        }
    }
}

module.exports = { getCoin, getNetwork }
