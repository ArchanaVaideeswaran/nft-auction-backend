import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType('Bid')
export class BidType {
    @Field(type => ID)
    id: string;

    @Field()
    bidder: string;

    @Field()
    amount: number;

    @Field()
    nft: string;

    @Field()
    tokenId: number;

    @Field()
    executed: boolean;

    @Field()
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    timestamp: number;
}