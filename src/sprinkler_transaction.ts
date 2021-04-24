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

    if (!senderAccount.sprinkler.username &&
      allUsernames.registeredUsernames.find(ru => ru.username === asset.username)) {
      throw new Error(
        `Username is already in use`,
      );
    }
    if (!senderAccount.sprinkler.username &&
      !allUsernames.registeredUsernames.find(ru => ru.username === asset.username)) {
      senderAccount.sprinkler.username = asset.username;
      await stateStore.account.set(senderAddress, senderAccount);
      allUsernames.registeredUsernames.push(createSprinklerAccount({
        ownerAddress: transaction.senderAddress,
        nonce: 0,
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
