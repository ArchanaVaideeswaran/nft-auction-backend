import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EventTrackingModule } from './event-tracking/event-tracking.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchAuction } from './dutch-auction/schema/dutch-auction.schema';
import { User } from './user/schema/user.schema';
import { DutchAuctionModule } from './dutch-auction/dutch-auction.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/auction'),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost/auction',
      port: 27017,
      useUnifiedTopology: true,
      synchronize: true,
      entities: [
        DutchAuction,
        User
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    EventTrackingModule,
    UserModule,
    DutchAuctionModule
  ],
  providers: [AppService],
})
export class AppModule {}
