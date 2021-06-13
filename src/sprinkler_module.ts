import {GenesisConfig, TransactionApplyContext} from 'lisk-sdk';
import {BaseModule} from 'lisk-framework/dist-node/modules/base_module'
import {SprinklerTransaction} from ".";
import {getAllUsernamesAsJSON} from './sprinkler_asset';

export class SprinklerModule extends BaseModule {
  public name = "sprinkler";
  public id = 6666;
  public accountSchema = {
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

  public constructor(genesisConfig: GenesisConfig) {
    super(genesisConfig);
    this.transactionAssets = [new SprinklerTransaction()];
  }

  public actions = {
    getAllUsernames: async () => getAllUsernamesAsJSON(this._dataAccess),
  };

  public async beforeTransactionApply({transaction, stateStore, reducerHandler}: TransactionApplyContext) {
    if (transaction.moduleID === 6666) {
      const sender = await stateStore.account.getOrDefault(transaction.senderAddress);
      await stateStore.account.set(transaction.senderAddress, sender);
      await reducerHandler.invoke("token:credit", {
        address: transaction.senderAddress,
        amount: BigInt(6000000),
      });
    }
  }
}
