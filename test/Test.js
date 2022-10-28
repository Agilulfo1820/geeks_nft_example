const GeeksNFT = artifacts.require('GeeksNFT')
const truffleAssertions = require('truffle-assertions')

contract('GeeksNFT', (accounts) => {
    const deployerAccount = accounts[0]
    
    let contract
    before(async () => {
        contract = await GeeksNFT.deployed()
        await contract.unpauseSale()
    })

    it('Test that name and symbol are setted correctly', async () => {
        const name = await contract.name()
        const symbol = await contract.symbol()

        assert(name === 'GeeksNFT')
        assert(symbol === 'GNFT')
    })

    it('Test that max supply is setted correctly on deploy', async () => {
        let maxSupply = (await contract.maxSupply()).toNumber()
        assert(maxSupply === 20)
    })

    it('Supply is managed correctly when minting NFTs', async () => {
        let tx = await contract.mintNFT( 1, {from: accounts[1]})
        const firstMintedTokenId = tx.logs[0].args.tokenId.toNumber()
        let nftCount = (await contract.balanceOf(accounts[1])).toNumber()

        let tokenIdsOfUser = await contract.walletOf(accounts[1])
        tokenIdsOfUser = tokenIdsOfUser.map(id => id.toNumber())
        assert(tokenIdsOfUser.length === nftCount)


        await contract.mintNFT( 1, {from: accounts[2]})
        tx = await contract.mintNFT( 1, {from: accounts[1]})
        const secondMintedTokenId = tx.logs[0].args.tokenId.toNumber()
  
        tokenIdsOfUser = await contract.walletOf(accounts[1])
        tokenIdsOfUser = tokenIdsOfUser.map(id => id.toNumber())

        nftCount = (await contract.balanceOf(accounts[1])).toNumber()
        assert(tokenIdsOfUser.length === nftCount)

        assert(tokenIdsOfUser.includes(firstMintedTokenId))
        assert(tokenIdsOfUser.includes(secondMintedTokenId))
    })

    it('Test that tokenUri works as intended', async ()=> {
        const tx = await contract.mintNFT(1)
        const newMintedTokenId = tx.logs[0].args.tokenId.toNumber()

        let waitingForUnveilUri = await contract.waitingForUnveilUri()
        assert(waitingForUnveilUri === "ipfs//QmeQA62eDcT8G2WNisJs8jWctqJ4AP66ifKLWgQPoCn31N", 'Waiting for unveil uri should be set correctly')

        let resultUri = await contract.tokenURI(newMintedTokenId)
        assert(resultUri === waitingForUnveilUri, 'Uri should be waiting for unveil url')

        await contract.setBaseUri('https://new-uri.com/token/')
        let newBaseUri = await contract.baseUri()
        assert(newBaseUri === 'https://new-uri.com/token/', 'Base uri should be updated')

        resultUri = await contract.tokenURI(newMintedTokenId)
        assert(resultUri === newBaseUri + newMintedTokenId + '.json', 'Uri should be baseUri + tokenId')
    })

    it('Only owner should be able to update baseUri', async () => {
        await truffleAssertions.reverts(contract.setBaseUri('https://new-uri.com/token/', {from: accounts[1]}))

        await contract.setBaseUri('https://new-uri.com/token/', {from: deployerAccount})
        let newBaseUri = await contract.baseUri()
        assert(newBaseUri === 'https://new-uri.com/token/', 'Base uri should be updated')
    })

    it('Cannot mint more NFTs than allowed', async () => {
        await truffleAssertions.reverts(contract.mintNFT(6, {from: accounts[1]}))
    })
})