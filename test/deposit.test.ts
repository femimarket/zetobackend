import {describe, expect, test} from '@jest/globals';
import {Wallet} from "ethers";
import {deposit} from "../src/deposit";

const pk = "f581e09146dc555821defda40505b319ace18e5262141258d1abb0ee1eb60dfe"
const receiver = "8eec6fe75244858581bc295e86f60379ed14435d6e9068bbe6c32323cc9091dc"

describe('zeto', () => {
    test('deposit', () => {

        const kp = Wallet.createRandom()

        deposit({
            sender:pk,
            receiver
        })

    });
});