import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BidType } from "./bid.type";

@ObjectType('DutchAuction')
export class DutchAuctionType {
    @Field(type => ID)
    id: string;

    @Field()
    seller: string;

    @Field()
    nft: string;

    @Field()
    tokenId: string;

    @Field()
    startPrice: number;

    @Field()
    endPrice: number;

    @Field()
    startTime: number;

    @Field()
    duration: number;

    @Field()
    paymentToken: string;

    @Field(type => [BidType])
    bids: BidType[];

    @Field()
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    timestamp: number;
}