import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BidStatus } from "../enums/bid-status.enum";
import { Field, ID, ObjectType } from "@nestjs/graphql";

export type BidDocument = Bid & Document;

@ObjectType()
@Schema()
export class Bid {
    @Field(type => ID)
    @Prop()
    bidder: string;

    @Field()
    @Prop()
    amount: number;

    @Field()
    @Prop()
    nft: string;

    @Field()
    @Prop()
    tokenId: string;

    @Field()
    @Prop({ default: BidStatus.PENDING })
    status: string;

    @Field()
    @Prop()
    blockNumber: number;

    @Field()
    @Prop()
    transactionHash: string;

    @Field()
    @Prop()
    timestamp: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);