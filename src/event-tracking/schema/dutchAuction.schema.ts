import { User } from "src/user/schema/user.schema";
import { Column, Entity, ManyToOne, ObjectIdColumn } from "typeorm";

@Entity()
export class DutchAuction {
    @ObjectIdColumn()
    _id: string;

    @ManyToOne(type => User, user => user.auction, { eager: false })
    seller: string;

    @Column()
    nft: string;

    @Column()
    tokenId: number;

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

    @Column()
    blockNumber: number;

    @Column()
    transactionHash: string;

    @Column()
    timestamp: number;
}