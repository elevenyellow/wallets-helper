# Install

```
npm i @elevenyellow.com/wallets-helpers
```

# Types / Naming / Terms

### mnemonic `string`

Mnemonic are the words that are used to recover a wallet. Usually 12 or 24 words.

```
property bone kite yard announce enjoy legal load raven praise hurdle point
```

### seed `object`

A special object generated by [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) that allow us derive another seeds or export it in other formats.

### network `object`

Network is an object that determine what blockchain are you connecting with.

# API

## /BTC

### getRandomMnemonic({ [words] }) : mnemonic

Used to create a new random mnemonic.

#### Params

-   words:`number` _optional_ default=24

#### Returns

mnemonic:`string`

#### Example

```js
import { getRandomMnemonic } from 'wallets-helpers/BTC'
const mnemonic = getRandomMnemonic({ words: 12 })
```

### getSeedFromMnemonic({ mnemonic, network, [passphase] }) : seed

It creates a seed from the mnemonic passed.

#### Params

-   mnemonic:`string`
-   network:`object`
-   passphase:`string` _optional_

#### Returns

seed:`object`

#### Example

```js
import {
    networks,
    getRandomMnemonic,
    getSeedFromMnemonic
} from 'wallets-helpers/BTC'
const network = networks.mainnet
const mnemonic = getRandomMnemonic({ words: 12 })
const seed = getSeedFromMnemonic({ mnemonic, network })
```