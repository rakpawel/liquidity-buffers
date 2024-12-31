import { ethers } from "ethers";
import VaultExplorerABI from "./abi/VaultExplorer.json";

let contract: ethers.Contract | null = null;

export function getContract() {
  if (contract) return contract;

  const providerUrl = process.env.MAINNET_RPC_URL;
  const contractAddress = process.env.VAULT_EXPLORER_ADDRESS;

  if (!providerUrl || !contractAddress) {
    throw new Error("Missing required environment variables");
  }

  const provider = new ethers.JsonRpcProvider(providerUrl);
  contract = new ethers.Contract(contractAddress, VaultExplorerABI, provider);

  return contract;
}
