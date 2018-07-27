# Install

```
npm i @elevenyellow.com/wallets-helpers
```

# Types / Naming / Terms

### mnemonic `string`

In this library we call mnemonic to the words (usually 12 or 24) that are used to recover a wallet.

# API

## getRandomMnemonic({ [words] }) : `mnemonic`

Used to create a new random `mnemonic`.

### Params

-   words:`string` _optional_ default=24

### Returns

mnemonic:`string`

### Example

```js
import { getRandomMnemonic } from 'wallets-helpers'
const mnemonic = getRandomMnemonic({ words: 12 })
```
