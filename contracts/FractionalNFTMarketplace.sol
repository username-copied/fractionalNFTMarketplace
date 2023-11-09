

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// contract FractionalNFTMarketplace is ERC721URIStorage {

//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;
//     Counters.Counter private _itemsSold;
//     address payable owner;
//     uint256 listPrice = 0.01 ether;

//     struct FractionalToken {
//         uint256 tokenId;
//         address payable owner;
//         address payable seller;
//         uint256 pricePerShare;
//         uint256 totalShares;
//         uint256 availableShares;
//         mapping(address => uint256) sharesOwned;
//     }

//     mapping(uint256 => FractionalToken) private idToFracToken;

//     event TokenListedSuccess (
//         uint256 indexed tokenId,
//         address owner,
//         address seller,
//         uint256 pricePerShare,
//         uint256 totalShares,
//         uint256 availableShares
//     );

//     constructor() ERC721("FractionalNFTMarketplace", "FNFTM") {
//         owner = payable(msg.sender);
//     }

//     function updateListPrice(uint256 _listPrice) public payable {
//         require(owner == msg.sender, "Only owner can update listing price");
//         listPrice = _listPrice;
//     }

//     function getListPrice() public view returns (uint256) {
//         return listPrice;
//     }

//     // function getLatestIdToFracToken() public view returns (FractionalToken memory) {
//     //     uint256 currentTokenId = _tokenIds.current();
//     //     return idToFracToken[currentTokenId];
//     // }

//     function getLatestTokenId() public view returns (uint256) {
//         return _tokenIds.current();
//     }

//     function getLatestTokenOwner() public view returns (address payable) {
//         uint256 currentTokenId = _tokenIds.current();
//         return idToFracToken[currentTokenId].owner;
//     }

//     function getLatestTokenSeller() public view returns (address payable) {
//         uint256 currentTokenId = _tokenIds.current();
//         return idToFracToken[currentTokenId].seller;
//     }

//     function getLatestTokenPricePerShare() public view returns (uint256) {
//         uint256 currentTokenId = _tokenIds.current();
//         return idToFracToken[currentTokenId].pricePerShare;
//     }

//     function getLatestTokenTotalShares() public view returns (uint256) {
//         uint256 currentTokenId = _tokenIds.current();
//         return idToFracToken[currentTokenId].totalShares;
//     }

//     function getLatestTokenAvailableShares() public view returns (uint256) {
//         uint256 currentTokenId = _tokenIds.current();
//         return idToFracToken[currentTokenId].availableShares;
//     }


//     // function getFracTokenForId(uint256 tokenId) public view returns (FractionalToken memory) {
//     //     return idToFracToken[tokenId];
//     // }

//     function getTokenId(uint256 tokenId) public view returns (uint256) {
//         return idToFracToken[tokenId].tokenId;
//     }

//     function getCurrentToken() public view returns (uint256) {
//         return _tokenIds.current();
//     }

//     function createFracToken(string memory tokenURI, uint256 pricePerShare, uint256 totalShares) public payable returns (uint) {
//         _tokenIds.increment();
//         uint256 newTokenId = _tokenIds.current();

//         _safeMint(msg.sender, newTokenId);

//         _setTokenURI(newTokenId, tokenURI);

//         createFractionalToken(newTokenId, pricePerShare, totalShares);

//         return newTokenId;
//     }

//     function createFractionalToken(uint256 tokenId, uint256 pricePerShare, uint256 totalShares) private {
//         require(msg.value == listPrice, "Please send the correct listing price");

//         require(pricePerShare > 0 && totalShares > 0, "Invalid price or total shares");

//         idToFracToken[tokenId] = FractionalToken(
//             tokenId,
//             payable(address(this)),
//             payable(msg.sender),
//             pricePerShare,
//             totalShares,
//             totalShares
//         );

//         _transfer(msg.sender, address(this), tokenId);

//         emit TokenListedSuccess(
//             tokenId,
//             address(this),
//             msg.sender,
//             pricePerShare,
//             totalShares,
//             totalShares
//         );
//     }

//     function getAllFracNFTs() public view returns (FractionalToken[] memory) {
//         uint nftCount = _tokenIds.current();
//         FractionalToken[] memory tokens = new FractionalToken[](nftCount);
//         uint currentIndex = 0;
//         uint currentId;

//         for(uint i=0;i<nftCount;i++)
//         {
//             currentId = i + 1;
//             FractionalToken storage currentItem = idToFracToken[currentId];
//             tokens[currentIndex] = currentItem;
//             currentIndex += 1;
//         }

//         return tokens;
//     }

//     function executeFractionalPurchase(uint256 tokenId, uint256 shares) public payable {
//         uint pricePerShare = idToFracToken[tokenId].pricePerShare;
//         uint totalPrice = pricePerShare * shares;
//         address seller = idToFracToken[tokenId].seller;

//         require(msg.value == totalPrice, "Please submit the correct payment for the shares");

//         require(shares > 0 && shares <= idToFracToken[tokenId].availableShares, "Invalid number of shares");

//         idToFracToken[tokenId].availableShares -= shares;
//         idToFracToken[tokenId].sharesOwned[msg.sender] += shares;
//         _itemsSold.increment();

//         if (idToFracToken[tokenId].availableShares == 0) {
//             idToFracToken[tokenId].currentlyListed = false;
//         }

//         payable(owner).transfer(listPrice);
//         payable(seller).transfer(totalPrice);
//     }

//     function getMyFracNFTs() public view returns (FractionalToken[] memory) {
//         uint totalItemCount = _tokenIds.current();
//         uint itemCount = 0;
//         uint currentIndex = 0;
//         uint currentId;

//         for(uint i=0; i < totalItemCount; i++)
//         {
//             if(idToFracToken[i+1].owner == msg.sender || idToFracToken[i+1].seller == msg.sender){
//                 itemCount += 1;
//             }
//         }

//         FractionalToken[] memory items = new FractionalToken[](itemCount);
//         for(uint i=0; i < totalItemCount; i++) {
//             if(idToFracToken[i+1].owner == msg.sender || idToFracToken[i+1].seller == msg.sender) {
//                 currentId = i+1;
//                 FractionalToken storage currentItem = idToFracToken[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }

//         return items;
//     }

// }


// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FractionalNFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listPrice = 0.01 ether;

    mapping(uint256 => uint256) private tokenIdToTotalShares;
    mapping(uint256 => mapping(address => uint256)) private tokenIdToSharesOwned;

    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 pricePerShare,
        uint256 totalShares,
        uint256 availableShares
    );

    constructor() ERC721("FractionalNFTMarketplace", "FNFTM") {
        owner = payable(msg.sender);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function createFractionalToken(string memory tokenURI, uint256 pricePerShare, uint256 totalShares) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        require(msg.value == listPrice, "Please send the correct listing price");
        require(pricePerShare > 0 && totalShares > 0, "Invalid price or total shares");

        tokenIdToTotalShares[newTokenId] = totalShares;
        tokenIdToSharesOwned[newTokenId][msg.sender] = totalShares;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit TokenListedSuccess(
            newTokenId,
            address(this),
            msg.sender,
            pricePerShare,
            totalShares,
            totalShares
        );

        return newTokenId;
    }

    function executeFractionalPurchase(uint256 tokenId, uint256 shares) public payable {
        uint pricePerShare = listPrice; // Use list price as price per share for simplicity
        uint totalPrice = pricePerShare * shares;
        address seller = ownerOf(tokenId);

        require(msg.value == totalPrice, "Please submit the correct payment for the shares");
        require(shares > 0 && shares <= tokenIdToSharesOwned[tokenId][seller], "Invalid number of shares");

        tokenIdToSharesOwned[tokenId][seller] -= shares;
        tokenIdToSharesOwned[tokenId][msg.sender] += shares;

        _itemsSold.increment();
        
        payable(owner).transfer(totalPrice);
    }

    // function getSharesOwned(uint256 tokenId, address owner) public view returns (uint256) {
    //     return tokenIdToSharesOwned[tokenId][owner];
    // }
    function getAllNFTs() public view returns (uint256[] memory) {
        uint256 totalTokens = _tokenIds.current();
        uint256[] memory tokenIds = new uint256[](totalTokens);

        for (uint256 i = 0; i < totalTokens; i++) {
            tokenIds[i] = i + 1; // Assuming token IDs start from 1
        }

        return tokenIds;
    }

    function getSharesOwned(uint256 tokenId, address account) public view returns (uint256) {
        return tokenIdToSharesOwned[tokenId][account];
    }


    function getTotalShares(uint256 tokenId) public view returns (uint256) {
        return tokenIdToTotalShares[tokenId];
    }


    function getTokenData(uint256 tokenId) public view returns (
        string memory URI,
        uint256 pricePerShare,
        uint256 totalShares,
        uint256 availableShares
    ) {
        require(_exists(tokenId), "Token does not exist");
        // string memory uri = tokenURI(tokenId);

        URI = tokenURI(tokenId);
        pricePerShare = getListPrice(); // Assuming list price is the price per share
        totalShares = getTotalShares(tokenId);
        availableShares = tokenIdToSharesOwned[tokenId][msg.sender];
        return (URI, pricePerShare, totalShares, availableShares);
    }

}
