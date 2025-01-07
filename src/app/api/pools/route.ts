import { NextResponse } from "next/server";
const BALANCER_API_URL = "https://api-v3.balancer.fi/";

const getPoolsQuery = (chainName: string) => `
  query GetPools {
    poolGetPools(
      where: {chainIn: [${chainName}], protocolVersionIn: [3], tagIn: ["BOOSTED"]}
      orderBy: totalLiquidity
      orderDirection: desc
    ) {
      address
      name
      protocolVersion
      hasErc4626
      hasAnyAllowedBuffer
      dynamicData {
        totalLiquidity
        volume24h
      }
      tags
      poolTokens {
        address
        symbol
        name
        decimals
        isErc4626
        underlyingToken {
          address
          name
          symbol
          decimals
          isErc4626
        }
        scalingFactor
        priceRate
        isBufferAllowed
      }
    }
  }
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get("chain") || "MAINNET";

  try {
    const response = await fetch(BALANCER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: getPoolsQuery(chain),
      }),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching pools:", error);
    return NextResponse.json(
      { error: "Failed to fetch pools data" },
      { status: 500 }
    );
  }
}
