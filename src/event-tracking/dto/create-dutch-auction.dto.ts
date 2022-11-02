import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsEthereumAddress } from "class-validator";
import { DutchAuctionStatus } from "../enums/dutch-auction-status.enum";
import { CreateBidDto } from "./create-bid.dto";

@InputType()
export class CreateDutchAuctionDto {
    @Field()
    @IsEthereumAddress()
    seller: string;

    @Field()
    @IsEthereumAddress()
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
    @IsEnum(DutchAuctionStatus)
    status: string;

    @Field(type => [CreateBidDto], { nullable: true })
    bids: CreateBidDto[];

    @Field()
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    timestamp: number;
}