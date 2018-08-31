## /BTC

### getPrivateKeyFromSeed({ seed }) : private_key

It gets a private key from a seed.

#### Params

-   seed:`object`

#### Returns

private_key:`string`

### getAddressFromSeed({ seed, network, [segwit] }) : address

It gets an address from a seed.

#### Params

-   seed:`object`
-   network:`object`
-   segwit:`boolean` _optional_ default=true

#### Returns

address:`string`

### getAddressFromPrivateKey({ private_key, network, [segwit] }) : address

It gets an address from a private key.

#### Params

-   private_key:`string`
-   network:`object`
-   segwit:`boolean` _optional_ default=true

#### Returns

address:`string`

### isAddress(address) : boolean

Used to create a new random mnemonic.

#### Params

-   address:`string`

#### Returns

`boolean`

### toSatoshis(number) : string

#### Params

-   number:`string`

#### Returns

`string`

### fromSatoshis(number) : string

#### Params

-   number:`string`

#### Returns

`string`
