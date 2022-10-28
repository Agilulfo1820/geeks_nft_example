const GeeksNFT = artifacts.require('GeeksNFT')
const truffleAssertions = require('truffle-assertions')

contract('Minting', (accounts) => {
    const deployerAccount = accounts[1]
    
    let contract
    before(async () => {
        contract = await GeeksNFT.deployed()
    })

    it('Test that name and symbol are setted correctly', async () => {
        const name = await contract.name()
        const symbol = await contract.symbol()

        assert(name === 'GeeksNFT')
        assert(symbol === 'GNFT')
    })

    it('User can correctly mint NFTs', async () => {
        await contract.mintNFT(accounts[1], 1)
    })

    it('Test that tokenUri works as intended', async ()=> {
        const tx = await contract.mintNFT(deployerAccount, 1)
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
})