import { Field, ID, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/schema/user.schema";

@ObjectType('DutchAuction')
export class DutchAuctionType {
    @Field(type => ID)
    seller: User;

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

    @Field()
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    timestamp: number;
}