import {codec, cryptography} from 'lisk-sdk';
import {sprinklerModuleAssetSchema} from "./schema";

const CHAIN_STATE_SPRINKLER = "sprinkler:usernames";

const createSprinklerAccount = ({ownerAddress, nonce, username}) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([ownerAddress, nonceBuffer]);
  const id = cryptography.hash(seed);

  return {
    id,
    ownerAddress,
    username,
  };
};

const getAllSprinklerAccounts = async stateStore => {
  const registeredAccountsBuffer = await stateStore.chain.get(
    CHAIN_STATE_SPRINKLER
  );

  if (!registeredAccountsBuffer) {
    return [];
  }

  const registeredAccounts = codec.decode(
    sprinklerModuleAssetSchema,
    registeredAccountsBuffer
  ) as any;

  return registeredAccounts.registeredUsernames;
}

const getAllUsernamesAsJSON = async dataAccess => {
  const registeredAccountsBuffer = await dataAccess.getChainState(
    CHAIN_STATE_SPRINKLER
  );

  if (!registeredAccountsBuffer) {
    return [];
  }

  const registeredAccounts = codec.decode(
    sprinklerModuleAssetSchema,
    registeredAccountsBuffer
  ) as any;

  const accountJSON = codec.toJSON(sprinklerModuleAssetSchema, registeredAccounts) as any;

  return accountJSON.registeredUsernames;
}

const setAllSprinklerAccounts = async (stateStore, sprinklerAccounts) => {
  const registeredAccounts = {
    registeredUsernames: sprinklerAccounts.sort((a, b) => a.id.compare(b.id))
  };
  await stateStore.chain.set(
    CHAIN_STATE_SPRINKLER,
    codec.encode(sprinklerModuleAssetSchema, registeredAccounts)
  );
}

export {
  CHAIN_STATE_SPRINKLER,
  setAllSprinklerAccounts,
  getAllSprinklerAccounts,
  getAllUsernamesAsJSON,
  createSprinklerAccount,
}
