import {stringToBuffer} from '@liskhq/lisk-cryptography';
import {validator} from '@liskhq/lisk-validator';
import {
    BaseTransaction,
    StateStore,
    StateStorePrepare,
    TransactionError,
    convertToAssetError,
    convertToTransactionError,
    utils,
    TransactionResponse,
    createResponse,
} from '@liskhq/lisk-transactions';

import {TRANSACTION_TYPE} from './constants';
import {TransactionAssetSchema, baseTransaction} from './schemas';
import {TransactionAsset, SprinklerTransactionInterface, SprinklerOptions} from './interfaces';

const {validateSenderIdAndPublicKey, getId} = utils;

// @ts-ignore
export class Sprinkler extends BaseTransaction {
    readonly asset: TransactionAsset;
    readonly amount: bigint;
    readonly balance: bigint;
    public static TYPE = TRANSACTION_TYPE;

    public constructor(rawTransaction: unknown, options: SprinklerOptions) {
        super(rawTransaction);
        const tx = (typeof rawTransaction === 'object' && rawTransaction !== null
            ? rawTransaction
            : {}) as Partial<SprinklerTransactionInterface>;

        this.fee = BigInt(1000);
        this.amount = BigInt(options.amount);
        this.balance = BigInt(options.balance);

        if (tx.asset) {
            this.asset = {
                ...tx.asset,
            } as TransactionAsset;
        } else {
            this.asset = {
                username: "",
            } as TransactionAsset;
        }
    }

    protected assetToBytes(): Buffer {
        return stringToBuffer(this.asset.username);
    }

    public async prepare(store: StateStorePrepare): Promise<void> {
        await store.account.cache([
            {
                address: this.senderId,
            },
        ]);
    }

    public assetToJSON(): object {
        return {
            ...this.asset,
        }
    }

    protected validateAsset(): ReadonlyArray<TransactionError> {
        const asset = this.assetToJSON();
        const schemaErrors = validator.validate(TransactionAssetSchema, asset);
        return convertToAssetError(
            this.id,
            schemaErrors,
        ) as TransactionError[];
    }

    protected async applyAsset(store: StateStore): Promise<ReadonlyArray<TransactionError>> {
        const errors: TransactionError[] = [];
        const sender = await store.account.getOrDefault(this.senderId);

        if (this.asset.username && sender.username && sender.username !== this.asset.username) {
            errors.push(
                new TransactionError(
                    'Username already set differently',
                    this.id,
                    '.asset.username',
                    this.asset.username,
                    sender.username,
                )
            );
        }

        if (sender.balance > BigInt(this.balance)) {
            errors.push(
                new TransactionError(
                    'Sender balance is too high',
                    this.id,
                    '.balance',
                    sender.balance.toString(),

                )
            );
        }

        sender.username = sender.username || this.asset.username;
        sender.balance += this.amount;

        store.account.set(sender.address, sender);
        return errors;
    }

    protected async undoAsset(store: StateStore): Promise<ReadonlyArray<TransactionError>> {
        const errors: TransactionError[] = [];
        const sender = await store.account.get(this.senderId);

        sender.balance -= this.amount;
        store.account.set(sender.address, sender);

        return errors;
    }

    public validate(): TransactionResponse {
        const errors = [...this._validateSchema(), ...this.validateAsset()];
        if (errors.length > 0) {
            return createResponse(this.id, errors);
        }

        this._id = getId(this.getBytes());

        if (this.type !== (this.constructor as typeof BaseTransaction).TYPE) {
            errors.push(
                new TransactionError(
                    `Invalid transaction type`,
                    this.id,
                    '.type',
                    this.type,
                    (this.constructor as typeof BaseTransaction).TYPE,
                ),
            );
        }

        return createResponse(this.id, errors);
    }

    protected _validateSchema(): ReadonlyArray<TransactionError> {
        const transaction = this.toJSON();
        const schemaErrors = validator.validate(
            baseTransaction,
            transaction,
        );
        const errors = convertToTransactionError(
            this.id,
            schemaErrors,
        ) as TransactionError[];

        if (
            !errors.find(
                (err: TransactionError) => err.dataPath === '.senderPublicKey',
            )
        ) {
            // `senderPublicKey` passed format check, safely check equality to senderId
            const senderIdError = validateSenderIdAndPublicKey(
                this.id,
                this.senderId,
                this.senderPublicKey,
            );
            if (senderIdError) {
                errors.push(senderIdError);
            }
        }

        return errors;
    }
}
