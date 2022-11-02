import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { EventTrackingModule } from './event-tracking/event-tracking.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/auction'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    EventTrackingModule,
    UserModule
  ],
  providers: [AppService],
})
export class AppModule {}
