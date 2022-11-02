import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
        ]),
    ],
    exports: [UserService],
    providers: [UserService, UserResolver]
})
export class UserModule {}
