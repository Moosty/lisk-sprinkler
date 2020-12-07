"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprinklerModule = void 0;
const {BaseModule} = require("lisk-sdk");
const _1 = require(".");
const {getAllUsernamesAsJSON} = require("./sprinkler_asset");
class SprinklerModule extends BaseModule {
    constructor() {
        super(...arguments);
        this.name = "sprinkler";
        this.id = 6666;
        this.transactionAssets = [new _1.SprinklerTransaction()];
        this.accountSchema = {
            type: "object",
            required: ["username"],
            properties: {
                username: {
                    dataType: "string",
                    fieldNumber: 1,
                }
            },
            default: {
                username: ""
            },
        };
        this.actions = {
            getAllUsernames: async () => getAllUsernamesAsJSON(this._dataAccess),
        };
        this.beforeTransactionApply = async ({ transaction, stateStore, reducerHandler }) => {
            if (transaction.moduleID === 6666) {
                const sender = await stateStore.account.getOrDefault(transaction.senderAddress);
                await stateStore.account.set(transaction.senderAddress, sender);
                await reducerHandler.invoke("token:credit", {
                    address: transaction.senderAddress,
                    amount: BigInt(6000000),
                });
            }
        };
    }
}
exports.SprinklerModule = SprinklerModule;
//# sourceMappingURL=sprinkler_module.js.map
