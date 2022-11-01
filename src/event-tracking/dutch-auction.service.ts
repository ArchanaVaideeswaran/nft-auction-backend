import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ethers } from "ethers";
import { dutchAuctionAbi } from "src/blockchain/abi/dutchAuction.abi";
import { dutchAuctionAddress } from "src/blockchain/address";
import { createContractInstance } from "src/blockchain/contractInstance";
import { Repository } from "typeorm";
import { DutchAuctionParams } from "./dto/dutch-auction-params.dto";
import { NewBidInput } from "./dto/new-bid-input.dto";
import { Bid } from "./schema/bid.schema";
import { DutchAuction } from "./schema/dutch-auction.schema";

@Injectable()
export class DutchAuctionService {
    constructor(
        @InjectRepository(DutchAuction)
        private dutchAuctonRepository: Repository<DutchAuction>
    ) {}

    findAll(options?: DutchAuctionParams | any): Promise<DutchAuction[]> {
        return this.dutchAuctonRepository.find(options);
    }

    findById(id: string): Promise<DutchAuction> {
        return this.dutchAuctonRepository.findOneBy({ id });
    }

    async createAuction(newAuctionData: DutchAuctionParams): Promise<DutchAuction> {
        const availabeTxHash = await this.findAll({
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
          const auction = this.dutchAuctonRepository.create(newAuctionData);
          return this.dutchAuctonRepository.save(auction);
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
        const bids = auction.bids;
        let bid: Bid;
        bids.forEach((b) => {
            if(b.bidder == bidder) {
                bid = b;
            }
        });
        return bid;
    }

    findIndex(bidder: string, auction: DutchAuction): number {
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
        bid: Bid | NewBidInput | any,
    ): Promise<DutchAuction> {
        let auction = await this.findAll({
          nft: bid.nft,
          tokenId: bid.tokenId,
        })[0];

        let index = this.findIndex(bid.bidder, auction);

        if(index === -1) {
            auction.bids.push(bid);
        }else {
            auction.bids[index] = bid;
        }

        return this.dutchAuctonRepository.save(auction);
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