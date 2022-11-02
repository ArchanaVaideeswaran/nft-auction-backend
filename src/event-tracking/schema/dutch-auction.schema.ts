import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DutchAuctionStatus } from "../enums/dutch-auction-status.enum";
import { Bid, BidSchema } from "./bid.schema";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AbstractBaseEntity } from 'src/common/schema/abstract-base.schema';

export type DutchAuctionDocument = DutchAuction & Document;

@ObjectType()
@Schema()
export class DutchAuction extends AbstractBaseEntity {
    @Field(type => ID)
    @Prop()
    id: string;

    @Field()
    @Prop()
    seller: string;

    @Field()
    @Prop()
    nft: string;

    @Field()
    @Prop()
    tokenId: string;

    @Field()
    @Prop()
    startPrice: number;

    @Field()
    @Prop()
    endPrice: number;

    @Field()
    @Prop()
    startTime: number;

    @Field()
    @Prop()
    duration: number;

    @Field()
    @Prop()
    paymentToken: string;
    
    @Field()
    @Prop({ default: DutchAuctionStatus.NOT_ACTIVE })
    status: string;

    @Field(type => [Bid])
    @Prop({type: [{ type: BidSchema, ref: 'Bid' }]})
    bids: Bid[];

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

export const DutchAuctionSchema = SchemaFactory.createForClass(DutchAuction);