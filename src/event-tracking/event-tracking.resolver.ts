import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewBidInput } from './dto/new-bid-input.dto';
import { DutchAuctionService } from './dutch-auction.service';
import { DutchAuction } from './schema/dutch-auction.schema';

@Resolver()
export class EventTrackingResolver {

    constructor(
        private dutchAuctionService: DutchAuctionService
    ) {}

    @Query(returns => [DutchAuction])
    dutchAuctions(
        // @Args('options') options?: DutchAuctionParams
    ): Promise<DutchAuction[]> {
        return this.dutchAuctionService.findAll(
            // options
        );
    }

    @Query(returns => DutchAuction)
    dutchAuctionById(@Args('id') id: string): Promise<DutchAuction> {
        const auction = this.dutchAuctionService.findById(id);
        if(!auction) {
            throw new NotFoundException(id);
        }
        return auction;
    }

    @Mutation(returns => DutchAuction)
    addBid(@Args('bidData') bidData: NewBidInput): Promise<DutchAuction> {
        return this.dutchAuctionService.createOrUpdateBid(bidData);
    }
}
