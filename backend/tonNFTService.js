const TonWeb = require('tonweb');
const { NftCollection } = require('tonweb').nft;

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

const nftCollection = new NftCollection(tonweb.provider, {
  ownerAddress: '<YOUR_WALLET_ADDRESS>', // Replace with your wallet address
  collectionContentUri: 'ipfs://<YOUR_COLLECTION_METADATA>', // Replace with your collection metadata URI
  nftItemContentBaseUri: 'ipfs://<YOUR_NFT_METADATA>', // Replace with your NFT metadata URI
});

const mintNft = async (userWalletAddress) => {
  try {
    const mintResult = await nftCollection.mint({
      ownerAddress: userWalletAddress,
      contentUri: 'ipfs://<NFT_METADATA>', // Replace with your NFT metadata URI
    });
    console.log('NFT minted:', mintResult);
    return mintResult;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error('Failed to mint NFT');
  }
};

module.exports = { mintNft };