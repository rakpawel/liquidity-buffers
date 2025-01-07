"use client";

import { useReadContract } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Ban } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Token } from "@/services/api";
import { CustomTooltip } from "./CustomTooltip";
import { calculateRatios, formatValue } from "@/lib/utils";
import { getVaultExplorerContract } from "@/lib/contracts";
import { formatUnits } from "viem";
import { BufferViewSkeleton } from "./BufferViewSkeleton";
import { useChainId } from "wagmi";
import { SupportedChainId } from "@/config";

export const BufferView = ({
  token,
  isLastToken,
}: {
  token: Token;
  isLastToken: boolean;
}) => {
  const chainId = useChainId();

  const {
    data: bufferBalance,
    isLoading,
    isError,
  } = useReadContract({
    ...getVaultExplorerContract(chainId as SupportedChainId),
    functionName: "getBufferBalance",
    args: [token.address as `0x${string}`],
    query: {
      enabled: token.isErc4626,
    },
  });

  // Calculate balance and ratios outside renderContent
  const balance = bufferBalance
    ? {
        underlyingBalance: bufferBalance[0],
        wrappedBalance: bufferBalance[1],
      }
    : undefined;

  const isEmptyBuffer =
    balance &&
    balance.underlyingBalance === 0n &&
    balance.wrappedBalance === 0n;

  const ratios = balance
    ? calculateRatios(
        balance.underlyingBalance,
        balance.wrappedBalance,
        token.decimals
      )
    : undefined;

  const renderContent = () => {
    // Case 1: Not an ERC4626 token
    if (!token.isErc4626) {
      return (
        <div className="h-full flex items-center justify-center gap-2 text-zinc-500 bg-zinc-800/20 rounded-md">
          <Ban className="w-4 h-4" />
          <span className="text-sm">No buffer allocated</span>
        </div>
      );
    }

    // Case 2: Loading state
    if (isLoading) {
      return <BufferViewSkeleton />;
    }

    // Case 3: Error state or no data
    if (isError || !bufferBalance || !balance) {
      return (
        <div className="h-full flex items-center justify-center gap-2 text-red-400 bg-red-400/5 rounded-md border border-red-400/20">
          <Ban className="w-4 h-4" />
          <span className="text-sm">Failed to load buffer data</span>
        </div>
      );
    }

    // Case 4: Empty buffer
    if (isEmptyBuffer) {
      return (
        <div className="h-full flex items-center justify-center gap-2 text-zinc-500 bg-zinc-800/20 rounded-md">
          <Ban className="w-4 h-4" />
          <span className="text-sm">No buffer allocated</span>
        </div>
      );
    }

    const chartData = [
      {
        token,
        underlying: Number(
          formatUnits(balance.underlyingBalance, token.decimals)
        ),
        wrapped: Number(formatUnits(balance.wrappedBalance, token.decimals)),
      },
    ];

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
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
        </div>
        <div className="flex justify-between text-sm mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3366FF]" />
            <span className="text-zinc-400">
              Underlying:{" "}
              {formatValue(balance.underlyingBalance, token.decimals)}{" "}
              {token.underlyingToken
                ? token.underlyingToken.symbol
                : token.symbol}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4ADE80]" />
            <span className="text-zinc-400">
              Wrapped: {formatValue(balance.wrappedBalance, token.decimals)}{" "}
              {token.symbol}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
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
          {token.isErc4626 && !isEmptyBuffer && ratios && (
            <div className="text-sm text-zinc-400">
              {ratios.underlying}% - {ratios.wrapped}%
            </div>
          )}
        </div>
        <div className="h-[100px]">{renderContent()}</div>
      </div>
      {!isLastToken && <Separator className="my-6 bg-zinc-800" />}
    </div>
  );
};
