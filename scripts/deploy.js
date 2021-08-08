const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Guestbook = await hre.ethers.getContractFactory("Guestbook");
  const guestbook = await Guestbook.deploy();

  await guestbook.deployed();

  console.log("Guestbook deployed to:", guestbook.address);

  fs.writeFileSync(
    ".env.development.local",
    `NEXT_PUBLIC_GUESTBOOK_ADDRESS=${guestbook.address}`,
    (err) => {
      if (err) throw err;
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
