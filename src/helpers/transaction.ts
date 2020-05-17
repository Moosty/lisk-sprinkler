import {
    isValidFee,
    isValidNonce,
    validateNetworkIdentifier,
} from '@liskhq/lisk-validator';
import { TransactionJSON } from '@liskhq/lisk-transactions';
import { createBaseTransaction } from '@liskhq/lisk-transactions/dist-node/utils'
import { SprinklerTransaction } from '../';
import {TRANSACTION_TYPE} from "../constants";

export interface Inputs {
    readonly fee: string;
    readonly nonce: string;
    readonly networkIdentifier: string;
    readonly username: string;
    readonly senderPublicKey?: string;
    readonly passphrase?: string;
    readonly passphrases?: ReadonlyArray<string>;
    readonly keys?: {
        readonly mandatoryKeys: Array<Readonly<string>>;
        readonly optionalKeys: Array<Readonly<string>>;
    };
}

const validateInputs = ({
                            username,
                            networkIdentifier,
                            fee,
                            nonce,
                        }: Inputs): void => {
    if (!isValidNonce(nonce)) {
        throw new Error('Nonce must be a valid number in string format.');
    }

    if (!username || typeof username !== 'string') {
        throw new Error('Please provide a username. Expected string.');
    }

    if (username.length > 20) {
        throw new Error(
            `Username length does not match requirements. Expected to be no more than 20 characters.`,
        );
    }

    if (!isValidFee(fee)) {
        throw new Error('Fee must be a valid number in string format.');
    }

    validateNetworkIdentifier(networkIdentifier);
};

export const sprinkler = (inputs: Inputs): Partial<TransactionJSON> => {
    validateInputs(inputs);
    const {
        username,
        passphrase,
        networkIdentifier,
        passphrases,
        keys,
        senderPublicKey,
    } = inputs;

    const tx = {
        ...createBaseTransaction(inputs),
        type: TRANSACTION_TYPE,
        // For txs from multisig senderPublicKey must be set before attempting signing
        senderPublicKey,
        asset: {
            username,
        },
    };

    if (!passphrase && !passphrases?.length) {
        return tx;
    }

    const transactionWithSenderInfo = {
        ...tx,
        senderPublicKey: tx.senderPublicKey as string,
        asset: {
            ...tx.asset,
        },
    };

    const transactionTransaction = new SprinklerTransaction(
        transactionWithSenderInfo,
    );

    if (passphrase) {
        transactionTransaction.sign(networkIdentifier, passphrase);

        return transactionTransaction.toJSON();
    }

    if (passphrases && keys) {
        transactionTransaction.sign(networkIdentifier, undefined, passphrases, keys);

        return transactionTransaction.toJSON();
    }

    return transactionWithSenderInfo;
};
