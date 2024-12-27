import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const abi = [
  "function getBufferBalance(address token) view returns (uint256 underlyingBalance, uint256 wrappedBalance)"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  const providerUrl = process.env.INFURA_API_URL;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!providerUrl || !contractAddress) {
    return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
  }

  try {
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const [underlyingBalanceRaw, wrappedBalanceRaw] = await contract.getBufferBalance(address);

    return NextResponse.json({ underlyingBalance: underlyingBalanceRaw.toString(), wrappedBalance: wrappedBalanceRaw.toString() });
  } catch (error) {
    console.error('Error fetching buffer balance:', error);
    return NextResponse.json({ error: 'Failed to fetch buffer balance' }, { status: 500 });
  }
}
