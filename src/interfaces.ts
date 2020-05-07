import { TransactionJSON } from "@liskhq/lisk-transactions";

export interface SprinklerOptions {
    readonly amount: string;
    readonly balance: string;
}

export interface SprinklerTransactionInterface extends TransactionJSON {
    readonly asset: TransactionAsset;
}

export interface TransactionAsset {
    readonly username: string;
}
