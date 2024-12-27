"use client";

import React, { useEffect, useState } from "react";
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
import { Info } from "lucide-react";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

interface DynamicData {
  totalLiquidity: string;
  volume24h: string;
}

interface Pool {
  address: string;
  name: string;
  protocolVersion: number;
  hasErc4626: boolean;
  hasAnyAllowedBuffer: boolean;
  dynamicData: DynamicData;
  poolTokens: Token[];
}

interface BufferBalance {
  underlyingBalance: string;
  wrappedBalance: string;
}

const formatValue = (value: string, decimals: number) => {
  const parsed = parseFloat(value) / Math.pow(10, decimals);
  if (parsed >= 1000000) {
    return `${(parsed / 1000000).toFixed(2)}M`;
  } else if (parsed >= 1000) {
    return `${(parsed / 1000).toFixed(2)}K`;
  }
  return parsed.toFixed(2);
};

const calculateRatios = (
  underlying: string,
  wrapped: string,
  decimals: number
) => {
  const underlyingValue = parseFloat(underlying) / Math.pow(10, decimals);
  const wrappedValue = parseFloat(wrapped) / Math.pow(10, decimals);
  const total = underlyingValue + wrappedValue;

  if (total === 0) return { underlying: "0.0", wrapped: "0.0" };

  const underlyingPercent = ((underlyingValue / total) * 100).toFixed(1);
  const wrappedPercent = ((wrappedValue / total) * 100).toFixed(1);

  return { underlying: underlyingPercent, wrapped: wrappedPercent };
};

const Dashboard = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [bufferBalances, setBufferBalances] = useState<
    Record<string, BufferBalance>
  >({});

  useEffect(() => {
    const fetchData = async () => {
      // Fetch pools data
      const response = await fetch("/api/pools");
      const data = await response.json();

      setPools(data.data.poolGetPools);
      // Fetch buffer balances
      const balances: Record<string, BufferBalance> = {};
      for (const pool of data.data.poolGetPools) {
        for (const token of pool.poolTokens) {
          const balance = await fetchBufferBalance(token.address);
          balances[token.address] = balance;
        }
      }
      setBufferBalances(balances);
    };

    fetchData();
  }, []);

  const fetchBufferBalance = async (
    tokenAddress: string
  ): Promise<BufferBalance> => {
    const response = await fetch(`/api/buffer-balance?address=${tokenAddress}`);
    const data = await response.json();
    return data;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const token = payload[0].payload.token;
      const balance = bufferBalances[token.address];
      if (!balance) return null;

      const ratios = calculateRatios(
        balance.underlyingBalance,
        balance.wrappedBalance,
        token.decimals
      );

      return (
        <div className="bg-zinc-900 p-3 rounded-lg shadow-lg border border-zinc-800 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-zinc-200">{token.name}</p>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
              {token.symbol}
            </Badge>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-8">
              <span className="text-zinc-400">Underlying:</span>
              <span className="text-emerald-400 font-medium">
                {formatValue(balance.underlyingBalance, token.decimals)} (
                {ratios.underlying}%)
              </span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <span className="text-zinc-400">Wrapped:</span>
              <span className="text-blue-400 font-medium">
                {formatValue(balance.wrappedBalance, token.decimals)} (
                {ratios.wrapped}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8">
          Liquidity buffers
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pools.map((pool) => (
            <Card key={pool.address} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-zinc-100">{pool.name}</CardTitle>
                    <p className="text-sm text-zinc-400">
                      TVL: ${formatValue(pool.dynamicData.totalLiquidity, 0)}
                    </p>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="w-5 h-5 text-zinc-400" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-zinc-900 border-zinc-800">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-zinc-100">
                          Pool Details
                        </h4>
                        <p className="text-sm text-zinc-400">
                          Address: {pool.address}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardHeader>
              <CardContent>
                {pool.poolTokens.map((token, tokenIndex) => {
                  const balance = bufferBalances[token.address];
                  if (!balance) return null;

                  const ratios = calculateRatios(
                    balance.underlyingBalance,
                    balance.wrappedBalance,
                    token.decimals
                  );

                  const chartData = [
                    {
                      token,
                      underlying:
                        parseFloat(balance.underlyingBalance) /
                        Math.pow(10, token.decimals),
                      wrapped:
                        parseFloat(balance.wrappedBalance) /
                        Math.pow(10, token.decimals),
                    },
                  ];

                  return (
                    <div key={token.address}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-zinc-100">
                              {token.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                            >
                              {token.symbol}
                            </Badge>
                          </div>
                          <div className="text-sm text-zinc-400">
                            {ratios.underlying}% - {ratios.wrapped}%
                          </div>
                        </div>

                        <div className="h-16 w-full">
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
                                fill="#34D399"
                                radius={[4, 0, 0, 4]}
                              />
                              <Bar
                                dataKey="wrapped"
                                stackId="a"
                                fill="#818CF8"
                                radius={[0, 4, 4, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span className="text-zinc-400">
                              Underlying:{" "}
                              {formatValue(
                                balance.underlyingBalance,
                                token.decimals
                              )}{" "}
                              {token.symbol}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                            <span className="text-zinc-400">
                              Wrapped:{" "}
                              {formatValue(
                                balance.wrappedBalance,
                                token.decimals
                              )}{" "}
                              {token.symbol}
                            </span>
                          </div>
                        </div>
                      </div>
                      {tokenIndex < pool.poolTokens.length - 1 && (
                        <Separator className="my-6 bg-zinc-800" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
