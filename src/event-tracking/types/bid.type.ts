import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserType } from "src/user/types/user.type";

@ObjectType('Bid')
export class BidType {
    @Field(type => ID)
    bidder: UserType;

    @Field()
    amount: number;

    @Field()
    nft: string;

    @Field()
    tokenId: number;

    @Field()
    paymentToken: string;
}