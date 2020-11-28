/// <reference types="node" />
declare const sprinklerAssetSchema: {
    $id: string;
    type: string;
    required: string[];
    properties: {
        registeredUsernames: {
            type: string;
            fieldNumber: number;
            items: {
                type: string;
                required: string[];
                properties: {
                    id: {
                        dataType: string;
                        fieldNumber: number;
                    };
                    username: {
                        dataType: string;
                        fieldNumber: number;
                    };
                    ownerAddress: {
                        dataType: string;
                        fieldNumber: number;
                    };
                };
            };
        };
    };
};
declare const CHAIN_STATE_SPRINKLER = "sprinkler:usernames";
declare const createSprinklerAccount: ({ ownerAddress, nonce, username }: {
    ownerAddress: any;
    nonce: any;
    username: any;
}) => {
    id: Buffer;
    ownerAddress: any;
    username: any;
};
declare const getAllSprinklerAccounts: (stateStore: any) => Promise<any>;
declare const getAllUsernamesAsJSON: (dataAccess: any) => Promise<any>;
declare const setAllSprinklerAccounts: (stateStore: any, sprinklerAccounts: any) => Promise<void>;
export { CHAIN_STATE_SPRINKLER, setAllSprinklerAccounts, getAllSprinklerAccounts, getAllUsernamesAsJSON, createSprinklerAccount, sprinklerAssetSchema, };
