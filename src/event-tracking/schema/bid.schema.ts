import { Column } from "typeorm";
import { BidStatus } from "../enums/bid-status.enum";

export class Bid {
    @Column()
    bidder: string;

    @Column()
    amount: number;

    @Column()
    nft: string;

    @Column()
    tokenId: string;

    @Column({ default: BidStatus.PENDING })
    status: BidStatus;

    @Column()
    blockNumber: number;

    @Column()
    transactionHash: string;

    @Column()
    timestamp: number;
}