import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bid {
    @ObjectIdColumn()
    _id: ObjectID;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bidder: string;

    @Column()
    amount: number;

    @Column()
    nft: string;

    @Column()
    tokenId: number;

    @Column({ default: false })
    executed: boolean;

    @Column()
    blockNumber: number;

    @Column()
    transactionHash: string;

    @Column()
    timestamp: number;
}