import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EventTrackingModule } from './event-tracking/event-tracking.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DutchAuction } from './event-tracking/schema/dutch-auction.schema';
import { Bid } from './event-tracking/schema/bid.schema';
import { User } from './user/schema/user.schema';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost/auction',
      port: 27017,
      synchronize: true,
      useUnifiedTopology: true,
      entities: [
        DutchAuction,
        Bid,
        User
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true
    }),
    EventTrackingModule,
    UserModule
  ],
  providers: [AppService],
})
export class AppModule {}
