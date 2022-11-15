import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

enum DutchAuctionStatus {
    INACTIVE = 'INACTIVE', // auction not started
    ACTIVE = 'ACTIVE', // auction stared and is active
    SETTLED = 'SETTLED', // auction settled with a bid
    CANCELLED = 'CANCELLED', // auction cancelled by seller
    ENDED = 'ENDED' // auction ended after exceeding endTime
}

@Entity()
class Transaction {
    @Column()
    @IsString()
    transactionHash: string;
    @Column()
    @IsNumber()
    blockNumber: number;
    @Column()
    @IsNumber()
    timestamp: number;
}

@Entity()
class Bid {
    @Column()
    @IsEthereumAddress()
    bidder: string;
    @Column()
    @IsNumber()
    amount: number;
    @Column({ default: false })
    @IsBoolean()
    executed: boolean;
    @Column()
    transaction: Transaction;
}

@Entity()
export class DutchAuction {
    @ObjectIdColumn()
    _id: string;
    @Column()
    @IsEthereumAddress()
    seller: string;
    @Column()
    @IsEthereumAddress()
    nft: string;
    @Column()
    @IsNumberString()
    tokenId: string;
    @Column()
    @IsNumber()
    startPrice: number;
    @Column()
    @IsNumber()
    endPrice: number;
    @Column()
    @IsNumber()
    startTime: number;
    @Column()
    @IsNumber()
    duration: number;
    @Column()
    bids: Bid[];
    @Column(() => Transaction)
    createdTx: Transaction;
    @Column({ default: DutchAuctionStatus.INACTIVE })
    @IsEnum(DutchAuctionStatus)
    status: string;
    @Column(() => Transaction)
    endedTx: Transaction;
}