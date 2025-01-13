"use client";

import React from "react";
import { Ban, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPools } from "@/services/api";
import { PoolCard } from "./PoolCard";
import { Header } from "./Header";
import { useChainId } from "wagmi";
import { SupportedChainId } from "@/config";

export const Dashboard = () => {
  const chainId = useChainId();

  const {
    data: pools = [],
    isLoading: isLoadingPools,
    error: poolsError,
  } = useQuery({
    queryKey: ["pools", chainId],
    queryFn: () => fetchPools(chainId as SupportedChainId),
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        {isLoadingPools ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
            <div className="p-6 rounded-full bg-zinc-900/50">
              <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-500">Loading pools...</p>
          </div>
        ) : poolsError ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-red-400/10">
              <Ban className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-zinc-100">
                Failed to load pools
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Please check your connection and try again
              </p>
            </div>
          </div>
        ) : (
          <div className="columns-1 lg:columns-2 gap-6 space-y-6 [&>*]:break-inside-avoid-column">
            {pools.map((pool) => (
              <PoolCard key={pool.address} pool={pool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
