import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsEthereumAddress } from "class-validator";
import { BidStatus } from "../enums/bid-status.enum";

@InputType()
export class CreateBidDto {
    @Field()
    @IsEthereumAddress()
    bidder: string;

    @Field()
    amount: number;

    @Field()
    @IsEthereumAddress()
    nft: string;

    @Field()
    tokenId: string;

    @Field()
    @IsEnum(BidStatus)
    status: string;

    @Field()
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    timestamp: number;
}