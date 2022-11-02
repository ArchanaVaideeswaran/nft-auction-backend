import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from 'src/event-tracking/schema/bid.schema';
import { DutchAuction } from 'src/event-tracking/schema/dutch-auction.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) {}

    findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    findById(id: string): Promise<UserDocument> {
        return this.userModel.findOne({ id }).exec();
    }

    findByAddress(address: string): Promise<UserDocument> {
        return this.userModel.findOne({ address }).exec();
    }

    async addUser(newUserData: CreateUserDto): Promise<UserDocument> {
        const user = await this.findByAddress(newUserData.address);
        if(!user) {
            let newUser = new this.userModel({
                id: uuid(),
                address: newUserData.address,
                auctions: [],
                bids: [],
            });
            console.log("--------------new user ", newUser.address , " created--------------");
            return newUser.save();
        }
        return user;
    }

    async addAuction(auctionData: DutchAuction): Promise<UserDocument> {
        console.log("add auction to user\n", auctionData);
        // return this.userModel.findOne(
        //     { address: auctionData.seller }, 
        //     (err: any, userDoc: UserDocument) => {
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
        console.log("user document: ", user);
        user.auctions.push(auctionData);
        console.log(user.auctions);
        return user.save(); 
    }

    async addBid(bidData: Bid): Promise<UserDocument> {
        const user = await this.findByAddress(bidData.bidder);
        if(!user) return;
        user.bids.push(bidData);
        return user.save(); 
    }
}
