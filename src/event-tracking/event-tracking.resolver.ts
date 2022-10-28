import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DutchAuctionParams } from './dto/dutch-auction-params.dto';
import { NewBidInput } from './dto/new-bid-input.dto';
import { DutchAuctionService } from './dutch-auction.service';
import { DutchAuctionType } from './types/dutch-auction.type';

@Resolver()
export class EventTrackingResolver {

    constructor(
        private dutchAuctionService: DutchAuctionService
    ) {}

    @Query(returns => [DutchAuctionType])
    dutchAuctions(@Args('options') options?: DutchAuctionParams): Promise<DutchAuctionType[]> {
        return this.dutchAuctionService.findAll(options);
    }

    @Query(returns => DutchAuctionType)
    dutchAuctionById(@Args('id') id: string): Promise<DutchAuctionType> {
        const auction = this.dutchAuctionService.findById(id);
        if(!auction) {
            throw new NotFoundException(id);
        }
        return auction;
    }

    @Mutation(returns => DutchAuctionType)
    addBid(@Args('bidData') bidData: NewBidInput): Promise<DutchAuctionType> {
        return this.dutchAuctionService.createOrUpdateBid(bidData);
    }
}
