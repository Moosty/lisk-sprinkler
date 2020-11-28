import { BaseModule } from 'lisk-sdk';
import { SprinklerTransaction } from ".";
export declare class SprinklerModule extends BaseModule {
    name: string;
    id: number;
    transactionAssets: SprinklerTransaction[];
    accountSchema: {
        type: string;
        required: string[];
        properties: {
            username: {
                dataType: string;
                fieldNumber: number;
            };
        };
        default: {
            username: string;
        };
    };
    actions: {
        getAllUsernames: () => Promise<any>;
    };
    beforeTransactionApply: ({ transaction, stateStore, reducerHandler }: {
        transaction: any;
        stateStore: any;
        reducerHandler: any;
    }) => Promise<void>;
}
