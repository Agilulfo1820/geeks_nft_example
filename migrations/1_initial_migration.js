const GeeksNFT = artifacts.require("GeeksNFT");

module.exports = function (deployer) {
  deployer.deploy(GeeksNFT, 'ipfs://QmeQA62eDcT8G2WNisJs8jWctqJ4AP66ifKLWgQPoCn31N', 20, 5, '100000000000000000');
};
