"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprinklerTransaction = void 0;
const {BaseAsset} = require("lisk-sdk");
class SprinklerTransaction extends BaseAsset {
    constructor() {
        super(...arguments);
        this.name = "sprinkle";
        this.id = 100;
        this.schema = {
            $id: "lisk/token/sprinkle",
            type: "object",
            required: ["username"],
            properties: {
                username: {
                    fieldNumber: 1,
                    dataType: "string",
                    minLength: 3,
                    maxLength: 50
                }
            }
        };
        this.apply = async ({ transaction, asset, stateStore, reducerHandler }) => {
            const senderAddress = transaction.senderAddress;
            const senderAccount = await stateStore.account.getOrDefault(senderAddress);
            if (!senderAccount.sprinkler.username) {
                senderAccount.sprinkler.username = asset.username;
                await stateStore.account.set(senderAddress, senderAccount);
            }
            const senderBalance = await reducerHandler.invoke("token:getBalance", {
                address: senderAddress,
            });
            if (senderBalance > BigInt(100000000)) {
                throw new Error(`Invalid account balance`);
            }
            await reducerHandler.invoke("token:credit", {
                address: senderAddress,
                amount: BigInt(100000000000),
            });
        };
    }
}
exports.SprinklerTransaction = SprinklerTransaction;
//# sourceMappingURL=sprinkler_transaction.js.map
