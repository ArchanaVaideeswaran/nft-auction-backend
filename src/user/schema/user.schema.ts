import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Bid } from "src/event-tracking/schema/bid.schema";
import { DutchAuction } from "src/event-tracking/schema/dutch-auction.schema";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(type => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    address: string;

    @Field(type => [DutchAuction])
    @Column(type => DutchAuction)
    auctions: DutchAuction[];

    @Field(type => [Bid])
    @Column(type => Bid)
    bids: Bid[];
}