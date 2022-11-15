import { Module } from '@nestjs/common';
import { DutchAuctionService } from './dutch-auction.service';
import { DutchAuctionResolver } from './dutch-auction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchAuction } from './schema/dutch-auction.schema';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TypeOrmModule.forFeature([DutchAuction]),
  ],
  providers: [
    DutchAuctionService, 
    DutchAuctionResolver
  ]
})
export class DutchAuctionModule {}
