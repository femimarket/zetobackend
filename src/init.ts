import {ethers} from "ethers";
import {ZetoAnonAbi} from "./abi/ZetoAnonAbi";


const init = async () => {

    const zeto = new ethers.Contract(ZetoAnonAbi.contractAddress, ZetoAnonAbi.abi);


    console.log(zeto)

}
init()