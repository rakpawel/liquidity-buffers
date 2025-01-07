# Liquidity buffers dashboard

This dashboard allows you to view the allocation for the Balancer v3 liquidity buffers.

You can read more about the buffers in the [official documentation](https://docs.balancer.fi/concepts/vault/buffer.html) and in my [X thread](https://x.com/RaqPawel/status/1871291256086639004).

## Environment Variables

To run the project, set up the following in a `.env` file:

```
NEXT_PUBLIC_MAINNET_RPC_URL=<Ethereum Mainnet RPC URL>
NEXT_PUBLIC_GNOSIS_RPC_URL=<Gnosis Chain RPC URL>
NEXT_PUBLIC_MAINNET_VAULT_EXPLORER_ADDRESS=<Balancer v3 VaultExplorer address on Mainnet>
NEXT_PUBLIC_GNOSIS_VAULT_EXPLORER_ADDRESS=<Balancer v3 VaultExplorer address on Gnosis>
```

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate TypeScript ABIs:
   ```bash
   npm run generate
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The dashboard will be available at [http://localhost:3000](http://localhost:3000).
