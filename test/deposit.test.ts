import {describe, expect, test} from '@jest/globals';
import {Wallet} from "ethers";
import {deposit} from "../src/deposit";

const pk = "f581e09146dc555821defda40505b319ace18e5262141258d1abb0ee1eb60dfe"

describe('zeto', () => {
    test('deposit', () => {

        const kp = Wallet.createRandom()

        deposit({
            sender:pk,
            receiver:"fe"
        })

    });
});