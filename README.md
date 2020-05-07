# Lisk-sprinkler
#### Type: 1300
#### SDK Versions: v4.0.0

`lisk-sprinkler` is a faucet transaction with username registration.

# Blockchain application installation
`npm install lisk-transaction`

```javascript
const { SprinklerTransaction } = require('@moosty/lisk-sprinkler');

app.registerTransaction(SprinklerTransaction);
```

```javascript
const { unConfiguredSprinklerTransaction } = require('@moosty/lisk-sprinkler');

// configure amount to receive from the transaction
const SprinklerTransaction = unConfiguredSprinklerTransaction({
  amount: "10000000000",
})
app.registerTransaction(SprinklerTransaction);
```

## Constants
`TRANSACTION_TYPE`: 1300

# Client side
## Syntax
```javascript
sprinklerTransaction(options);
```

## Parameters
`options`: Options to be used for creating Transaction.
- `networkIdentifier` (required): The ID of the network where the transaction will be broadcasted to.
- `username` (required): Username for account
- `passphrase` (optional): Passphrase to use to sign the transaction. If not provided at creation the transaction can be signed later.
- `secondPassphrase` (optional): Second passphrase to use to sign the transaction if the account has registered a second passphrase. If not provided at the creation, the transaction can be signed with the second passphrase later.

## Return value
`object`: Valid sprinkler transaction object.

### Example
```javascript
Transaction({
    networkIdentifier: '7158c297294a540bc9ac6e474529c3da38d03ece056e3fa2d98141e6ec54132d',
    username: 'johndoe',
    passphrase: "creek own stem final gate scrub live shallow stage host concert they"
});
/*
{
  senderPublicKey: "5c554d43301786aec29a09b13b485176e81d1532347a351aeafe018c199fd7ca",
  timestamp: 117410306,
  type: 1300,
  asset: {
    username: 'johndoe',
  }
}*/
```

# Change logs
`May 7th, 2020`: Created initial release
