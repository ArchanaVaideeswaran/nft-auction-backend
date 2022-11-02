import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDutchAuctionDto } from "./dto/create-dutch-auction.dto";
import { CreateBidDto } from "./dto/create-bid.dto";
import { Bid } from "./schema/bid.schema";
import { DutchAuction, DutchAuctionDocument } from "./schema/dutch-auction.schema";
import { v4 as uuid } from 'uuid';
import { ethers } from "ethers";
import { dutchAuctionAbi } from "src/blockchain/abi/dutchAuction.abi";
import { dutchAuctionAddress } from "src/blockchain/address";
import { createContractInstance } from "src/blockchain/contractInstance";

@Injectable()
export class DutchAuctionService {
    constructor(
        @InjectModel(DutchAuction.name)
        private dutchAuctionModel: Model<DutchAuctionDocument>
    ) {}

    findAll(): Promise<DutchAuction[]> {
        return this.dutchAuctionModel.find().exec();
    }

    findAllByOptions(options?: any): Promise<DutchAuction[]> {
        return this.dutchAuctionModel.find(options).exec();
    }

    findById(id: string): Promise<DutchAuction> {
        return this.dutchAuctionModel.findOne({ id }).exec();
    }

    async createAuction(newAuctionData: CreateDutchAuctionDto): Promise<DutchAuction> {
        const availabeTxHash = await this.findAllByOptions({
          transactionHash: newAuctionData.transactionHash,
        })[0];

        if (
            availabeTxHash &&
            availabeTxHash.transactionHash &&
            availabeTxHash.transactionHash.length
        ){
            console.log(
                '----------------',
                availabeTxHash.transactionHash,
                'is already present----------------',
            );
            return;
        }
        else {
            const auction = new this.dutchAuctionModel({
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
            return auction.save();
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

    findBid(bidder: string, auction: DutchAuction): Bid {
        let index = this.indexOf(bidder, auction);
        return auction.bids[index];
    }

    indexOf(bidder: string, auction: DutchAuction): number {
        let index = -1;
        for(let i = 0; i < auction.bids.length; i++) {
            if(auction.bids[i].bidder == bidder) {
                index = i;
                break;
            }
        }
        return index;
    }

    async createOrUpdateBid(
        bid: Bid | CreateBidDto,
    ): Promise<DutchAuction> {
        let auction = await this.findAllByOptions({
          nft: bid.nft,
          tokenId: bid.tokenId,
        })[0];

        if(!auction) return;

        let index = this.indexOf(bid.bidder, auction);

        if(index === -1) {
            auction.bids.push(bid);
        } else {
            auction.bids[index] = bid;
        }

        return auction.save();
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