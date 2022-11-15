import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BidDto, BidInputDto, DutchAuctionDto, DutchAuctionInputDto } from './dto/dutch-auction.dto';
import { NftTokenIdDto } from './dto/nft-tokenId.dto';
import { DutchAuctionService } from './dutch-auction.service';

@Resolver()
export class DutchAuctionResolver {
    constructor(
        private dutchAuctionService: DutchAuctionService
    ) {}

    @Query(() => [DutchAuctionDto])
    dutchAuctions(): Promise<DutchAuctionDto[]> {
        return this.dutchAuctionService.findAll();
    }

    @Query(() => DutchAuctionDto)
    dutchAuction(
        @Args('nftTokenId') nftTokenId: NftTokenIdDto
    ): Promise<DutchAuctionDto> {
        return this.dutchAuctionService.findOneBy(nftTokenId);
    }

    @Mutation(() => DutchAuctionDto)
    createAuction(
        @Args('newAuctionData') newAuctionData: DutchAuctionInputDto
    ): Promise<DutchAuctionDto> {
        return this.dutchAuctionService.createAuction(newAuctionData);
    }

    @Mutation(() => DutchAuctionDto)
    insertBid(
        @Args('nftTokenId') nftTokenId: NftTokenIdDto,
        @Args('newBidData') newBidData: BidInputDto
    ): Promise<DutchAuctionDto> {
        return this.dutchAuctionService.insertBid(nftTokenId, newBidData);
    }
}
