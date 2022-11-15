import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { EventTrackingService } from './event-tracking.service';
import { 
  Bid, 
  // BidSchema 
} from './schema/bid.schema';
import {
  DutchAuction,
  // DutchAuctionSchema,
} from './schema/dutch-auction.schema';
import { EventTrackingResolver } from './event-tracking.resolver';
import { DutchAuctionService } from './dutch-auction.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   {name: DutchAuction.name, schema: DutchAuctionSchema},
    //   {name: Bid.name, schema: BidSchema}
    // ]),
    TypeOrmModule.forFeature([DutchAuction, Bid]),
    UserModule
  ],
  providers: [
    EventTrackingService,
    EventTrackingResolver,
    DutchAuctionService
  ]
})
export class EventTrackingModule {}
