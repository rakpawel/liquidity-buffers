import { vaultExplorerAbi } from "./abi/generated/generated";
import config from "@/config";
import { SupportedChainId } from "@/config";

export const getVaultExplorerContract = (chainId: SupportedChainId) => {
  return {
    address: config.chains[chainId].vaultExplorerAddress,
    abi: vaultExplorerAbi,
  } as const;
};
