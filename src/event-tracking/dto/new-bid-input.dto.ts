import { Field, InputType } from "@nestjs/graphql";
import { IsEthereumAddress } from "class-validator";

@InputType()
export class NewBidInput {
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
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    timestamp: number;
}