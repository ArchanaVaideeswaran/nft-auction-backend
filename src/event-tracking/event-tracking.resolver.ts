import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBidDto } from './dto/create-bid.dto';
import { DutchAuctionService } from './dutch-auction.service';
import { DutchAuction } from './schema/dutch-auction.schema';

@Resolver()
export class EventTrackingResolver {

    constructor(
        private dutchAuctionService: DutchAuctionService
    ) {}

    @Query(returns => [DutchAuction])
    dutchAuctions(): Promise<DutchAuction[]> {
        return this.dutchAuctionService.findAll();
    }

    @Query(returns => DutchAuction)
    dutchAuction(@Args('id') id: string): Promise<DutchAuction> {
        const auction = this.dutchAuctionService.findById(id);
        if(!auction) {
            throw new NotFoundException(id);
        }
        return auction;
    }

    @Mutation(returns => DutchAuction)
    addBid(@Args('bidData') bidData: CreateBidDto): Promise<DutchAuction> {
        return this.dutchAuctionService.createOrUpdateBid(bidData);
    }
}
