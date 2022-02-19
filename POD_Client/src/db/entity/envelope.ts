import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ engine: "InnoDB" })
export class Envelope {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  //1:for opened; 0: for haven't opened
  @Column({ default: 0 })
  status: number;

  @Column({ default: 0 })
  height: number;

  @Column()
  txHash: string;

  @Column({ default: "init" })
  txStatus: string;
}
