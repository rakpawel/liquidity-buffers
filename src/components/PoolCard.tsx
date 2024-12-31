"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Info, Loader2, Ban } from "lucide-react";
import {
  fetchBufferBalance,
  type Pool,
  type BufferBalance,
  Token,
} from "@/services/api";
import { CustomTooltip } from "@/components/CustomTooltip";
import { calculateRatios, formatValue } from "@/lib/utils";

const getProtocol = (tags: string[]) => {
  const normalizedTags = tags.map((tag) => tag.toUpperCase());

  if (normalizedTags.includes("BOOSTED_AAVE")) return "Aave";
  if (normalizedTags.includes("BOOSTED_MORPHO")) return "Morpho";
  return null;
};

export const PoolCard = ({ pool }: { pool: Pool }) => {
  const { data: bufferBalances, isLoading } = useQuery({
    queryKey: ["bufferBalances", pool.address],
    queryFn: async () => {
      const balances: Record<string, BufferBalance> = {};
      for (const token of pool.poolTokens) {
        try {
          const balance = await fetchBufferBalance(token.address);
          // Only add to balances if it's a valid response
          if (balance.underlyingBalance && balance.wrappedBalance) {
            balances[token.address] = balance;
          }
        } catch (error) {
          console.error(`Error fetching balance for ${token.address}:`, error);
          // Don't add anything to balances for this token
        }
      }
      return balances;
    },
  });

  const renderTokenContent = (
    token: Token,
    balance: BufferBalance | undefined,
    tokenIndex: number
  ) => {
    if (!balance) {
      return (
        <div key={token.address}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-zinc-100">{token.name}</h3>
                <Badge
                  variant="secondary"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {token.symbol}
                </Badge>
              </div>
            </div>

            <div className="h-24 w-full">
              <div className="h-full flex items-center justify-center gap-2 text-red-400 bg-red-400/5 rounded-md border border-red-400/20">
                <Ban className="w-4 h-4" />
                <span className="text-sm">Failed to load buffer data</span>
              </div>
            </div>
          </div>
          {tokenIndex < pool.poolTokens.length - 1 && (
            <Separator className="my-6 bg-zinc-800" />
          )}
        </div>
      );
    }

    const isEmptyBuffer =
      !token.isErc4626 ||
      (parseFloat(balance.underlyingBalance) === 0 &&
        parseFloat(balance.wrappedBalance) === 0);

    const ratios = calculateRatios(
      balance.underlyingBalance,
      balance.wrappedBalance,
      token.decimals
    );

    const chartData = [
      {
        token,
        underlying:
          parseFloat(balance.underlyingBalance) / Math.pow(10, token.decimals),
        wrapped:
          parseFloat(balance.wrappedBalance) / Math.pow(10, token.decimals),
      },
    ];

    return (
      <div key={token.address}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-100">{token.name}</h3>
              <Badge
                variant="secondary"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                {token.symbol}
              </Badge>
            </div>
            {token.isErc4626 && (
              <div className="text-sm text-zinc-400">
                {ratios.underlying}% - {ratios.wrapped}%
              </div>
            )}
          </div>

          <div className="h-16 w-full">
            {isEmptyBuffer ? (
              <div className="h-full flex items-center justify-center gap-2 text-zinc-500 bg-zinc-800/20 rounded-md">
                <Ban className="w-4 h-4" />
                <span className="text-sm">No buffer allocated</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  stackOffset="expand"
                  barSize={24}
                >
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <RechartsTooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                  />
                  <Bar
                    dataKey="underlying"
                    stackId="a"
                    fill="#3366FF"
                    radius={[4, 0, 0, 4]}
                  />
                  <Bar
                    dataKey="wrapped"
                    stackId="a"
                    fill="#4ADE80"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {token.isErc4626 && !isEmptyBuffer && (
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3366FF]"></div>
                <span className="text-zinc-400">
                  Underlying:{" "}
                  {formatValue(balance.underlyingBalance, token.decimals)}{" "}
                  {token.underlyingToken
                    ? token.underlyingToken.symbol
                    : token.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4ADE80]"></div>
                <span className="text-zinc-400">
                  Wrapped: {formatValue(balance.wrappedBalance, token.decimals)}{" "}
                  {token.symbol}
                </span>
              </div>
            </div>
          )}
        </div>
        {tokenIndex < pool.poolTokens.length - 1 && (
          <Separator className="my-6 bg-zinc-800" />
        )}
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 transition-colors duration-100 hover:bg-zinc-800/50 hover:border-zinc-700/80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-zinc-100">
              <a
                href={`https://balancer.fi/pools/ethereum/v3/${pool.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-300 transition-colors duration-200"
              >
                {pool.name}
              </a>
            </CardTitle>
            <p className="text-sm text-zinc-400">
              TVL: ${formatValue(pool.dynamicData.totalLiquidity, 0)}
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
        {isLoading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div>
            {pool.poolTokens.map((token, tokenIndex) => {
              const balance = bufferBalances?.[token.address];
              return renderTokenContent(token, balance, tokenIndex);
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
