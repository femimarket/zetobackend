import {Wallet} from "ethers";
import {deposit} from "./deposit";

const pk = "f581e09146dc555821defdahj989h19ace18e5262141258d1abb0ee1eb60dfe"
const receiver = "8eec6fe75244858581jiiui86f60379ed14435d6e9068bbe6c32323cc9091dc"


const main = async () => {
    await deposit({
        sender:pk,
        receiver
    })
    console.log(3344)
}

main()