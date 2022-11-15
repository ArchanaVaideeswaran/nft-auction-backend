import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AbstractBaseEntity } from "src/common/schema/abstract-base.schema";
import { 
    Bid, 
    // BidSchema,
} from 'src/event-tracking/schema/bid.schema';
import {
  DutchAuction,
//   DutchAuctionSchema,
} from 'src/event-tracking/schema/dutch-auction.schema';
import { Column, Entity } from 'typeorm';

// export type UserDocument = User & Document;

@ObjectType()
// @Schema()
@Entity()
export class User extends AbstractBaseEntity {
    @Field(() => ID)
    // @Prop()
    @Column()
    id: string;

    @Field()
    // @Prop()
    @Column()
    address: string;

    @Field(type => [DutchAuction], { defaultValue: [] })
    // @Prop({type: [{ type: DutchAuctionSchema, ref: 'DutchAuction' }]})
    @Column(() => DutchAuction)
    auctions: DutchAuction[];

    @Field(type => [Bid], { defaultValue: [] })
    // @Prop({type: [{ type: BidSchema, ref: 'Bid' }]})
    @Column(() => Bid)
    bids: Bid[];
}

// export const UserSchema = SchemaFactory.createForClass(User);