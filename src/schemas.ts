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
