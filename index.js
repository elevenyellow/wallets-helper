const requires = {}

function getCoin({ symbol }) {
    symbol = symbol.toUpperCase()
    if (!requires.hasOwnProperty(symbol)) {
        try {
            requires[symbol] = require(`./${symbol}`)
        } catch (e) {
            throw `Symbol ${symbol} not found`
        }
    }
    return requires[symbol]
}

function getNetwork({ symbol, name }) {
    const network = pickNetwork({ symbol, name })
    if (network) return network.config
}

function getDerivationPath({ symbol, name, segwit = true }) {
    const network = pickNetwork({ symbol, name })
    if (network)
        return network.path[segwit] || network.path.true || network.path.false
}

module.exports = { getCoin, getNetwork, getDerivationPath }

// Private
function pickNetwork({ symbol, name }) {
    const coin = getCoin({ symbol })
    const { networks } = coin
    if (name === undefined) {
        return networks[0]
    }
    name = String(name).toLowerCase()
    if (networks.hasOwnProperty(name)) {
        return networks[name]
    }
    return networks.find(n => n.name === name)
}
