import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ engine: "InnoDB" })
export class RSS3Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  //1:for followed; 0: for unfollowed
  @Column({ default: 0 })
  status: number;

  @Column({ default: 0 })
  height: number;

  @Column()
  txHash: string;

  @Column({ default: "init" })
  txStatus: string;
}
