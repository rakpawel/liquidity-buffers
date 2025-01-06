import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import config from "@/config";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(config.chains.mainnet.rpcUrl),
  },
});
