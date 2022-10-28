import { Field, InputType } from "@nestjs/graphql";
import { DutchAuctionStatus } from "../enums/dutch-auction-status.enum";
import { BidType } from "../types/bid.type";
import { NewBidInput } from "./new-bid-input.dto";

@InputType()
export class DutchAuctionParams {
    @Field({ nullable: true })
    seller: string;

    @Field({ nullable: true })
    nft: string;

    @Field({ nullable: true })
    tokenId: string;

    @Field({ nullable: true })
    startPrice: number;

    @Field({ nullable: true })
    endPrice: number;

    @Field({ nullable: true })
    startTime: number;

    @Field({ nullable: true })
    duration: number;

    @Field({ nullable: true })
    paymentToken: string;

    @Field({ nullable: true })
    status: DutchAuctionStatus;

    @Field(type => [NewBidInput], { nullable: true })
    bids: NewBidInput[];

    @Field({ nullable: true })
    blockNumber: number;

    @Field({ nullable: true })
    transactionHash: string;

    @Field({ nullable: true })
    timestamp: number;
}