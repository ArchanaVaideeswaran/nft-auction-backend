import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DutchAuctionStatus } from "../enums/dutch-auction-status.enum";
import { 
    Bid, 
    // BidSchema 
} from "./bid.schema";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AbstractBaseEntity } from 'src/common/schema/abstract-base.schema';
import { Column, Entity } from 'typeorm';

// export type DutchAuctionDocument = DutchAuction & Document;

@ObjectType()
// @Schema()
@Entity()
export class DutchAuction extends AbstractBaseEntity {
    @Field(type => ID)
    // @Prop()
    @Column()
    id: string;

    @Field()
    // @Prop()
    @Column()
    seller: string;

    @Field()
    // @Prop()
    @Column()
    nft: string;

    @Field()
    // @Prop()
    @Column()
    tokenId: string;

    @Field()
    // @Prop()
    @Column()
    startPrice: number;

    @Field()
    // @Prop()
    @Column()
    endPrice: number;

    @Field()
    // @Prop()
    @Column()
    startTime: number;

    @Field()
    // @Prop()
    @Column()
    duration: number;

    @Field()
    // @Prop()
    @Column()
    paymentToken: string;
    
    @Field()
    // @Prop({ default: DutchAuctionStatus.NOT_ACTIVE })
    @Column({default: DutchAuctionStatus.NOT_ACTIVE})
    status: string;

    @Field(type => [Bid], { defaultValue: [] })
    // @Prop({type: [{ type: BidSchema, ref: 'Bid' }]})
    @Column(() => Bid)
    bids: Bid[];

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

// export const DutchAuctionSchema = SchemaFactory.createForClass(DutchAuction);