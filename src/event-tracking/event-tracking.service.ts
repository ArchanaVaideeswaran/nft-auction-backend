import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { dutchAuctionAbi } from 'src/blockchain/abi/dutchAuction.abi';
import { dutchAuctionAddress } from 'src/blockchain/address';
import {
  auctionCancelledEvent,
  auctionCreatedEvent,
  auctionItemSoldEvent,
  web3ConnectionOptions,
  webSocketProvider,
} from 'src/blockchain/constants';
import { createContractInstance } from 'src/blockchain/contractInstance';
import web3Instance from 'src/blockchain/web3Instance';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Bid } from './schema/bid.schema';
import { DutchAuction } from './schema/dutchAuction.schema';
const Web3 = require('web3');

@Injectable()
export class EventTrackingService implements OnModuleInit {
  private web3ProviderInstance;
  private web3SocketConnection;
  constructor(
    @InjectRepository(DutchAuction)
    private dutchAuctionRepository: Repository<DutchAuction>,
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @Inject(UserModule)
    private userService: UserService,
  ) {}
  async onModuleInit(): Promise<void> {
    this.web3ProviderInstance = web3Instance;
    this.initiateWebSocket();
  }

  async initiateWebSocket(): Promise<void> {
    this.web3SocketConnection = new Web3.providers.WebsocketProvider(
      webSocketProvider,
      web3ConnectionOptions,
    );

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.web3SocketConnection.on('connect', function () {
      console.log(' PROVIDER SUCESSFULLY CONNECTED');
      // <- fires after successful connection
      that.subscribeEvent(dutchAuctionAddress, auctionCreatedEvent);
      that.subscribeEvent(dutchAuctionAddress, auctionItemSoldEvent);
      that.subscribeEvent(dutchAuctionAddress, auctionCancelledEvent);
    });
    this.web3SocketConnection.on('error', function (err) {
      console.log('ERROR', '~ on-error:', err); // <- never fires
      that.initiateWebSocket();
    });
    this.web3SocketConnection.on('end', async (err) => {
      console.log('ERROR', '~ on-end:', err); // <- never fires
      that.initiateWebSocket();
    });
    this.web3SocketConnection.on('close', (event) => {
      console.log('ERROR', '~ on-close:', event); // <- never fires
      that.initiateWebSocket();
    });
  }

  async subscribeEvent(
    contractAddress: string,
    eventObject: any,
  ): Promise<void> {
    try {
      // fetch the topic from the smart contract
      const topic =
        await this.web3ProviderInstance.eth.abi.encodeEventSignature(
          eventObject.EventSignature,
        );
      const connection = new Web3(this.web3SocketConnection);

      connection.eth
        .subscribe('logs', {
          address: contractAddress.toString(),
          topics: [topic],
        })
        .on('data', async (events) => {
          try {
            console.log(
              'INFO',
              '----- ',
              eventObject.EventName,
              'event triggered -----',
            );

            // abi function type
            const typesArray = eventObject.EventArray;

            const topiclength = events.topics.length;
            // decode the event and save in result
            const result = await this.web3ProviderInstance.eth.abi.decodeLog(
              typesArray,
              events.data,
              events.topics.slice(1, topiclength),
            );

            // saving data after 3 seconds so that block is mined
            await new Promise((res) => setTimeout(res, 3000));

            return this.saveData(
              contractAddress,
              result,
              events,
              eventObject.EventName,
            );
          } catch (err) {
            console.log('ERROR', '-----------error-------------', err.message);
          }
        })
        .on('error', (err) => {
          console.log(
            'ERROR',
            '----------web3 socket error-----------',
            err.message,
          );
        });
    } catch (error) {
      console.log('ERROR', 'Error on supply event tracking', error.message);
    }
  }

  async saveData(
    contractAddress: string,
    result: any,
    event: any,
    eventName: string,
  ): Promise<void> {
    const contractInstance = await createContractInstance(
      dutchAuctionAbi,
      contractAddress,
    );
    const timestamp = `${
      (await this.web3ProviderInstance.eth.getBlock(event.blockNumber))
        .timestamp
    }`;

    let response: object;
    let dbResponse: any;
    let availableTransactionHash: any;

    switch (eventName) {
      case 'AuctionCreated':
        const item = await contractInstance.methods
          .getListing(result.nft, result.tokenId)
          .call();

        console.log('Auction Item: ', item);

        // let seller: User = await this.userService.findOne(item.seller);

        response = {
          seller: item.seller,
          nft: result.nft,
          tokenId: result.tokenId.toString(),
          startPrice: parseFloat(ethers.utils.formatEther(item.startPrice)),
          endPrice: parseFloat(ethers.utils.formatEther(item.endPrice)),
          startTime: parseInt(item.startTime),
          duration: parseInt(item.duration),
          paymentToken: item.paymentToken,
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
          timestamp: parseInt(timestamp),
        };

        console.log('inside auction created event handler ');
        console.log('Auction Item: ', response);

        availableTransactionHash = await this.dutchAuctionRepository.find({
          where: {
            transactionHash: event.transactionHash,
          },
        });

        //check if the transactionHash is already present
        if (availableTransactionHash && availableTransactionHash.length) {
          console.log(
            '----------------',
            event.transactionHash,
            'is already present----------------',
          );
        } else {
          console.log(event.transactionHash, ' is added to DB');
          dbResponse = this.dutchAuctionRepository.create(response);
          this.dutchAuctionRepository.save(dbResponse);
        }

      case 'AuctionItemSold':

      case 'AuctionCancelled':
    }
  }
}
