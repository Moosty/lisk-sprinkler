import {sprinkler} from "../src/helpers";
import {defaultNetworkIdentifier} from './helpers/state_store';

describe('Test helper transaction', () => {
    it('should return valid transaction', () => {
        expect(sprinkler({
            networkIdentifier: defaultNetworkIdentifier,
            fee: '10000',
            username: "johndoe",
            nonce: "2"
        })).toEqual({
            nonce: '2',
            fee: '10000',
            senderPublicKey: undefined,
            type: 1300,
            asset: {username: 'johndoe'}
        })
    });

    it('should return valid signed transaction', () => {
        expect(sprinkler({
            networkIdentifier: defaultNetworkIdentifier,
            fee: '10000',
            username: "johndoe",
            nonce: "2",
            passphrase: "creek own stem final gate scrub live shallow stage host concert they",
        })).toEqual({
            nonce: '2',
            fee: '0',
            id: "17252801444655821126",
            height: undefined,
            blockId: undefined,
            confirmations: undefined,
            receivedAt: undefined,
            senderId: "11237980039345381032L",
            senderPublicKey: "5c554d43301786aec29a09b13b485176e81d1532347a351aeafe018c199fd7ca",
            signatures: [
                "c1123188e197d775e015202cadde2bdb26526c152702644d5e74a4b9c84be4e2c8f20a1ff6f35ad9bb8c45ec50b4f17da59a086f0e0241576d0ec1f0210f1506",
            ],
            type: 1300,
            asset: {username: 'johndoe'}
        })
    })
});
