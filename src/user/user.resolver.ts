import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewUserInput } from './dto/new-user-input.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {

    constructor(private readonly userService: UserService) {}

    @Mutation(returns => User)
    addUser(@Args('newUserData') newUserData: NewUserInput): Promise<User> {
        return this.userService.addUser(newUserData);
    }

    @Query(returns => [User])
    users(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Query(returns => User)
    user(@Args('id') id: string): Promise<User> {
        const user = this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }
    
    @Query(returns => User)
    userByAddress(@Args('address') address: string): Promise<User> {
        const user = this.userService.findByAddress(address);
        if (!user) {
            throw new NotFoundException(address);
        }
        return user;
    }
}
