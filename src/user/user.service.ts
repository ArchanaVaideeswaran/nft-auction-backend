import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/event-tracking/schema/bid.schema';
import { DutchAuction } from 'src/event-tracking/schema/dutch-auction.schema';
import { Repository } from 'typeorm';
import { NewUserInput } from './dto/new-user-input.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findById(id: string): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    findByAddress(address: string): Promise<User> {
        return this.userRepository.findOneBy({ address });
    }

    create(newUserData: NewUserInput): Promise<User> {
        const user = this.userRepository.create(newUserData);
        return this.userRepository.save(user);
    }

    async addAuction(auctionData: DutchAuction): Promise<User> {
        const user = await this.findByAddress(auctionData.seller);
        if(!user) return;
        user.auctions.push(auctionData);
        return this.userRepository.save(user);
    }

    async addBid(bidData: Bid): Promise<User> {
        const user = await this.findByAddress(bidData.bidder);
        if(!user) return;
        user.bids.push(bidData);
        return this.userRepository.save(user); 
    }
}
