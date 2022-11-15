import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
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
import { CreateDutchAuctionDto } from './dto/create-dutch-auction.dto';
import { DutchAuctionService } from './dutch-auction.service';
import { BidStatus } from './enums/bid-status.enum';
import { DutchAuctionStatus } from './enums/dutch-auction-status.enum';
import { Bid } from './schema/bid.schema';
const Web3 = require('web3');

@Injectable()
export class EventTrackingService implements OnModuleInit {
	private web3ProviderInstance;
	private web3SocketConnection;
	private ethersProvider;
	constructor(
		@Inject(UserService)
		private userService: UserService,
		private dutchAuctionService: DutchAuctionService,
	) {}
	async onModuleInit(): Promise<void> {
		this.web3ProviderInstance = web3Instance;
		this.initiateWebSocket();
	}

	async initiateWebSocket(): Promise<void> {
		// this.web3SocketConnection = new Web3.providers.WebsocketProvider(
		// 	webSocketProvider,
		// 	web3ConnectionOptions,
		// );

		this.ethersProvider = ethers.providers.getDefaultProvider(
			'http://localhost:8545'
		);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		// this.web3SocketConnection.on('connect', function () {
		// 	console.log(' PROVIDER SUCESSFULLY CONNECTED');
		// 	// <- fires after successful connection
		// 	// that.subscribeEvent(dutchAuctionAddress, auctionCreatedEvent);
		// 	// that.subscribeEvent(dutchAuctionAddress, auctionItemSoldEvent);
		// 	// that.subscribeEvent(dutchAuctionAddress, auctionCancelledEvent);
		// });
		// this.web3SocketConnection.on('error', function (err) {
		// 	console.log('ERROR', '~ on-error:', err); // <- never fires
		// 	that.initiateWebSocket();
		// });
		// this.web3SocketConnection.on('end', async (err) => {
		// 	console.log('ERROR', '~ on-end:', err); // <- never fires
		// 	that.initiateWebSocket();
		// });
		// this.web3SocketConnection.on('close', (event) => {
		// 	console.log('ERROR', '~ on-close:', event); // <- never fires
		// 	that.initiateWebSocket();
		// });
	}

	async subscribeEvent(
		contractAddress: string,
		eventObject: any,
	): Promise<void> {
		try {
			// fetch the topic from the smart contract
			const topic = await this.web3ProviderInstance.eth.abi.
			encodeEventSignature(
				eventObject.EventSignature,
			);
			console.log('topic: ', topic);
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
					const result = await this.web3ProviderInstance.eth.abi.
					decodeLog(
						typesArray,
						events.data,
						events.topics.slice(1, topiclength),
					);

					// saving data after 5 seconds so that block is mined
					await new Promise((res) => setTimeout(res, 5000));

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
		const contractInstance = new ethers.Contract(
			contractAddress,
			dutchAuctionAbi,
			this.ethersProvider,
		);

		const timestamp = `${
			(await this.web3ProviderInstance.eth.getBlock(event.blockNumber))
			.timestamp
		}`;

		switch (eventName) {
			case 'AuctionCreated':
				console.log('inside auction created event handler');

				const item = await contractInstance.getListing(
					result.nft, 
					result.tokenId
				);

				const newAuctionData: CreateDutchAuctionDto = {
					seller: item.seller,
					nft: result.nft,
					tokenId: result.tokenId.toString(),
					startPrice: parseFloat(ethers.utils.formatEther(item.startPrice)),
					endPrice: parseFloat(ethers.utils.formatEther(item.endPrice)),
					startTime: parseInt(item.startTime),
					duration: parseInt(item.duration),
					paymentToken: item.paymentToken,
					status: DutchAuctionStatus.NOT_ACTIVE,
					bids: [],
					blockNumber: event.blockNumber,
					transactionHash: event.transactionHash,
					timestamp: parseInt(timestamp),
				};

				console.log('Auction Item: ', newAuctionData);

				// const createResponse = await this.dutchAuctionService.createAuction(newAuctionData);
				// if (createResponse != null) 
				// 	this.userService.addAuction(createResponse);

				// console.log('inserted: ', createResponse);

				break;

			case 'AuctionItemSold':
				console.log('inside auction item sold event handler');

				const bid: Bid = {
					bidder: result.buyer,
					amount: result.amount,
					nft: result.nft,
					tokenId: result.tokenId,
					status: BidStatus.ACCEPTED,
					blockNumber: event.blockNumber,
					transactionHash: event.transactionHash,
					timestamp: parseInt(timestamp),
				}

				console.log('Auction bid: ', bid);

				// const createBidRes = await this.dutchAuctionService.createOrUpdateBid(bid);

				// console.log('bid added: ', createBidRes);

				break;

			case 'AuctionCancelled':
				console.log('inside auction cancelled event handler');

				const auctionUpdateData = DutchAuctionStatus.CANCELLED;

				const options = {
					seller: result.seller,
					nft: result.nft,
					tokenId: result.tokenId,
				}

				// const updateRes = await this.dutchAuctionService.updateAuctionStatus(
				// 	auctionUpdateData,
				// 	options
				// );

				// console.log('status updated: ', updateRes);

				break;
		}
	}
}
