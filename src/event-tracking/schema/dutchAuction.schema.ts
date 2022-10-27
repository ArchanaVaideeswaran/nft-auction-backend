import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Bid } from "./bid.schema";

@Entity()
export class DutchAuction {
    @ObjectIdColumn()
    _id: ObjectID;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    seller: string;

    @Column()
    nft: string;

    @Column()
    tokenId: string;

    @Column()
    startPrice: number;

    @Column()
    endPrice: number;

    @Column()
    startTime: number;

    @Column()
    duration: number;

    @Column()
    paymentToken: string;

    @Column(type => Bid)
    bids: Bid[];

    @Column()
    blockNumber: number;

    @Column()
    transactionHash: string;

    @Column()
    timestamp: number;
}