const GeeksNFT = artifacts.require('GeeksNFT')
const truffleAssertions = require('truffle-assertions')

contract('GeeksNFT', (accounts) => {
    const deployerAccount = accounts[0]
    
    let contract
    before(async () => {
        contract = await GeeksNFT.deployed()
    })

    it('Test that total supply works correctly', async () => {
        const oldSupply = (await contract.totalSupply()).toNumber()
        assert(oldSupply === 0)

        const tx = await contract.mintNFT(accounts[1], 1)

        const newSupply = (await contract.totalSupply()).toNumber()
        assert(newSupply === oldSupply + 1)

        truffleAssertions.eventEmitted(tx, 'Transfer', (event) => {
            return event.tokenId.toNumber() === newSupply
        })
    })
})