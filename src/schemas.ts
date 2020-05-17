export const TransactionAssetSchema = {
    type: 'object',
    required: ['username'],
    properties: {
        username: {
            type: 'string',
            format: 'username'
        },
    },
};

export const baseTransaction = {
    $id: 'lisk/base-transaction',
    type: 'object',
    required: ['type', 'senderPublicKey', 'fee', 'nonce', 'asset', 'signatures'],
    properties: {
        blockId: {
            type: 'string',
            format: 'hex',
        },
        height: {
            type: 'integer',
            minimum: 0,
        },
        confirmations: {
            type: 'integer',
            minimum: 0,
        },
        type: {
            type: 'integer',
            minimum: 0,
        },
        nonce: {
            type: 'string',
            format: 'nonce',
        },
        fee: {
            type: 'string',
        },
        senderPublicKey: {
            type: 'string',
            format: 'publicKey',
        },
        signatures: {
            type: 'array',
            items: {
                oneOf: [
                    { type: 'string', format: 'signature' },
                    { type: 'string', format: 'emptyString' },
                ],
            },
            minItems: 1,
            maxItems: 64,
        },
        asset: {
            type: 'object',
        },
        receivedAt: {
            type: 'string',
            format: 'date-time',
        },
    },
};
