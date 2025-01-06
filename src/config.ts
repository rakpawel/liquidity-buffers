import { mainnet } from "wagmi/chains";

export type AppConfig = {
  readonly chains: {
    mainnet: {
      chain: typeof mainnet;
      rpcUrl: string;
      vaultExplorerAddress: `0x${string}`;
    };
  };
};

const config = {
  chains: {
    mainnet: {
      chain: mainnet,
      rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL!,
      vaultExplorerAddress: process.env
        .NEXT_PUBLIC_MAINNET_VAULT_EXPLORER_ADDRESS as `0x${string}`,
    },
  },
} as const satisfies AppConfig;

if (!config.chains.mainnet.rpcUrl) {
  throw new Error("Missing NEXT_PUBLIC_MAINNET_RPC_URL");
}

if (!config.chains.mainnet.vaultExplorerAddress) {
  throw new Error("Missing NEXT_PUBLIC_MAINNET_VAULT_EXPLORER_ADDRESS");
}

export default config;
