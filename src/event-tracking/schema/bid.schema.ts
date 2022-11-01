import { Column } from "typeorm";
import { BidStatus } from "../enums/bid-status.enum";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Bid {
    @Field(type => ID)
    @Column()
    bidder: string;

    @Field()
    @Column()
    amount: number;

    @Field()
    @Column()
    nft: string;

    @Field()
    @Column()
    tokenId: string;

    @Field()
    @Column({ default: BidStatus.PENDING })
    status: string;

    @Field()
    @Column()
    blockNumber: number;

    @Field()
    @Column()
    transactionHash: string;

    @Field()
    @Column()
    timestamp: number;
}