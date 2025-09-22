// backend/contracts/AchievementBadges.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AchievementBadges is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct BadgeInfo {
        string achievementName;
        string category;
        string issuedBy;
        uint256 issueDate;
        string studentName;
    }

    mapping(uint256 => BadgeInfo) public badgeInfo;

    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed studentAddress,
        string achievementName,
        string metadataUri
    );

    constructor() ERC721("AchievementBadges", "BADGE") {}

    function mintBadge(
        address studentAddress,
        string memory metadataUri,
        string memory achievementName,
        string memory category,
        string memory issuedBy,
        string memory studentName
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _mint(studentAddress, tokenId);
        _setTokenURI(tokenId, metadataUri);

        badgeInfo[tokenId] = BadgeInfo({
            achievementName: achievementName,
            category: category,
            issuedBy: issuedBy,
            issueDate: block.timestamp,
            studentName: studentName
        });

        emit BadgeMinted(tokenId, studentAddress, achievementName, metadataUri);
        return tokenId;
    }

    function getBadgeInfo(uint256 tokenId) public view returns (BadgeInfo memory) {
        require(_exists(tokenId), "Token does not exist");
        return badgeInfo[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}