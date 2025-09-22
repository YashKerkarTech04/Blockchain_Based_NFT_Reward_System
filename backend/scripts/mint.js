// scripts/mint.js
import hre from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // 1. Contract address from .env
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("❌ CONTRACT_ADDRESS not found in .env");
    process.exit(1);
  }

  // 2. Get contract instance
  const AchievementBadges = await hre.ethers.getContractFactory("AchievementBadges");
  const achievement = AchievementBadges.attach(contractAddress);

  // 3. Get first signer (owner)
  const [owner] = await hre.ethers.getSigners();

  // 4. Mint NFT badge
  const tx = await achievement.mintBadge(
    owner.address, // student address
    "https://my-json-badge-link.com/badge1.json", // metadata URI
    "Blockchain Mastery", // achievementName
    "Blockchain", // category
    "Yash Kerkar", // issuedBy
    "Student Name" // studentName
  );

  console.log("🚀 Minting transaction sent...");
  
  // 5. Wait for transaction to be mined
  const receipt = await tx.wait();

  // 6. Parse logs manually (Ethers v6 style)
  let minted = false;
  for (const log of receipt.logs) {
    try {
      const parsedLog = achievement.interface.parseLog(log);
      if (parsedLog.name === "BadgeMinted") {
        const tokenId = parsedLog.args.tokenId.toString();
        const studentAddress = parsedLog.args.studentAddress;
        console.log(`✅ NFT badge minted! Token ID: ${tokenId}`);
        console.log(`🎯 Minted to: ${studentAddress}`);
        minted = true;
      }
    } catch (err) {
      // ignore logs that are not from this contract
    }
  }

  if (!minted) {
    console.log("⚠️ BadgeMinted event not found in transaction logs.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
