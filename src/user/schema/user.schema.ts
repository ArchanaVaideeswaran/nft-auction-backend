import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AbstractBaseEntity } from "src/common/schema/abstract-base.schema";
import { Bid, BidSchema } from "src/event-tracking/schema/bid.schema";
import { DutchAuction, DutchAuctionSchema } from "src/event-tracking/schema/dutch-auction.schema";

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User extends AbstractBaseEntity {
    @Field(() => ID)
    @Prop()
    id: string;

    @Field()
    @Prop()
    address: string;

    @Field(type => [DutchAuction])
    @Prop({type: [{ type: DutchAuctionSchema, ref: 'DutchAuction' }]})
    auctions: DutchAuction[];

    @Field(type => [Bid])
    @Prop({type: [{ type: BidSchema, ref: 'Bid' }]})
    bids: Bid[];
}

export const UserSchema = SchemaFactory.createForClass(User);