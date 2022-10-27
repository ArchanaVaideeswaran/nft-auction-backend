import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BidType } from "src/event-tracking/types/bid.type";
import { DutchAuctionType } from "src/event-tracking/types/dutchAuction.type";

@ObjectType('User')
export class UserType {
    @Field(type => ID)
    id: string;

    @Field()
    address: string;

    @Field(type => [DutchAuctionType])
    auctions: DutchAuctionType[];

    @Field(type => [BidType])
    bids: BidType[];
}