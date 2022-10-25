import { Module } from '@nestjs/common';
import { EventTrackingService } from './event-tracking.service';

@Module({
  providers: [EventTrackingService]
})
export class EventTrackingModule {}
