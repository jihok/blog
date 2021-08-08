# About

A simple blog monorepo where visitors can sign a guestbook. Blog posts are statically generated at build time via Next. Guestbook messages are persisted on Ethereum (or any other EVM compatible chain should you choose to deploy there).

Next is simply a convenience for its many out-of-the-box features e.g. Vercel deployment, various component/rendering optimizations, and code management.

# Running Locally

Scripts are provided to deploy our smart contract to a local Hardhat node and our Next app via Webpack DevServer on localhost:3000.

- First run `npx hardhat node` to set up the local test node. This gives us a deploy target and allows us to connect to localhost (port:3000).
- In a new terminal, run `npm run start`. This will deploy the Guestbook smart contract to our local test node and create/replace a local `.env` file to provide the deployment address to our Next app.

# TODO

Not a conclusive list by any means, but some notable omissions for a true production-grade app:

- Storybook/Chromatic for component building and "testing"
- React Testing Library for UI testing
- Integration tests (Waffle)
- Axe to audit accessibility
- Support for wallets that aren't MetaMask (IMO WalletConnect is the best UX as it's a similar experience to 2FA)
- Pin to a decentralized deployment target like IPFS
- An enhanced contract with real features would benefit greatly from a subgraph for indexed queries
