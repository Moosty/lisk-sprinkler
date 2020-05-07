import 'jest-extended';
import {Account, TransactionError} from '@liskhq/lisk-transactions';
import {
    transactions,
    accounts,
} from './fixtures';
import {defaultAccount, defaultNetworkIdentifier, StateStoreMock} from './helpers/state_store';
import { SprinklerTransaction } from '../src';
import { Sprinkler } from '../src/sprinkler';

describe('Test Transaction', () => {
    const validTransaction = transactions.validTransaction.input;
    let validTestTransaction: Sprinkler;
    let sender: Account;
    let store: StateStoreMock;

    beforeEach(() => {
        validTestTransaction = new SprinklerTransaction(
            validTransaction,
        );
        sender = {
            ...defaultAccount,
            balance: BigInt('0'),
            address: accounts.defaultAccount.senderId,
        };

        store = new StateStoreMock([sender]);

        jest.spyOn(store.account, 'cache');
        jest.spyOn(store.account, 'get');
        jest.spyOn(store.account, 'getOrDefault');
        jest.spyOn(store.account, 'set');
    });

    describe('#constructor', () => {
        it('should create instance of Sprinkler', async () => {
            expect(validTestTransaction).toBeInstanceOf(Sprinkler);
        });

        it('should create empty instance of Sprinkler', async () => {
            validTestTransaction = new SprinklerTransaction(null);
            expect(validTestTransaction).toBeInstanceOf(Sprinkler);
            expect(validTestTransaction.asset.username).toEqual("",);
        });

        it('should set asset username', async () => {
            expect(validTestTransaction.asset.username).toEqual(
                validTransaction.asset.username,
            );
        });
    });

    describe('#assetToJSON', () => {
        it('should return an asset object', async () => {
            const assetJson = validTestTransaction.assetToJSON() as any;
            expect(assetJson).toEqual(validTransaction.asset);
        });
    });

    describe('#validateAssets', () => {
        it('should return no errors', async () => {
            const errors = (validTestTransaction as any).validateAsset();
            expect(errors.length).toEqual(0);
        });

        it('should return username error', async () => {
            validTestTransaction = new SprinklerTransaction(
                {
                    ...validTransaction,
                    asset: {
                        username: "Hello World",
                    },
                }
            );
            const errors = (validTestTransaction as any).validateAsset();
            expect(errors.length).toEqual(1);
            expect(errors[0]).toBeInstanceOf(TransactionError);
            expect(errors[0].message).toEqual("'.username' should match format \"username\"");
        });
    });

    describe('#prepare', () => {
        it('should call state store', async () => {
            validTestTransaction.sign(defaultNetworkIdentifier, transactions.validTransaction.passphrase);
            await validTestTransaction.prepare(store);
            expect(store.account.cache).toHaveBeenCalledWith([
                {address: transactions.validTransaction.senderId},
            ]);
        });
    });

    describe('#applyAsset', () => {
        it('should return no errors', async () => {
            validTestTransaction.sign(defaultNetworkIdentifier, transactions.validTransaction.passphrase);
            const errors = await (validTestTransaction as any).applyAsset(store);
            expect(Object.keys(errors)).toHaveLength(0);
        });

        it('should return balance errors', async () => {
            sender = {
                ...defaultAccount,
                balance: BigInt('100000001'),
                address: accounts.defaultAccount.senderId,
            };

            store = new StateStoreMock([sender]);

            jest.spyOn(store.account, 'cache');
            jest.spyOn(store.account, 'get');
            jest.spyOn(store.account, 'getOrDefault');
            jest.spyOn(store.account, 'set');
            validTestTransaction.sign(defaultNetworkIdentifier, transactions.validTransaction.passphrase);
            const errors = await (validTestTransaction as any).applyAsset(store);
            expect(Object.keys(errors)).toHaveLength(1);
            expect(errors[0]).toBeInstanceOf(TransactionError);
            expect(errors[0].message).toEqual("Sender balance is too high");
        });

        it('should return username errors', async () => {
            sender = {
                ...defaultAccount,
                username: "johndoe1",
                address: accounts.defaultAccount.senderId,
            };

            store = new StateStoreMock([sender]);

            jest.spyOn(store.account, 'cache');
            jest.spyOn(store.account, 'get');
            jest.spyOn(store.account, 'getOrDefault');
            jest.spyOn(store.account, 'set');
            validTestTransaction.sign(defaultNetworkIdentifier, transactions.validTransaction.passphrase);

            const errors = await (validTestTransaction as any).applyAsset(store);
            expect(Object.keys(errors)).toHaveLength(1);
            expect(errors[0]).toBeInstanceOf(TransactionError);
            expect(errors[0].message).toEqual("Username already set differently");
        });

        it('should call state store', async () => {
            validTestTransaction.sign(defaultNetworkIdentifier, transactions.validTransaction.passphrase);
            await (validTestTransaction as any).applyAsset(store);
            expect(store.account.getOrDefault).toHaveBeenCalledWith(
                transactions.validTransaction.senderId,
            );

            expect(store.account.set).toHaveBeenCalledWith(
                transactions.validTransaction.senderId,
                expect.objectContaining({
                    username: transactions.validTransaction.input.asset.username,
                    balance: BigInt(10000000000),
                }),
            );
        });
    });

    describe('#undoAsset', () => {
        it('should call state store', async () => {
            validTestTransaction.sign(defaultNetworkIdentifier, transactions.validTransaction.passphrase);
            await (validTestTransaction as any).undoAsset(store);
            expect(store.account.get).toHaveBeenCalledWith(transactions.validTransaction.senderId);
            expect(store.account.set).toHaveBeenCalledWith(
                transactions.validTransaction.senderId,
                expect.objectContaining({
                    address: transactions.validTransaction.senderId,
                    balance: BigInt(-10000000000),
                }),
            );
        });
    });
});

