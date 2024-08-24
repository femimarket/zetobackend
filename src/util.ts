import {BigNumberish, Signer} from "ethers";
import {formatPrivKeyForBabyJub, genKeypair} from "maci-crypto";
import path from "path";
import {readFileSync} from "fs";
import { groth16 } from 'snarkjs';
import {encodeProof, newSalt, Poseidon} from "./zkp/js";
// import { loadCircuit, encodeProof } from "zeto-js";
// import { User, UTXO } from "./lib/utils";


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

const poseidonHash3 = Poseidon.poseidon3;
const poseidonHash4 = Poseidon.poseidon4;
const poseidonHash5 = Poseidon.poseidon5;

export function newUTXO(value: number, owner: User, salt?: BigInt): UTXO {
    if (!salt) salt = newSalt();
    const hash = poseidonHash4([
        BigInt(value),
        salt,
        owner.babyJubPublicKey[0],
        owner.babyJubPublicKey[1],
    ]);
    return { value, hash, salt };
}

export interface UTXO {
    value?: number;
    tokenId?: number;
    uri?: string;
    hash: BigInt;
    salt?: BigInt;
}

export const ZERO_UTXO: UTXO = { hash: BigInt(0) };

export interface User {
    signer: Signer;
    ethAddress: string;
    babyJubPrivateKey: BigInt;
    babyJubPublicKey: BigInt[];
    formattedPrivateKey: BigInt;
}

function loadCircuit(type: string) {
    if (!type) {
        throw new Error("The circuit name must be provided");
    }
    const circuitsRoot = process.env.CIRCUITS_ROOT;
    if (!circuitsRoot) {
        throw new Error("CIRCUITS_ROOT is not set");
    }
    const WitnessCalculator = require(path.join(
        process.cwd(),
        "public",
        "circuits",
        `${type}_js/witness_calculator.js`
    ));
    const buffer = readFileSync(
        path.join(process.cwd(), "public", "circuits", `${type}_js/${type}.wasm`)
    );
    return WitnessCalculator(buffer);
}

export async function prepareDepositProof(signer: User, output: UTXO) {
    const outputCommitments: [BigNumberish] = [output.hash] as [BigNumberish];
    const outputValues = [BigInt(output.value || 0n)];
    const outputOwnerPublicKeys: [[BigNumberish, BigNumberish]] = [
        signer.babyJubPublicKey,
    ] as [[BigNumberish, BigNumberish]];

    const inputObj = {
        outputCommitments,
        outputValues,
        outputSalts: [output.salt],
        outputOwnerPublicKeys,
    };

    const circuit = await loadCircuit("check_hashes_value");
    const { provingKeyFile } = loadProvingKeys("check_hashes_value");

    const startWitnessCalculation = Date.now();
    const witness = await circuit.calculateWTNSBin(inputObj, true);
    const timeWithnessCalculation = Date.now() - startWitnessCalculation;

    const startProofGeneration = Date.now();
    const { proof, publicSignals } = (await groth16.prove(
        provingKeyFile,
        witness
    )) as unknown as { proof: BigNumberish[]; publicSignals: BigNumberish[] };
    const timeProofGeneration = Date.now() - startProofGeneration;

    console.log(
        `Witness calculation time: ${timeWithnessCalculation}ms. Proof generation time: ${timeProofGeneration}ms.`
    );

    const encodedProof = encodeProof(proof);
    return {
        outputCommitments,
        encodedProof,
    };
}


function provingKeysRoot() {
    const PROVING_KEYS_ROOT = process.env.PROVING_KEYS_ROOT;
    if (!PROVING_KEYS_ROOT) {
        throw new Error("PROVING_KEYS_ROOT env var is not set");
    }
    return PROVING_KEYS_ROOT;
}

export function loadProvingKeys(type: string) {
    const provingKeyFile = path.join(
        process.cwd(),
        "public",
        "proving-keys",
        `${type}.zkey`
    );
    const verificationKey = JSON.parse(
        new TextDecoder().decode(
            readFileSync(
                path.join(process.cwd(), "public", "proving-keys", `${type}-vkey.json`)
            )
        )
    );
    return {
        provingKeyFile,
        verificationKey,
    };
}