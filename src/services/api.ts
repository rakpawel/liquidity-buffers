import config, { SupportedChainId } from "@/config";

export interface UnderlyingToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  isErc4626: boolean;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  isErc4626: boolean;
  underlyingToken?: UnderlyingToken;
  scalingFactor: string;
  priceRate: string;
  isBufferAllowed: boolean;
}

export interface DynamicData {
  totalLiquidity: string;
  volume24h: string;
}

export interface Pool {
  address: string;
  name: string;
  protocolVersion: number;
  hasErc4626: boolean;
  hasAnyAllowedBuffer: boolean;
  dynamicData: DynamicData;
  poolTokens: Token[];
  tags: string[];
}

export interface BufferBalance {
  underlyingBalance: string;
  wrappedBalance: string;
}

export const fetchPools = async (
  chainId: SupportedChainId
): Promise<Pool[]> => {
  const chainName = config.chains[chainId].graphqlChainName;
  const response = await fetch(`/api/pools?chain=${chainName}`);
  const data = await response.json();
  return data.data.poolGetPools;
};
