import { Query, Resolver } from '@nestjs/graphql';
import { UserType } from './types/user.type';

@Resolver()
export class UserResolver {
    @Query(returns => UserType)
    getUser(address: string): UserType {
        return {
            address: "0x0",
        };
    }
}
