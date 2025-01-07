"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { shortCurrencyFormat } from "@/lib/utils";
import { type Pool } from "@/services/api";
import { Info } from "lucide-react";
import { BufferView } from "./BufferView";
import { useChainId } from "wagmi";
import config, { SupportedChainId } from "@/config";

const getProtocol = (tags: string[]) => {
  const normalizedTags = tags.map((tag) => tag.toUpperCase());

  if (normalizedTags.includes("BOOSTED_AAVE")) return "Aave";
  if (normalizedTags.includes("BOOSTED_MORPHO")) return "Morpho";
  return null;
};

export const PoolCard = ({ pool }: { pool: Pool }) => {
  const chainId = useChainId();
  const chainConfig = config.chains[chainId as SupportedChainId];

  return (
    <Card className="bg-zinc-900 border-zinc-800 transition-colors duration-100 hover:bg-zinc-800/50 hover:border-zinc-700/80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-zinc-100">
              <a
                href={`https://balancer.fi/pools/${chainConfig.balancerPath}/v3/${pool.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-300 transition-colors duration-200"
              >
                {pool.name}
              </a>
            </CardTitle>
            <p className="text-sm text-zinc-400">
              TVL:{" "}
              {shortCurrencyFormat(Number(pool.dynamicData.totalLiquidity))}
            </p>
          </div>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="w-5 h-5 text-zinc-400" />
            </HoverCardTrigger>
            <HoverCardContent className="w-100 bg-zinc-900 border-zinc-800">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-100">
                  Pool details
                </h4>
                <p className="text-sm text-zinc-400">Address: {pool.address}</p>
                {getProtocol(pool.tags) && (
                  <p className="text-sm text-zinc-400">
                    Protocol: {getProtocol(pool.tags)}
                  </p>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>
      <CardContent className="min-h-[350px]">
        <div>
          {pool.poolTokens.map((token, index) => (
            <BufferView
              key={token.address}
              token={token}
              isLastToken={index === pool.poolTokens.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
