import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { 
    User, 
    // UserSchema 
} from './schema/user.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        // MongooseModule.forFeature([
        //     {name: User.name, schema: UserSchema},
        // ]),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService, UserResolver],
    exports: [UserService],
})
export class UserModule {}
