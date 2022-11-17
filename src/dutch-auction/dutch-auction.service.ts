import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract, providers, utils } from 'ethers';
import { dutchAuctionAbi } from 'src/blockchain/abi/dutchAuction.abi';
import { dutchAuctionAddress } from 'src/blockchain/address';
import { Repository } from 'typeorm';
import {
  BidDto,
  DutchAuctionDto,
  DutchAuctionStatus,
  TransactionDto,
} from './dto/dutch-auction.dto';
import { NftTokenIdDto } from './dto/nft-tokenId.dto';
import { DutchAuction } from './schema/dutch-auction.schema';

@Injectable()
export class DutchAuctionService implements OnModuleInit {
    private readonly logger = new Logger(DutchAuctionService.name);
    private wsProvider;

    constructor(
        @InjectRepository(DutchAuction)
        private dutchAuctionRepository: Repository<DutchAuctionDto>
    ) {}

    async onModuleInit(): Promise<void> {
        this.initializeWebSocket();
    }

    initializeWebSocket() {
        this.wsProvider = new providers.WebSocketProvider(
            'ws://localhost:8545'
        );
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        this.wsProvider._websocket.onopen = () => {
            that.logger.log('web socket provider successfully connected');
            that.subscribeEvent('AuctionCreated');
            that.subscribeEvent('AuctionItemSold');
            that.subscribeEvent('AuctionCancelled');
        };
        this.wsProvider._websocket.on('close', () => {
            that.logger.log('web socket connection closed');
            setTimeout(() => {
                that.logger.log('reopening connection after 3 seconds');
                that.initializeWebSocket();
            }, 3000);
        });
        // web socket error
        this.wsProvider._websocket.onerror = (err: any) => {
            that.logger.error('web socket error: ', err);
            that.initializeWebSocket();
        };
        // provider error
        this.wsProvider.on('error', (err) => {
            that.logger.error('provider on error: ', err);
            that.initializeWebSocket();
        });
    }

    subscribeEvent(event: string) {
        this.logger.log(`subscribed to ${event} event`);
        const provider = new providers.WebSocketProvider(
            'ws://localhost:8545'
        );
        const contractInstance = new Contract(
            dutchAuctionAddress,
            dutchAuctionAbi,
            provider,
        );
        contractInstance.on(event, async (...args) => {
            this.logger.log(`${event} event emitted`);

            let log = args[args.length - 1];
            console.log('log: ', log);
            let timestamp = (await log.getBlock(log.blockNumber)).timestamp;
            
            // called once transaction is mined.
            provider.once(log.transactionHash, async () => {
                switch(event) {
                    case 'AuctionCreated':
                        let listing: any;
                        listing = await contractInstance.getListing(
                            log.args.nft, 
                            log.args.tokenId
                        );
                        console.log('Listing: ', listing);
                        const createRes = await this.auctionCreatedEventHandler(
                            log,
                            listing,
                            timestamp,
                        );
                        console.log(createRes);
                        break;
                    case 'AuctionItemSold':
                        const settledRes = await this.auctionItemSoldEventHandler(
                            log, 
                            timestamp
                        );
                        console.log(settledRes);
                        break;
                    case 'AuctionCancelled':
                        const cancelledRes = await this.auctionCancelledEventHandler(
                            log, 
                            timestamp
                        );
                        console.log(cancelledRes);
                        break;
                };
            });
        });
    }

    findAll(): Promise<DutchAuctionDto[]> {
        this.logger.debug('----------findAll()----------');
        return this.dutchAuctionRepository.find();
    }

    findOneBy(nftTokenId: NftTokenIdDto): Promise<DutchAuctionDto> {
        this.logger.debug('----------findOneBy()----------');
        return this.dutchAuctionRepository.findOneBy({ 
            nft: nftTokenId.nft,
            tokenId: nftTokenId.tokenId 
        });
    }

    createAuction(newAuction: DutchAuctionDto): Promise<DutchAuctionDto> {
        this.logger.debug('----------createDutchAuction()----------');

        let auction = this.dutchAuctionRepository.create(newAuction);
        this.logger.debug('CREATE: Auction: ');

        return this.dutchAuctionRepository.save(auction);
    }

    async insertBid(
        nftTokenId: NftTokenIdDto, 
        newBid: BidDto
    ): Promise<DutchAuctionDto> {
        this.logger.debug('----------insertBid()----------');

        let auction = await this.findOneBy(nftTokenId);

        auction.bids.push(newBid);
        this.logger.debug('INSERT: Auction - Bid: ');
        console.log(auction);

        return this.dutchAuctionRepository.save(auction);
    }

    async updateAuction(
        nftTokenId: NftTokenIdDto,
        status: DutchAuctionStatus,
        endedTx?: TransactionDto,
        settledBid?: BidDto
    ): Promise<DutchAuctionDto> {
        this.logger.debug('----------updateAuction()----------');

        let auction = await this.findOneBy(nftTokenId);

        auction.status = status;
        this.logger.debug('UPDATE: status: ' + status);

        if(endedTx) {
            this.logger.debug('UPDATE: endedTx: ');
            console.log(endedTx);
            let endTime = auction.startTime + auction.duration;
            if(endedTx.timestamp >= endTime) {
                auction.status = DutchAuctionStatus.ENDED;
            }
            auction.endedTx = endedTx;
        }
        if(settledBid) {
            this.logger.debug('UPDATE: settledBid: ');
            console.log(settledBid);
            auction.bids.push(settledBid);
        }

        return this.dutchAuctionRepository.save(auction);
    }

    auctionCreatedEventHandler(
        log: any, 
        listing: any,
        timestamp: number
    ): Promise<DutchAuctionDto> {
        this.logger.log(`----------${log.event} event handler----------`);

        const event = log.args;
        let auction: DutchAuctionDto = {
            _id: null,
            seller: event.seller,
            nft: event.nft,
            tokenId: event.tokenId.toString(),
            startPrice: parseFloat(utils.formatEther(listing.startPrice)),
            endPrice: parseFloat(utils.formatEther(listing.endPrice)),
            startTime: parseInt(listing.startTime.toString()),
            duration: parseInt(listing.duration.toString()),
            paymentToken: listing.paymentToken,
            bids: [],
            createdTx: {
                transactionHash: log.transactionHash,
                blockNumber: log.blockNumber,
                timestamp: timestamp
            },
            status: DutchAuctionStatus.INACTIVE,
            endedTx: null,
        };
        if(auction.createdTx.timestamp >= auction.startTime) {
            auction.status = DutchAuctionStatus.ACTIVE;
        }

        return this.createAuction(auction);
    }

    auctionItemSoldEventHandler(
        log: any, 
        timestamp: number
    ): Promise<DutchAuctionDto> {
        this.logger.log(`----------${log.event} event handler----------`);

        let nftTokenId: NftTokenIdDto = {
            nft: log.args.nft,
            tokenId: log.args.tokenId.toString(),
        };
        let statusSettled: DutchAuctionStatus =
          DutchAuctionStatus.SETTLED;
        let endTxSettled: TransactionDto = {
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            timestamp: timestamp,
        };
        let settledBid: BidDto = {
            bidder: log.args.buyer,
            amount: parseFloat(utils.formatEther(log.args.amount)),
            executed: true,
            transaction: endTxSettled,
        };

        return this.updateAuction(
            nftTokenId,
            statusSettled,
            endTxSettled,
            settledBid
        );
    }

    auctionCancelledEventHandler(
        log: any, 
        timestamp: number
    ): Promise<DutchAuctionDto>  {
        this.logger.log(`----------${log.event} event handler----------`);

        let nft_tokenId: NftTokenIdDto = {
            nft: log.args.nft,
            tokenId: log.args.tokenId.toString(),
        };
        let statusCancelled: DutchAuctionStatus =
          DutchAuctionStatus.CANCELLED;
        let endTxCancelled: TransactionDto = {
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            timestamp: timestamp,
        };

        return this.updateAuction(
            nft_tokenId,
            statusCancelled,
            endTxCancelled
        );
    }
}


