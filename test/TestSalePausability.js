const GeeksNFT = artifacts.require('GeeksNFT')
const truffleAssertions = require('truffle-assertions')

contract('GeeksNFT', (accounts) => {
    const deployerAccount = accounts[0]
    
    let contract
    before(async () => {
        contract = await GeeksNFT.deployed()
        await contract.updateMintPrice(0)
    })

    it('Is possible to mint only when sale is not paused', async () => {
        const isPaused = await contract.salePaused()
        if (!isPaused) {
            await contract.pauseSale()
        }

        await truffleAssertions.reverts(contract.mintNFT(1))

        await contract.unpauseSale()
        await contract.mintNFT(1)
    })

    it('Only owner can pause and unpause sale', async () => {
        await truffleAssertions.reverts(contract.pauseSale({from: accounts[2]}))
        await truffleAssertions.reverts(contract.unpauseSale({from: accounts[2]}))
    })
})