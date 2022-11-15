import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from 'src/event-tracking/schema/bid.schema';
import { DutchAuction } from 'src/event-tracking/schema/dutch-auction.schema';
import { CreateUserDto } from './dto/user.dto';
import { 
    User, 
    // UserDocument 
} from './schema/user.schema';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        // @InjectModel(User.name)
        // private userModel: Model<UserDocument>
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        // return this.userModel.find().exec();
        return this.userRepository.find();
    }

    findById(id: string): Promise<User> {
        // return this.userModel.findOne({ id }).exec();
        return this.userRepository.findOneBy({ id });
    }

    findByAddress(address: string): Promise<User> {
        // return this.userModel.findOne({ address }).exec();
        return this.userRepository.findOneBy({ address });
    }

    async addUser(newUserData: CreateUserDto): Promise<User> {
        const user = await this.findByAddress(newUserData.address);
        if(!user) {
            // let newUser = new this.userModel({
            //     id: uuid(),
            //     address: newUserData.address,
            //     auctions: [],
            //     bids: [],
            // });
            let newUser = this.userRepository.create({
                id: uuid(),
                address: newUserData.address,
            });
            console.log("--------------new user ", newUser.address , " created--------------");
            return this.userRepository.save(newUser);
        }
        return user;
    }

    async addAuction(auctionData: DutchAuction): Promise<User> {
        console.log("add auction to user\n", auctionData);
        // return this.userModel.findOne(
        //     { address: auctionData.seller }, 
        //     (err: any, userDoc: User) => {
        //         if(err != null) {
        //             console.log(err);
        //         }
        //         if (document) {
        //             userDoc.auctions.push(auctionData);
        //             console.log(userDoc.auctions);
        //             userDoc.save((err: any) => {
        //                 err != null ? console.log(err) : console.log('Data updated');
        //             });
        //         }
        //     }
        // ).exec();
        const user = await this.findByAddress(auctionData.seller);
        if(!user) return;
        // console.log("user document: ", user);
        user.auctions.push(auctionData);
        // console.log(user.auctions);
        return this.userRepository.save(user); 
    }

    async addBid(bidData: Bid): Promise<User> {
        const user = await this.findByAddress(bidData.bidder);
        if(!user) return;
        user.bids.push(bidData);
        return this.userRepository.save(user); 
    }
}
