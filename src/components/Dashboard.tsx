"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPools } from "@/services/api";
import { PoolCard } from "./PoolCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const Dashboard = () => {
  const {
    data: pools = [],
    isLoading: isLoadingPools,
    error: poolsError,
  } = useQuery({
    queryKey: ["pools"],
    queryFn: fetchPools,
  });

  if (isLoadingPools) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (poolsError) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex items-center justify-center">
        Error loading pools
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl font-bold text-zinc-100">
              Liquidity buffers
            </h1>
            <p className="text-sm text-zinc-400">
              Liquidity buffers are an internal mechanism of the Balancer v3
              vault that enable gas efficient swaps in boosted pools. For more
              info{" "}
              <a
                href="https://docs.balancer.fi/concepts/vault/buffer.html#erc4626-liquidity-buffers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                read the docs
              </a>{" "}
              and check out this{" "}
              <a
                href="https://x.com/RaqPawel/status/1871291256086639004"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                thread on X
              </a>
              .
            </p>
          </div>
          <Select defaultValue="mainnet" className="ml-8">
            <SelectTrigger className="w-48">
              <div className="flex items-center">
                <Image
                  src="/MAINNET.svg"
                  alt="Mainnet"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainnet">Mainnet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pools.map((pool) => (
            <PoolCard key={pool.address} pool={pool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
