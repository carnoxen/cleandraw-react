import abi from './abi.json';
import { ethers } from 'ethers';

const env = import.meta.env;
const provider = new ethers.JsonRpcProvider(env["VITE_INFURA"]) ?? ethers.getDefaultProvider();

export function getContract() {
    return new ethers.Contract(env["VITE_SOLIDITY"], abi, provider);
}

export async function getContractWithSigner() {
    const signer = await provider.getSigner();
    return new ethers.Contract(env["VITE_SOLIDITY"], abi, signer);
}