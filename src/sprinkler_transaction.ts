import {BaseAsset} from 'lisk-sdk';
import {sprinkleTransactionAssetSchema} from "./schema";
import {createSprinklerAccount, getAllSprinklerAccounts, setAllSprinklerAccounts} from "./sprinkler_asset";

export class SprinklerTransaction extends BaseAsset {
  name = "sprinkle";
  id = 100;
  schema = sprinkleTransactionAssetSchema

  apply = async ({transaction, asset, stateStore, reducerHandler}) => {
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.getOrDefault(senderAddress);
    const allUsernames = await getAllSprinklerAccounts(stateStore);
    const foundUsername = allUsernames.find(ru => ru.username === asset.username)
    if (!senderAccount.sprinkler.username && foundUsername) {
      throw new Error(
        `Username is already in use`,
      );
    }
    if (!senderAccount.sprinkler.username) {
      senderAccount.sprinkler.username = asset.username;
      await stateStore.account.set(senderAddress, senderAccount);
      allUsernames.push(createSprinklerAccount({
        ownerAddress: transaction.senderAddress,
        nonce: BigInt(0),
        username: asset.username,
      }))
      await setAllSprinklerAccounts(stateStore, allUsernames)
    }
    const senderBalance = await reducerHandler.invoke("token:getBalance", {
      address: senderAddress,
    });

    if (senderBalance > BigInt(100000000)) {
      throw new Error(
        `Invalid account balance`,
      );
    }
    await reducerHandler.invoke("token:credit", {
      address: senderAddress,
      amount: BigInt(100000000000),
    });
  }
}
