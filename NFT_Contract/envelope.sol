// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./librarys/Ownable.sol";
import "./librarys/ReentrancyGuard.sol";
import "./librarys/ERC721Enumerable.sol";

/**
 * @title ETHDenverEnvelope contract
 */
contract ETHDenverEnvelope is ERC721Enumerable, ReentrancyGuard, Ownable {
    uint256 private _TokenId;
    string private constant _TokenURI = "ipfs://bafybeig3d6hqq7rbp6ixnnahfba2vwqaeundet3jj7ia5hx6szbz3u6ksm/envelope";

    constructor()
    ERC721("ETHDenver-Envelope", "ETHDenver pigeon envelope contract")
    Ownable()
    {}

    function claim(address[] calldata addresses) public nonReentrant onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _safeMint(addresses[i], _TokenId);
            _TokenId++;
        }
    }

    function tokenURI(uint256 tokenId)
    public
    pure
    override
    returns (string memory)
    {
        return _TokenURI;
    }
}
