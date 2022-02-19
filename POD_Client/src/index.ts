import { PODKNN3_Hackathon } from "./podknn3_hackathon/podknn3_hackathon";

const defaultConfigPath = "./config.json";
const defaultWhiteListPath = "./config.json";

async function main() {
  const cfgPath = process.env.PODKNN3_HACKATHON_CONFIG || defaultConfigPath;
  const whiteListPath =
    process.env.PODKNN3_HACKATHON_WHITELIST || defaultWhiteListPath;
  const podknn3_hackathon = new PODKNN3_Hackathon(cfgPath, whiteListPath);
  await podknn3_hackathon.start();
}

void main();
