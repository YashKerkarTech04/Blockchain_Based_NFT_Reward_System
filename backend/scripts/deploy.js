// scripts/deploy.js
import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("Deploying AchievementBadges contract...");
  
  const AchievementBadges = await hre.ethers.getContractFactory("AchievementBadges");
  const achievementBadges = await AchievementBadges.deploy();

  await achievementBadges.waitForDeployment();
  const address = await achievementBadges.getAddress();

  console.log("✅ AchievementBadges deployed to:", address);
  
  // Save to environment file
  fs.appendFileSync(".env", `\nCONTRACT_ADDRESS=${address}`);
  
  return address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});