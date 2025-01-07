"use client";

import Image from "next/image";
import { useChainId, useChains } from "wagmi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wagmiConfig } from "@/lib/wagmi";
import { switchChain } from "wagmi/actions";
import config, { SupportedChainId } from "@/config";

export const NetworkSelector = () => {
  const chainId = useChainId();
  const chains = useChains();

  return (
    <Select
      value={chainId.toString()}
      onValueChange={async (value) => {
        await switchChain(wagmiConfig, {
          chainId: Number(value) as SupportedChainId,
        });
      }}
    >
      <SelectTrigger className="w-48 ml-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            <div className="flex items-center gap-2">
              <Image
                src={config.chains[chain.id as SupportedChainId].icon}
                alt={chain.name}
                width={16}
                height={16}
              />
              {chain.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
