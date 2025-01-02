import { NextResponse } from "next/server";
import { getContract } from "@/lib/contract";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const contract = getContract();
    const [underlyingBalanceRaw, wrappedBalanceRaw] =
      await contract.getBufferBalance(address);

    return NextResponse.json({
      underlyingBalance: underlyingBalanceRaw.toString(),
      wrappedBalance: wrappedBalanceRaw.toString(),
    });
  } catch (error) {
    console.error("Error fetching buffer balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch buffer balance" },
      { status: 500 }
    );
  }
}
