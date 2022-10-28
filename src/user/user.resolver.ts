import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewUserInput } from './dto/new-user-input.dto';
import { UserType } from './types/user.type';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {

    constructor(private readonly userService: UserService) {}

    @Mutation(returns => UserType)
    addUser(@Args('newUserData') newUserData: NewUserInput): Promise<UserType> {
        return this.userService.create(newUserData);
    }

    @Query(returns => [UserType])
    users(): Promise<UserType[]> {
        return this.userService.findAll();
    }

    @Query(returns => UserType)
    user(@Args('id') id: string): Promise<UserType> {
        const user = this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(id);
        }
        return user;
    }
    
    @Query(returns => UserType)
    userByAddress(@Args('address') address: string): Promise<UserType> {
        const user = this.userService.findByAddress(address);
        if (!user) {
            throw new NotFoundException(address);
        }
        return user;
    }
}
