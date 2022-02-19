import { ethers } from "ethers";
import { config, DefaultConfig } from "./config/config";
import * as pod from "poddb-evm-sdk-ts";
import { EnvelopeDB } from "../db/envelopeDB";
import { getConnection } from "../db/connection";
import { RSS3FollowDB } from "../db/RSS3FollowDB";

export class PODKNN3HackathonCore {
  cfg: config;
  tagContract: pod.TagContract;
  tagClassContract: pod.TagClassContract;
  polygonProvider: ethers.providers.Provider;
  polygonWallet: ethers.Wallet;
  envelopeDB: EnvelopeDB;
  rss3FollowDB: RSS3FollowDB;
  whiteList: Map<string, boolean>;

  constructor() {
    this.whiteList = new Map<string, boolean>();
  }

  async init(cfg?: config, whitList?: string[]): Promise<void> {
    if (!cfg) {
      this.cfg = DefaultConfig;
    } else {
      this.cfg = cfg;
    }
    if (whitList) {
      whitList.forEach((address) => {
        this.whiteList.set(address, true);
      });
    }

    const conn = await getConnection(this.cfg.orm!);
    this.envelopeDB = new EnvelopeDB(conn);
    this.rss3FollowDB = new RSS3FollowDB(conn);

    this.polygonProvider = new ethers.providers.JsonRpcProvider(
      this.cfg.polygon!.rpcUrl
    );
    this.polygonWallet = new ethers.Wallet(
      this.cfg.polygon!.privateKey,
      this.polygonProvider
    );
    this.tagContract = (
      await pod.TagContract.getTagContractV1(
        this.polygonProvider,
        this.cfg.pod!.tagContractAddress
      )
    ).connectSigner(this.polygonWallet);
    this.tagClassContract = (
      await pod.TagClassContract.getTagClassContractV1(
        this.polygonProvider,
        this.cfg.pod!.tagClassContractAddress
      )
    ).connectSigner(this.polygonWallet);
  }

  getTagContract(): pod.TagContract {
    return this.tagContract;
  }

  getTagClassContract(): pod.TagClassContract {
    return this.tagClassContract;
  }

  getPolygonProvider(): ethers.providers.Provider {
    return this.polygonProvider;
  }
}

export const DefaultPODKNN3HackathonCore = new PODKNN3HackathonCore();
