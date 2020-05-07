import { Sprinkler } from './sprinkler';
import * as Schemas from './schemas';
import * as Interfaces from './interfaces';
import * as Constants from './constants';
import * as client from './helpers';

const configureSprinklerTransaction = (options): any => {
    return class SprinklerTransaction extends Sprinkler {
        constructor(props) {
            super(props, options);
        }
    }
};

const SprinklerTransaction = configureSprinklerTransaction({
    amount: "10000000000",
    balance: "100000000",
});

export {
    SprinklerTransaction,
    configureSprinklerTransaction as unConfiguredSprinklerTransaction,
    Schemas,
    Interfaces,
    Constants,
    client,
}
