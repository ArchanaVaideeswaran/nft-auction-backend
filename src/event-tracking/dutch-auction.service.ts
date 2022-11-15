import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDutchAuctionDto } from "./dto/create-dutch-auction.dto";
import { CreateBidDto } from "./dto/create-bid.dto";
import { Bid } from "./schema/bid.schema";
import {
  DutchAuction,
//   DutchAuctionDocument,
} from './schema/dutch-auction.schema';
import { v4 as uuid } from 'uuid';
import { ethers } from "ethers";
import { dutchAuctionAbi } from "src/blockchain/abi/dutchAuction.abi";
import { dutchAuctionAddress } from "src/blockchain/address";
import { createContractInstance } from "src/blockchain/contractInstance";
import { BidStatus } from "./enums/bid-status.enum";
import { DutchAuctionStatus } from "./enums/dutch-auction-status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class DutchAuctionService {
    constructor(
        // @InjectModel(DutchAuction.name)
        // private dutchAuctionModel: Model<DutchAuctionDocument>
        @InjectRepository(DutchAuction)
        private dutchAuctionRepository: Repository<DutchAuction>
    ) {}

    findAll(): Promise<DutchAuction[]> {
        // return this.dutchAuctionModel.find().exec();
        return this.dutchAuctionRepository.find();
    }

    async findOneByOptions(options: any): Promise<DutchAuction> {
        // return this.dutchAuctionModel.find(options).exec();
        console.log('--------------findOneByOptions---------------');

        // let auction = await this.dutchAuctionRepository.findOneBy(options);
        // console.log('findOneBy: ', auction);
        
        let auction = await this.dutchAuctionRepository.findOne({ 
            where: {
                nft: options.nft,
                tokenId: options.tokenId
            } 
        });
        console.log('findOne: ', auction);
        
        return auction;
    }

    findById(id: string): Promise<DutchAuction> {
        // return this.dutchAuctionModel.findOne({ id }).exec();
        return this.dutchAuctionRepository.findOneBy({ id });
    }

    async createAuction(
        newAuctionData: CreateDutchAuctionDto
    ): Promise<DutchAuction> {
        const auction = await this.findOneByOptions({
          nft: newAuctionData.nft,
          tokenId: newAuctionData.tokenId
        });

        if (
            auction &&
            auction.transactionHash &&
            auction.transactionHash.length
        ){
            console.log(
                '----------------',
                auction.transactionHash,
                'is already present----------------',
            );
            return;
        }
        else {
            // const auction = new this.dutchAuctionModel({
            //     id: uuid(),
            //     newAuctionData,
                // seller: newAuctionData.seller,
                // nft: newAuctionData.nft,
                // tokenId: newAuctionData.tokenId,
                // startPrice: newAuctionData.startPrice,
                // endPrice: newAuctionData.endPrice,
                // startTime: newAuctionData.startTime,
                // duration: newAuctionData.duration,
                // paymentToken: newAuctionData.paymentToken,
                // status: newAuctionData.status,
                // bids: newAuctionData.bids,
                // blockNumber: newAuctionData.blockNumber,
                // transactionHash: newAuctionData.transactionHash,
                // timestamp: newAuctionData.timestamp,
            // });

            const auction = this.dutchAuctionRepository.create({
                id: uuid(),
                seller: newAuctionData.seller,
                nft: newAuctionData.nft,
                tokenId: newAuctionData.tokenId,
                startPrice: newAuctionData.startPrice,
                endPrice: newAuctionData.endPrice,
                startTime: newAuctionData.startTime,
                duration: newAuctionData.duration,
                paymentToken: newAuctionData.paymentToken,
                status: newAuctionData.status,
                bids: newAuctionData.bids,
                blockNumber: newAuctionData.blockNumber,
                transactionHash: newAuctionData.transactionHash,
                timestamp: newAuctionData.timestamp,
            });
            return this.dutchAuctionRepository.save(auction);
        }
    }

    async getHighestBid(id: string): Promise<Bid> {
        let highestBid: Bid;
        const bids = (await this.findById(id)).bids;
        bids.forEach((bid) => {
            highestBid = bid.amount > highestBid.amount ? bid : highestBid;
        });
        return highestBid;
    }

    async createOrUpdateBid(
        bid: Bid | CreateBidDto,
    ): Promise<DutchAuction> {
        let auction = await this.findOneByOptions({
          nft: bid.nft,
          tokenId: bid.tokenId,
        });

        if(!auction) return;

        console.log('----------------adding new bid----------------');

        if(bid.status === BidStatus.ACCEPTED) {
            auction.status = DutchAuctionStatus.SETTLED;
            console.log('auction status: \n', auction.status);
        }

        if(auction.bids.length === 0) {
            auction.status = DutchAuctionStatus.ACTIVE;
            console.log('auction status: \n', auction.status);
            auction.bids.push(bid);
            console.log('bid added: \n', auction.bids);
        } else {
            let index = auction.bids.indexOf(bid);
            auction.bids[index] = bid;
            console.log('bid updated: \n', auction.bids);
        }

        return this.dutchAuctionRepository.save(auction);
    }

    async updateAuctionStatus(
        status: string, 
        options? :any
    ): Promise<DutchAuction> {
        const auction = await this.findOneByOptions(options);

        auction.status = status;

        return this.dutchAuctionRepository.save(auction);
    }

    // async getCurrentPrice(id: string): Promise<Number> {
    //     const contractInstance = await createContractInstance(
    //         dutchAuctionAbi,
    //         dutchAuctionAddress,
    //     );
    //     const auction = await this.findById(id);

    //     if(!auction) return;

    //     try {
    //         let currentPrice = await contractInstance.methods.
    //         getCurrentPrice(auction.nft, auction.tokenId).call();

    //         currentPrice = parseFloat(ethers.utils.formatEther(currentPrice));

    //         return currentPrice;
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }
}