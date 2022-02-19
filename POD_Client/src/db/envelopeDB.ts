import { Connection, InsertResult, Repository } from "typeorm";
import { Envelope } from "./entity/envelope";
import { IEnvelope } from "./model/model";

export class EnvelopeDB {
  private repository: Repository<Envelope>;

  constructor(private connection: Connection) {
    this.repository = connection.getRepository(Envelope);
  }

  async getEnvelopeStatus(address: string): Promise<IEnvelope | undefined> {
    return await this.repository.findOne({ address });
  }

  async updateEnvelopeStatus(envelope: IEnvelope): Promise<InsertResult> {
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

  async getUncompletedTx(max: number): Promise<IEnvelope[]> {
    return this.repository
      .createQueryBuilder()
      .select()
      .where("txStatus = 'pending'")
      .limit(max)
      .orderBy("id", "ASC")
      .getMany();
  }
}
