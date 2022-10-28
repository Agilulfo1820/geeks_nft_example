const GeeksNFT = artifacts.require('GeeksNFT')
const truffleAssertions = require('truffle-assertions')
const ethers = require('ethers')

contract('GeeksNFT', (accounts) => {
    const deployerAccount = accounts[0]
    
    let contract
    before(async () => {
        contract = await GeeksNFT.deployed()
        await contract.unpauseSale()
    })

    it('User must send correct amount of ETH in order to mint', async () => {
        const mintPrice = (await contract.mintPrice()).toString()

        await truffleAssertions.reverts(contract.mintNFT(1, {value: 0}))

        await contract.mintNFT(1, {value: mintPrice})

        await truffleAssertions.reverts(contract.mintNFT(2, {value: mintPrice}))

        await contract.mintNFT(2, {value: mintPrice * 2})
    })

    it('Only owner can update mint price', async () => {
        await truffleAssertions.reverts(contract.updateMintPrice(1000, {from: accounts[1]}))

        await contract.updateMintPrice(1000, {from: deployerAccount})
    })
})