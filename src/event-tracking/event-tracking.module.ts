import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { EventTrackingService } from './event-tracking.service';
import { Bid } from './schema/bid.schema';
import { DutchAuction } from './schema/dutchAuction.schema';
import { EventTrackingResolver } from './event-tracking.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DutchAuction,
      Bid
    ]),
    UserModule
  ],
  providers: [EventTrackingService, EventTrackingResolver]
})
export class EventTrackingModule {}
