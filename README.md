# Liquidity buffers dashboard

This dashboard allows you to view the allocation for the Balancer v3 liquidity buffers.

You can read more about the buffers in the [official documentation](https://docs.balancer.fi/concepts/vault/buffer.html) and in my [X thread](https://x.com/RaqPawel/status/1871291256086639004).

## Environment Variables

To run the project, set up the following in a `.env` file:

```
MAINNET_RPC_URL=<Ethereum Mainnet RPC URL>
VAULT_EXPLORER_ADDRESS=<Balancer v3 VaultExplorer address>
```

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The dashboard will be available at [http://localhost:3000](http://localhost:3000).
