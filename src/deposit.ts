import {ethers} from "ethers";
import {BlindPayment} from "./main";
import {newUser} from "./util";
import {SampleEcr20Abi} from "./abi/SampleEcr20Abi"
import {ZetoAnonAbi} from "./abi/ZetoAnonAbi";

export const deposit = async (
    {sender,receiver}:BlindPayment
) => {

    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io")
    const signer = new ethers.Wallet(sender,provider);
    const signerUser = newUser(signer)
    const ecr20 = new ethers.Contract(SampleEcr20Abi.contractAddress, SampleEcr20Abi.abi,signer);
    const zeto = new ethers.Contract(ZetoAnonAbi.contractAddress, ZetoAnonAbi.abi,signer);
    const a = await ecr20.mint(await signer.getAddress(),100)
    console.log(a)
}