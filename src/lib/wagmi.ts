import { createConfig, http } from "wagmi";
import { mainnet, gnosis } from "wagmi/chains";
import config from "@/config";

export const wagmiConfig = createConfig({
  chains: [mainnet, gnosis],
  transports: {
    [mainnet.id]: http(config.chains[mainnet.id].rpcUrl),
    [gnosis.id]: http(config.chains[gnosis.id].rpcUrl),
  },
});
