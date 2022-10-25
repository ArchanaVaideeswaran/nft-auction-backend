import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { dutchAuctionAbi } from 'src/blockchain/abi/dutchAuction.abi';
import { dutchAuctionAddress } from 'src/blockchain/address';
import { User } from 'src/user/schema/user.schema';
import { Repository } from 'typeorm';
import { Bid } from './schema/bid.schema';
import { DutchAuction } from './schema/dutchAuction.schema';

@Injectable()
export class EventTrackingService implements OnModuleInit {
    private webSocketProvider;
    private dutchAuctionInstance;
    constructor(
        @InjectRepository(DutchAuction)
        private dutchAuctionRepository: Repository<DutchAuction>,
        @InjectRepository(Bid)
        private bidRepository: Repository<Bid>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}
    async onModuleInit(): Promise<void> {
        this.initiateWebSocket();
    }

    async initiateWebSocket(): Promise<void> {
        this.webSocketProvider = new ethers.providers.WebSocketProvider("");
        console.log(this.webSocketProvider.connection)
        this.dutchAuctionInstance = new ethers.Contract(
            dutchAuctionAddress,
            dutchAuctionAbi,
            this.webSocketProvider
        );
        // const auctionCreatedEvent = {
        //     EventName: "AuctionCreated",
        //     EventArray: [
        //         { indexed: true, name: 'nft', type: 'address' },
        //         { indexed: false, name: 'tokenId', type: 'uint256' },
        //         { indexed: true, name: 'seller', type: 'address' },
        //     ],
        //     EventSignature: "AuctionCreated(address,uint256,address)",
        // };
        // this.subscribeEvent(auctionCreatedEvent);

        // const auctionItemSoldEvent = {
        //     EventName: "AuctionItemSold",
        //     EventArray: [
        //         { indexed: true, name: 'nft', type: 'address' },
        //         { indexed: false, name: 'tokenId', type: 'uint256', },
        //         { indexed: true, name: 'seller', type: 'address', },
        //         { indexed: true, name: 'buyer', type: 'address', },
        //         { indexed: false, name: 'amount', type: 'uint256' }
        //     ],
        //     EventSignature: "AuctionItemSold(address,uint256,address,address,uint256)",
        // };

        // const auctionCancelledEvent = {
        //     EventName: "AuctionCreated",
        //     EventArray: [
        //         { indexed: true, name: 'nft', type: 'address' },
        //         { indexed: false, name: 'tokenId', type: 'u int256' },
        //         { indexed: true, name: 'seller', type: 'address' },
        //     ],
        //     EventSignature: "AuctionCancelled(address,uint256,address)",
        // };
    }

    async subscribeEvent(eventObject: any): Promise<void> {}

    async saveData(): Promise<void> {}
}
