import { Bid } from "src/event-tracking/schema/bid.schema";
import { DutchAuction } from "src/event-tracking/schema/dutchAuction.schema";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectID;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    address: string;

    @Column(type => DutchAuction)
    auctions: DutchAuction[];

    @Column(type => Bid)
    bids: Bid[];
}