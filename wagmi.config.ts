import { defineConfig } from "@wagmi/cli";
import VaultExplorerABI from "./src/lib/abi/VaultExplorer.json";
import { Abi } from "viem";

export default defineConfig({
  out: "src/lib/abi/generated/generated.ts",
  contracts: [
    {
      name: "VaultExplorer",
      abi: VaultExplorerABI as Abi,
    },
  ],
});
