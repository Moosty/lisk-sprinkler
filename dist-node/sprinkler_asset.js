"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sprinklerAssetSchema = exports.createSprinklerAccount = exports.getAllUsernamesAsJSON = exports.getAllSprinklerAccounts = exports.setAllSprinklerAccounts = exports.CHAIN_STATE_SPRINKLER = void 0;
const lisk_sdk_1 = require("lisk-sdk");
const sprinklerAssetSchema = {
    $id: "lisk/sprinkler/usernames",
    type: "object",
    required: ["registeredUsernames"],
    properties: {
        registeredUsernames: {
            type: "array",
            fieldNumber: 1,
            items: {
                type: "object",
                required: ["id", "username", "ownerAddress"],
                properties: {
                    id: {
                        dataType: "bytes",
                        fieldNumber: 1,
                    },
                    username: {
                        dataType: "string",
                        fieldNumber: 2,
                    },
                    ownerAddress: {
                        dataType: "bytes",
                        fieldNumber: 3,
                    },
                },
            },
        },
    },
};
exports.sprinklerAssetSchema = sprinklerAssetSchema;
const CHAIN_STATE_SPRINKLER = "sprinkler:usernames";
exports.CHAIN_STATE_SPRINKLER = CHAIN_STATE_SPRINKLER;
const createSprinklerAccount = ({ ownerAddress, nonce, username }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce);
    const seed = Buffer.concat([ownerAddress, nonceBuffer]);
    const id = lisk_sdk_1.cryptography.hash(seed);
    return {
        id,
        ownerAddress,
        username,
    };
};
exports.createSprinklerAccount = createSprinklerAccount;
const getAllSprinklerAccounts = async (stateStore) => {
    const registeredAccountsBuffer = await stateStore.chain.get(CHAIN_STATE_SPRINKLER);
    if (!registeredAccountsBuffer) {
        return [];
    }
    const registeredAccounts = lisk_sdk_1.codec.decode(sprinklerAssetSchema, registeredAccountsBuffer);
    return registeredAccounts.registeredUsernames;
};
exports.getAllSprinklerAccounts = getAllSprinklerAccounts;
const getAllUsernamesAsJSON = async (dataAccess) => {
    const registeredAccountsBuffer = await dataAccess.getChainState(CHAIN_STATE_SPRINKLER);
    if (!registeredAccountsBuffer) {
        return [];
    }
    const registeredAccounts = lisk_sdk_1.codec.decode(sprinklerAssetSchema, registeredAccountsBuffer);
    const accountJSON = lisk_sdk_1.codec.toJSON(sprinklerAssetSchema, registeredAccounts);
    return accountJSON.registeredUsernames;
};
exports.getAllUsernamesAsJSON = getAllUsernamesAsJSON;
const setAllSprinklerAccounts = async (stateStore, sprinklerAccounts) => {
    const registeredAccounts = {
        registeredSprinklerAccounts: sprinklerAccounts.sort((a, b) => a.id.compare(b.id))
    };
    await stateStore.chain.set(CHAIN_STATE_SPRINKLER, lisk_sdk_1.codec.encode(sprinklerAssetSchema, registeredAccounts));
};
exports.setAllSprinklerAccounts = setAllSprinklerAccounts;
//# sourceMappingURL=sprinkler_asset.js.map