// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract GeeksNFT is ERC721, Ownable, ERC721Enumerable {
    using Strings for uint256;

    string public baseUri;
    string public waitingForUnveilUri;
    uint256 public maxSupply;
    uint256 public maxNFTsPerMint;
    bool public salePaused;
    uint256 public mintPrice;

    constructor(string memory _waitingForUnveilUri, uint256 _maxSupply, uint256 _maxNFTsPerMint, uint256 initialMintPrice) 
    ERC721('GeeksNFT', 'GNFT'){
        waitingForUnveilUri = _waitingForUnveilUri;
        maxSupply = _maxSupply;
        maxNFTsPerMint = _maxNFTsPerMint;
        salePaused = true;
        mintPrice = initialMintPrice;
    }

    modifier whenSaleNotPaused {
        require(!salePaused, 'Sale is paused');
        _;
    }

    function mintNFT(uint256 amount) public payable whenSaleNotPaused {
        require(amount <= maxNFTsPerMint, 'Amount is greater than allowed');
        require(msg.value >= amount * mintPrice, 'ETH sent are not enough to mint');

        uint256 currentSupply = totalSupply();

        require(currentSupply + amount <= maxSupply, 'Max supply of NFTs reached.');

        for (uint256 i = 1; i <= amount; i++) {
            _safeMint(msg.sender, currentSupply + i);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(string(abi.encodePacked(baseURI, tokenId.toString())), '.json')) : waitingForUnveilUri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function setBaseUri(string memory newBaseUri) public onlyOwner {
        baseUri = newBaseUri;
    }

    function walletOf(address user) public view returns (uint256[] memory) {
        uint256 nftsCount = balanceOf(user); 
        uint256[] memory tokenIds = new uint256[](nftsCount);
        for (uint256 i = 0; i < nftsCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }

        return tokenIds;
    }

    function pauseSale() public onlyOwner {
        salePaused = true;
    }

    function unpauseSale() public onlyOwner {
        salePaused = false;
    }

    function updateMintPrice(uint256 price) public onlyOwner {
        mintPrice = price;
    }

    function withdraw() public onlyOwner {
        address to = owner();
        payable(to).transfer(address(this).balance);
    }

    function _beforeTokenTransfer(address from,address to,uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

     function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}