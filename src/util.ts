import {Signer} from "ethers";
import {formatPrivKeyForBabyJub, genKeypair} from "maci-crypto";


export async function newUser(signer: Signer) {
    const { privKey, pubKey } = genKeypair();
    const formattedPrivateKey = formatPrivKeyForBabyJub(privKey);
    return {
        signer,
        ethAddress: await signer.getAddress(),
        babyJubPrivateKey: privKey,
        babyJubPublicKey: pubKey,
        formattedPrivateKey,
    };
}