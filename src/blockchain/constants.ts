export const webSocketProvider = "ws://localhost:8545";

export const web3ConnectionOptions = {
  timeout: 30000,
  clientConfig: {
    keepalive: true,
    keepaliveInterval: -1,
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: { auto: true, delay: 1000, maxAttempts: 10, onTimeout: false },
};

export const auctionCreatedEvent = {
    EventName: "AuctionCreated",
    EventArray: [
        { indexed: true, name: 'nft', type: 'address' },
        { indexed: false, name: 'tokenId', type: 'uint256' },
        { indexed: true, name: 'seller', type: 'address' },
    ],
    EventSignature: "AuctionCreated(address,uint256,address)",
};

export const auctionItemSoldEvent = {
    EventName: "AuctionItemSold",
    EventArray: [
        { indexed: true, name: 'nft', type: 'address' },
        { indexed: false, name: 'tokenId', type: 'uint256', },
        { indexed: true, name: 'seller', type: 'address', },
        { indexed: true, name: 'buyer', type: 'address', },
        { indexed: false, name: 'amount', type: 'uint256' }
    ],
    EventSignature: "AuctionItemSold(address,uint256,address,address,uint256)",
};

export const auctionCancelledEvent = {
    EventName: "AuctionCancelled",
    EventArray: [
        { indexed: true, name: 'nft', type: 'address' },
        { indexed: false, name: 'tokenId', type: 'uint256' },
        { indexed: true, name: 'seller', type: 'address' },
    ],
    EventSignature: "AuctionCancelled(address,uint256,address)",
};