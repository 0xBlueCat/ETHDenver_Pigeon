import { config, DefaultConfig } from "../common/config/config";
import { PODKNN3HackathonJsonRpcServer } from "../rpc/server";
import { trimObj } from "../utils/utils";
import { initLog, logger } from "../common/logger";
import { DefaultPODKNN3HackathonCore } from "../common/core";
import { TxChecker } from "./txChecker";
const nconf = require("nconf");

export class PODKNN3_Hackathon {
  private readonly configPath: string;
  private readonly whiteListPath: string;
  private cfg: config;
  private jsonRpcServer: PODKNN3HackathonJsonRpcServer;

  constructor(cfgPath: string, whiteListPath: string) {
    this.configPath = cfgPath;
    this.whiteListPath = whiteListPath;
    this.jsonRpcServer = new PODKNN3HackathonJsonRpcServer();
  }

  private async init() {
    this.cfg = await nconf.file(this.configPath).get("PODKNN3_Hackathon");
    if (!this.cfg) {
      this.cfg = DefaultConfig;
    }
    this.cfg = trimObj(this.cfg);

    initLog(this.cfg.log!);

    logger.info(
      "PODKNN3_Hackathon config:",
      JSON.stringify(this.cfg, undefined)
    );

    const whiteList = await nconf.file(this.whiteListPath).get("whiteList");
    await DefaultPODKNN3HackathonCore.init(this.cfg, whiteList);
  }

  async start() {
    await this.init();
    TxChecker.start();
    this.jsonRpcServer.start(this.cfg.rpcServer?.port!);
  }
}
