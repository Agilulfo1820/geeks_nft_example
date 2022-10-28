const GeeksNFT = artifacts.require('GeeksNFT')
const truffleAssertions = require('truffle-assertions')

contract('GeeksNFT', (accounts) => {
    const deployerAccount = accounts[0]
    
    let contract
    before(async () => {
        contract = await GeeksNFT.deployed()
        await contract.unpauseSale()
    })

    it('Owner can correctly withdraw smart contract balance', async () => {
        // balance sc
        let initialBalance = (await web3.eth.getBalance(contract.address)).toString()
        // mint per incrementare balance 
        const mintPrice = (await contract.mintPrice()).toString()
        await contract.mintNFT(1, {value: mintPrice})

        let balanceToWithdraw = (await web3.eth.getBalance(contract.address)).toString()
        assert(parseInt(balanceToWithdraw) === parseInt(initialBalance) + parseInt(mintPrice), 'Balance must increment after mint')

        // withdraw
        const oldUserBalance = (await web3.eth.getBalance(deployerAccount)).toString()
        const gasPrice= 1000000000000000
        const tx = await contract.withdraw({gasPrice})

        const gasUsed = tx.receipt.gasUsed
        const transactionCost = gasUsed * gasPrice

        // balane sc = 0
        let newBalance = (await web3.eth.getBalance(contract.address)).toString()
        assert(newBalance == 0)

        let newUserBalance = (await web3.eth.getBalance(deployerAccount)).toString()
        assert(parseInt(newUserBalance) === parseInt(oldUserBalance) - transactionCost + parseInt(balanceToWithdraw))
    })

    it('Only owner can withdraw', async () => {
        // mint per incrementare balance 
        const mintPrice = (await contract.mintPrice()).toString()
        await contract.mintNFT(1, {value: mintPrice})

        // balance sc
        let initialBalance = (await web3.eth.getBalance(contract.address)).toString()

        await truffleAssertions.reverts(contract.withdraw({from: accounts[1]}))

        let newBalance = (await web3.eth.getBalance(contract.address)).toString()

        assert(newBalance === initialBalance)
    })
})