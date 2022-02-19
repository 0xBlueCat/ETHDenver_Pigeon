export type ormDBType = "mysql";

export interface config {
  common?: commonConfig;
  rpcServer?: rpcServerConfig;
  log?: logConfig;
  polygon?: polygonConfig;
  pod?: podConfig;
  orm?: ormConfig;
}

export interface commonConfig {
  onlyWhiteList: boolean;
}

export interface ormConfig {
  type: ormDBType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface rpcServerConfig {
  port: number;
}

export interface logConfig {
  file?: string;
  level?: string;
}

export interface polygonConfig {
  rpcUrl: string;
  privateKey: string;
}

export interface podConfig {
  tagClassContractAddress: string;
  tagContractAddress: string;
  envelopClassId: string;
  rss3FollowClassId: string;
  taskClassId: string;
}

export const DefaultConfig: config = {
  common: {
    onlyWhiteList: false,
  },
  orm: {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "root",
    database: "podknn3_hackathon",
    synchronize: true,
    logging: true,
  },
  rpcServer: {
    port: 8060,
  },
  log: {
    level: "info",
    file: "./log/podknn3_hackathon.log",
  },
  polygon: {
    rpcUrl: "",
    privateKey: "",
  },
  pod: {
    tagClassContractAddress: "0xBCC70346547A825E03F98ED6d2c5dF246AE09b5C",
    tagContractAddress: "0x9D92B04811376bB133E155c9420c91E6A7FA9B8B",
    rss3FollowClassId: "",
    envelopClassId: "",
    taskClassId: "",
  },
};
