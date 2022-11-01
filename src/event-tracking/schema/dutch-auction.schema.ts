import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DutchAuctionStatus } from "../enums/dutch-auction-status.enum";
import { Bid } from "./bid.schema";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class DutchAuction {
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(type => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    seller: string;

    @Field()
    @Column()
    nft: string;

    @Field()
    @Column()
    tokenId: string;

    @Field()
    @Column()
    startPrice: number;

    @Field()
    @Column()
    endPrice: number;

    @Field()
    @Column()
    startTime: number;

    @Field()
    @Column()
    duration: number;

    @Field()
    @Column()
    paymentToken: string;
    
    @Field()
    @Column({ default: DutchAuctionStatus.NOT_ACTIVE })
    status: string;

    @Field(type => [Bid])
    @Column(type => Bid)
    bids: Bid[];

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