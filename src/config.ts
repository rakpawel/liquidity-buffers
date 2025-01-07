import { mainnet, gnosis } from "wagmi/chains";

export type AppConfig = {
  readonly chains: {
    [chainId: number]: {
      chain: typeof mainnet | typeof gnosis;
      rpcUrl: string;
      vaultExplorerAddress: `0x${string}`;
      graphqlChainName: string;
      icon: string;
      balancerPath: string;
    };
  };
};

const config = {
  chains: {
    [mainnet.id]: {
      chain: mainnet,
      rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL!,
      vaultExplorerAddress: process.env
        .NEXT_PUBLIC_MAINNET_VAULT_EXPLORER_ADDRESS as `0x${string}`,
      graphqlChainName: "MAINNET",
      icon: "/chains/MAINNET.svg",
      balancerPath: "ethereum",
    },
    [gnosis.id]: {
      chain: gnosis,
      rpcUrl: process.env.NEXT_PUBLIC_GNOSIS_RPC_URL!,
      vaultExplorerAddress: process.env
        .NEXT_PUBLIC_GNOSIS_VAULT_EXPLORER_ADDRESS as `0x${string}`,
      graphqlChainName: "GNOSIS",
      icon: "/chains/GNOSIS.svg",
      balancerPath: "gnosis",
    },
  },
} as const satisfies AppConfig;

if (!config.chains[mainnet.id].rpcUrl) {
  throw new Error("Missing NEXT_PUBLIC_MAINNET_RPC_URL");
}

if (!config.chains[mainnet.id].vaultExplorerAddress) {
  throw new Error("Missing NEXT_PUBLIC_MAINNET_VAULT_EXPLORER_ADDRESS");
}

if (!config.chains[gnosis.id].rpcUrl) {
  throw new Error("Missing NEXT_PUBLIC_GNOSIS_RPC_URL");
}

if (!config.chains[gnosis.id].vaultExplorerAddress) {
  throw new Error("Missing NEXT_PUBLIC_GNOSIS_VAULT_EXPLORER_ADDRESS");
}

export type SupportedChainId = keyof typeof config.chains;
export default config;
