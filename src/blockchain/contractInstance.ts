import web3Instance from "src/blockchain/web3instance";

export async function createContractInstance(contractABI, contractAddress) {
  const web3ProviderInstance = web3Instance;
  const instance = new web3ProviderInstance.eth.Contract(
    contractABI,
    contractAddress
  );
  return instance;
}
