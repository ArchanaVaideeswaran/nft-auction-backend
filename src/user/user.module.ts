import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schema/user.schema';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    exports: [UserModule],
    providers: [UserService, UserResolver]
})
export class UserModule {}
