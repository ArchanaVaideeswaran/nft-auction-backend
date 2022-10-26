import { Bid } from "src/event-tracking/schema/bid.schema";
import { DutchAuction } from "src/event-tracking/schema/dutchAuction.schema";
import { Entity, ObjectIdColumn, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: string;

    @PrimaryColumn()
    address: string;

    @OneToMany(type => DutchAuction, auction => auction.seller, { eager: true })
    auction: DutchAuction[];

    @OneToMany(type => Bid, bid => bid.bidder, { eager: true })
    bid: Bid[];
}