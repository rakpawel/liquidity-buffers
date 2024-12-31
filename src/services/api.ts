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

export const fetchPools = async (): Promise<Pool[]> => {
  const response = await fetch("/api/pools");
  const data = await response.json();
  return data.data.poolGetPools;
};

export const fetchBufferBalance = async (
  tokenAddress: string
): Promise<BufferBalance> => {
  const response = await fetch(`/api/buffer-balance?address=${tokenAddress}`);
  const data = await response.json();
  return data;
};
