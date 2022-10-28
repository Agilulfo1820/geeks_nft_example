// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GeeksNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 public totalSupply;
    string public baseUri;
    string public waitingForUnveilUri;

    constructor(string memory _waitingForUnveilUri) ERC721('GeeksNFT', 'GNFT'){
        waitingForUnveilUri = _waitingForUnveilUri;
    }

    function mintNFT(address to, uint256 amount) public {
        for (uint256 i = 1; i <= amount; i++) {
            _safeMint(to, totalSupply + i);
        }

        totalSupply = totalSupply + amount;
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
}