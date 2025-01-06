import { vaultExplorerAbi } from "./abi/generated/generated";
import config from "@/config";

export const vaultExplorerContract = {
  address: config.chains.mainnet.vaultExplorerAddress,
  abi: vaultExplorerAbi,
} as const;
