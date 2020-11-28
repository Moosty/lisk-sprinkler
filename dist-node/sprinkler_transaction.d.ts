import { BaseAsset } from 'lisk-sdk';
export declare class SprinklerTransaction extends BaseAsset {
    name: string;
    id: number;
    schema: {
        $id: string;
        type: string;
        required: string[];
        properties: {
            username: {
                fieldNumber: number;
                dataType: string;
                minLength: number;
                maxLength: number;
            };
        };
    };
    apply: ({ transaction, asset, stateStore, reducerHandler }: {
        transaction: any;
        asset: any;
        stateStore: any;
        reducerHandler: any;
    }) => Promise<void>;
}
