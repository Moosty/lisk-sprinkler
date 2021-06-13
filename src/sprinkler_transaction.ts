import {ApplyAssetContext, BaseAsset} from 'lisk-sdk';
import {sprinkleTransactionAssetSchema} from "./schema";
import {createSprinklerAccount, getAllSprinklerAccounts, setAllSprinklerAccounts} from "./sprinkler_asset";

interface SprinklerAccount {
  sprinkler: {
    username: string
  }
}

interface Asset {
  username: string;
}

export class SprinklerTransaction extends BaseAsset {
  public name = "sprinkle";
  public id = 100;
  public schema = sprinkleTransactionAssetSchema

  public async apply({transaction, asset, stateStore, reducerHandler}: ApplyAssetContext<Asset>): Promise<void> {
    const senderAccount = await stateStore.account.getOrDefault<SprinklerAccount>(transaction.senderAddress);
    const allUsernames = await getAllSprinklerAccounts(stateStore);
    const foundUsername = allUsernames.find(ru => ru.username === asset.username)
    if (!senderAccount.sprinkler.username && foundUsername) {
      throw new Error(
          `Username is already in use`,
      );
    }
    if (senderAccount.sprinkler && !senderAccount.sprinkler.username) {
      senderAccount.sprinkler.username = asset.username;
      await stateStore.account.set(transaction.senderAddress, senderAccount);
      allUsernames.push(createSprinklerAccount({
        ownerAddress: transaction.senderAddress,
        nonce: BigInt(0),
        username: asset.username,
      }))
      await setAllSprinklerAccounts(stateStore, allUsernames)
    }
    const senderBalance = await reducerHandler.invoke("token:getBalance", {
      address: transaction.senderAddress,
    }) as BigInt;

    if (senderBalance > BigInt(100000000)) {
      throw new Error(
          `Invalid account balance`,
      );
    }
    await reducerHandler.invoke("token:credit", {
      address: transaction.senderAddress,
      amount: BigInt(100000000000),
    });
  }
}
