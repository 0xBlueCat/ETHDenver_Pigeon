import { Connection, InsertResult, Repository } from "typeorm";
import { Envelope } from "./entity/envelope";
import { IRSS3Follow } from "./model/model";
import { RSS3Follow } from "./entity/rss3Follow";

export class RSS3FollowDB {
  private repository: Repository<Envelope>;

  constructor(private connection: Connection) {
    this.repository = connection.getRepository(RSS3Follow);
  }

  async getRSS3FollowStatus(address: string): Promise<IRSS3Follow | undefined> {
    return await this.repository.findOne({ address });
  }

  async updateRSS3FollowStatus(envelope: IRSS3Follow): Promise<InsertResult> {
    return await this.repository
      .createQueryBuilder()
      .insert()
      .values(envelope)
      .orUpdate({
        conflict_target: ["address"],
        overwrite: ["status", "height", "txHash", "txStatus"],
      })
      .execute();
  }

  async getUncompletedTx(max: number): Promise<IRSS3Follow[]> {
    return this.repository
      .createQueryBuilder()
      .select()
      .where("txStatus = 'pending'")
      .limit(max)
      .orderBy("id", "ASC")
      .getMany();
  }
}
