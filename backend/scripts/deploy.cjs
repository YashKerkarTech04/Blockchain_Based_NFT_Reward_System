// scripts/deploy.cjs
const hre = require("hardhat");

async function main() {
  console.log("Deploying AchievementBadges contract...");
  
  const AchievementBadges = await hre.ethers.getContractFactory("AchievementBadges");
  const achievementBadges = await AchievementBadges.deploy();

  await achievementBadges.waitForDeployment();
  const address = await achievementBadges.getAddress();

  console.log("✅ AchievementBadges deployed to:", address);
  
  // Save to environment file
  const fs = require("fs");
  fs.appendFileSync(".env", `\nCONTRACT_ADDRESS=${address}`);
  
  return address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});