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

    constructor(string memory _waitingForUnveilUri, uint256 _maxSupply) ERC721('GeeksNFT', 'GNFT'){
        waitingForUnveilUri = _waitingForUnveilUri;
        maxSupply = _maxSupply;
    }

    function mintNFT(address to, uint256 amount) public {
        uint256 currentSupply = totalSupply();

        require(currentSupply + amount <= maxSupply, 'Max supply of NFTs reached.');

        for (uint256 i = 1; i <= amount; i++) {
            _safeMint(to, currentSupply + i);
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

    function _beforeTokenTransfer(address from,address to,uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

     function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}