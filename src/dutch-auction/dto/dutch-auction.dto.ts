import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsEthereumAddress, IsNumber, IsNumberString, IsString } from "class-validator";

export enum DutchAuctionStatus {
    INACTIVE = 'INACTIVE', // auction not started
    ACTIVE = 'ACTIVE', // auction stared and is active
    SETTLED = 'SETTLED', // auction settled with a bid
    CANCELLED = 'CANCELLED', // auction cancelled by seller
    ENDED = 'ENDED' // auction ended after exceeding endTime
}

@ObjectType()
export class TransactionDto {
    @Field()
    @IsString()
    transactionHash: string;
    @Field()
    @IsNumber()
    blockNumber: number;
    @Field()
    @IsNumber()
    timestamp: number;
}

@InputType()
export class TransactionInputDto {
    @Field({ nullable: true })
    @IsString()
    transactionHash: string;
    @Field({ nullable: true })
    @IsNumber()
    blockNumber: number;
    @Field({ nullable: true })
    @IsNumber()
    timestamp: number;
}

@ObjectType()
export class BidDto {
    @Field()
    @IsEthereumAddress()
    bidder: string;
    @Field()
    @IsNumber()
    amount: number;
    @Field({ defaultValue: false })
    @IsBoolean()
    executed: boolean;
    @Field(() => TransactionDto, { nullable: true })
    transaction: TransactionDto;
}

@InputType()
export class BidInputDto {
    @Field({ nullable: true })
    @IsEthereumAddress()
    bidder: string;
    @Field({ nullable: true })
    @IsNumber()
    amount: number;
    @Field({ nullable: true })
    @IsBoolean()
    executed: boolean;
    @Field(() => TransactionInputDto, { nullable: true })
    transaction: TransactionInputDto;
}

@ObjectType()
export class DutchAuctionDto {
    @Field(() => ID, )
    @IsString()
    _id: string;
    @Field()
    @IsEthereumAddress()
    seller: string;
    @Field()
    @IsEthereumAddress()
    nft: string;
    @Field()
    @IsNumberString()
    tokenId: string;
    @Field()
    @IsNumber()
    startPrice: number;
    @Field()
    @IsNumber()
    endPrice: number;
    @Field()
    @IsNumber()
    startTime: number;
    @Field()
    @IsNumber()
    duration: number;
    @Field()
    @IsEthereumAddress()
    paymentToken: string;
    @Field(() => [BidDto], { defaultValue: [], nullable: true })
    bids: BidDto[];
    @Field(() => TransactionDto)
    createdTx: TransactionDto;
    @Field({ defaultValue: DutchAuctionStatus.INACTIVE })
    @IsEnum(DutchAuctionStatus)
    status: string;
    @Field(() => TransactionDto, { nullable: true })
    endedTx: TransactionDto;
}

@InputType()
export class DutchAuctionInputDto {
    @Field(() => ID, { nullable: true })
    @IsString()
    _id: string;
    @Field({ nullable: true })
    @IsEthereumAddress()
    seller: string;
    @Field({ nullable: true })
    @IsEthereumAddress()
    nft: string;
    @Field({ nullable: true })
    @IsNumberString()
    tokenId: string;
    @Field({ nullable: true })
    @IsNumber()
    startPrice: number;
    @Field({ nullable: true })
    @IsNumber()
    endPrice: number;
    @Field({ nullable: true })
    @IsNumber()
    startTime: number;
    @Field({ nullable: true })
    @IsNumber()
    duration: number;
    @Field({ nullable: true })
    @IsEthereumAddress()
    paymentToken: string;
    @Field(() => [BidInputDto], { defaultValue: [], nullable: true })
    bids: BidInputDto[];
    @Field(() => TransactionInputDto, { nullable: true })
    createdTx: TransactionInputDto;
    @Field({ defaultValue: DutchAuctionStatus.INACTIVE, nullable: true })
    @IsEnum(DutchAuctionStatus)
    status: string;
    @Field(() => TransactionInputDto, { nullable: true })
    endedTx: TransactionInputDto;
}