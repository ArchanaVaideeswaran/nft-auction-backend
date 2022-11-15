import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BidStatus } from "../enums/bid-status.enum";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from 'typeorm';

// export type BidDocument = Bid & Document;

@ObjectType()
// @Schema()
@Entity()
export class Bid {
    @Field(type => ID)
    // @Prop()
    @Column()
    bidder: string;

    @Field()
    // @Prop()
    @Column()
    amount: number;

    @Field()
    // @Prop()
    @Column()
    nft: string;

    @Field()
    // @Prop()
    @Column()
    tokenId: string;

    @Field()
    // @Prop({ default: BidStatus.PENDING })
    @Column()
    status: string;

    @Field()
    // @Prop()
    @Column()
    blockNumber: number;

    @Field()
    // @Prop()
    @Column()
    transactionHash: string;

    @Field()
    // @Prop()
    @Column()
    timestamp: number;
}

// export const BidSchema = SchemaFactory.createForClass(Bid);