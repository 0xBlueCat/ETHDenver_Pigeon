// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./librarys/Ownable.sol";
import "./librarys/ReentrancyGuard.sol";
import "./librarys/ERC721Enumerable.sol";
import "./librarys/IPodCore.sol";
import "./librarys/ITag.sol";
import "./librarys/ReadBuffer.sol";

/**
 * @title ETHDenverTask contract
 */
contract ETHDenverTask is ERC721Enumerable, ReentrancyGuard, Ownable {
    using ReadBuffer for *;

    IERC721 private envelopeCtr;
    ITag private tagCtr;

    bytes18 private rss3FollowedClassId;
    bytes18 private taskClassId;

    string private constant stage0Url = "ipfs://bafybeie57g3vpuw34nndptgc6ogl6j6oyvug4ypezfxsw743xs5azbxib4";
    string private constant stage1Url = "ipfs://bafybeibyhfkivo2gv3os2rsidvt3oucxy2s7x6fqyqczz4nnmzc42dhube";
    string private constant stage2Url = "ipfs://bafybeihsmexabjutmqg52f3o6fket2gheywqygawg7j364gotc3xd2sa2y";
    string private constant stage3Url = "ipfs://bafybeidm7ks32hxzpyxrs3szeueuwzoytkf74uzcmkadktn7feuvbhljxm";

    uint256 private _TokenId;

    constructor(
        address _tagCtr,
        address _envelopeCtr,
        bytes18 _rss3FollowedClassId,
        bytes18 _taskClassId
    ) ERC721("ETHDenver-Task", "ETHDenver pigeon completed task contract") Ownable() {
        tagCtr = ITag(_tagCtr);
        envelopeCtr = IERC721(_envelopeCtr);
        rss3FollowedClassId = _rss3FollowedClassId;
        taskClassId = _taskClassId;
    }

    function claim() public nonReentrant {
        require(
            envelopeCtr.balanceOf(msg.sender) > 0,
            "only envelope nft holder can mint"
        );

        _safeMint(_msgSender(), _TokenId);
        _TokenId++;
    }

    function getRSS3Followed(IPodCore.TagObject memory object)
        internal
        view
        returns (bool)
    {
        return tagCtr.hasTag(rss3FollowedClassId, object);
    }

    function getCompletedTask(IPodCore.TagObject memory object)
        internal
        view
        returns (uint256[] memory completedTasks)
    {
        bytes memory data = tagCtr.getTagData(taskClassId, object);
        if (data.length == 0) {
            return completedTasks;
        }
        ReadBuffer.buffer memory buf;
        buf = ReadBuffer.fromBytes(data);
        uint256 count = buf.readLength();
        completedTasks = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            completedTasks[i] = uint256(buf.readUint8());
        }
        return completedTasks;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        address owner = this.ownerOf(tokenId);
        if (owner == address(0)) {
            //not mint yet
            return "";
        }

        IPodCore.TagObject memory object = IPodCore.TagObject(
            IPodCore.ObjectType.Address,
            bytes20(owner),
            0
        );
        uint256 stage = 0;
        if (getRSS3Followed(object)) {
            stage += 1;
        }
        uint256[] memory completedTasks = getCompletedTask(object);
        stage += completedTasks.length;
        if (stage == 0) {
            return stage0Url;
        } else if (stage == 1) {
            return stage1Url;
        } else if (stage == 2) {
            return stage2Url;
        } else if (stage == 3) {
            return stage3Url;
        } else {
            return "";
        }
    }
}
