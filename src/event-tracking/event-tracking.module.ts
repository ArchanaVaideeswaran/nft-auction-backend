import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { EventTrackingService } from './event-tracking.service';
import { Bid } from './schema/bid.schema';
import { DutchAuction } from './schema/dutch-auction.schema';
import { EventTrackingResolver } from './event-tracking.resolver';
import { DutchAuctionService } from './dutch-auction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DutchAuction,
      Bid
    ]),
    UserModule
  ],
  providers: [
    EventTrackingService,
    EventTrackingResolver,
    DutchAuctionService
  ]
})
export class EventTrackingModule {}
