// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./TenderContract.sol";
import "./PartyContract.sol";

contract BidContract {
    //enum BidStatus{0, 1}

    // Bidding Struct
    struct Bid {
        uint256 bidId;
        string bidClause;
        uint256 quotedAmount;
        address bidderAddress;
        uint256 tenderId;
        uint256 bidStatus;
        uint256 createdAt;
        bool isExists;
    }
    struct PartyC {
        string name;
        string contactNumber;
        string email;
        address partyAddress;
        uint256 trustScore;
        string password; 
       }

    mapping (uint256 => Bid) public bids;
    uint256 bidCount = 0;
    TenderContract public tenderRef;
    PartyContract public partyRef;
    constructor(TenderContract _tenderRef,PartyContract _partyRef ){
        tenderRef = _tenderRef;
        partyRef = _partyRef;
    }

    //setters and getters
    function getBidderAddress(uint256 _bidId) public view returns(address) {
        return bids[_bidId].bidderAddress;
    }

    modifier isOwner(address owner) {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier isTenderOwner(address _partyAddress, uint256 _tenderId) {
        address issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require(issuerAddress == _partyAddress, "you're not authorized to perform this action");
        _;
    }

    modifier isBidOwner(address _bidderAddress, uint256 _bidId) {
        require(bids[_bidId].bidderAddress == _bidderAddress, "you're not authorized to perform this action");
        _;
    }

    function createBid(address _bidderAddress, uint256 _tenderId, string memory _bidClause, uint256 _quotedAmount) public{
        // Tender storage _tender = tenderRef.tenders(_tenderId);
        require(tenderRef.getBidsCount(_tenderId) <= 15, "Maximum bids for this tender exceeded");
        uint256 _budget = tenderRef.getBudget(_tenderId);
        TenderStatus _tenderStatus = tenderRef.getTenderStatus(_tenderId);
        uint256 _deadline = tenderRef.getDeadline(_tenderId);
        address _issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require(_budget > 0, "Tender does not exist");
        require(_tenderStatus == TenderStatus.OPEN, "Tender is not open for bids");
        require(block.timestamp < _deadline, "Bidding has ended");
        require(_bidderAddress != _issuerAddress, "Owner cannot bid on their own tender");

        Bid storage newBid = bids[bidCount];
        newBid.bidId = bidCount;
        newBid.bidClause = _bidClause;
        newBid.quotedAmount = _quotedAmount;
        newBid.bidderAddress = _bidderAddress;
        newBid.tenderId = _tenderId;
        newBid.bidStatus = 0;
        newBid.createdAt = block.timestamp;
        newBid.isExists = true;
        tenderRef.addBidId(_tenderId, bidCount);
        bidCount++;
    }

    modifier canViewBid(address _partyAddress ,uint256 _tenderId, uint256 _bidId){
        address issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require((bids[_bidId].bidderAddress == _partyAddress  || issuerAddress == _partyAddress), "Not authorized to view bid details");
        _;
    }

    // For getting bid details like message, amount, address of bidders 
    function getBidDetails(address _partyAddress ,uint256 _tenderId, uint256 _bidId) public view canViewBid(_partyAddress, _tenderId, _bidId) returns (Bid memory) {
	    require(bids[_bidId].quotedAmount > 0, "Bid does not exist");
    	return (bids[_bidId]);
    }
      function getBDetails(uint256 _bidId) public view  returns (string memory, string memory, string memory, address, uint256, string memory) {
	    require(bids[_bidId].quotedAmount > 0, "Bid does not exist");
    	return (  partyRef.getPartyDetails(bids[_bidId].bidderAddress));
    }

    function getMyBids(address _bidderAddress) public view isOwner(_bidderAddress) returns(Bid[] memory, uint){
        require(bidCount > 0, "No bids exist");
        uint count =0;
        Bid[] memory bidsList = new Bid[](bidCount);
        uint256 j=0;
        for (uint256 i = 0; i < bidCount ; i++ ) {
            if(j<bidCount){

            if(bids[i].isExists == true && bids[i].bidderAddress == _bidderAddress){
                count++;
                bidsList[j] = bids[i];
            }
            }
               j++; 
        }
        return(bidsList, j);
    }

    // For getting all bids of a tender
     function getNAllBids(address _partyAddress, uint256 _tenderId) public view isTenderOwner(_partyAddress, _tenderId) returns(Bid[] memory){
        uint256[] memory tenderBidIds = tenderRef.getBidIds(_tenderId);
        require(tenderBidIds.length > 0, "No bids exists");
        Bid[] memory bidsList = new Bid[](tenderBidIds.length);
        for (uint256 i = 0; i < tenderBidIds.length; i++) {
            if(bids[i].isExists == true) {
                bidsList[i] = bids[tenderBidIds[i]];
            }
        }
        return(bidsList);
    }
     function getAllBids(address _partyAddress, uint256 _tenderId) public  isTenderOwner(_partyAddress, _tenderId) returns(Bid[] memory) {
    uint256[] memory tenderBidIds = tenderRef.getBidIds(_tenderId);
    require(tenderBidIds.length > 0, "No bids exist");
    
    // Find the minimum quote amount
    uint256 minQuote = type(uint256).max; // Assuming max value for initialization
    for (uint256 i = 0; i < tenderBidIds.length; i++) {
        uint256 currentBidId = tenderBidIds[i];
        if (bids[currentBidId].quotedAmount < minQuote && bids[currentBidId].isExists) {
            minQuote = bids[currentBidId].quotedAmount;
        }
    }

    Bid[] memory bidsList = new Bid[](tenderBidIds.length);
    for (uint256 i = 0; i < tenderBidIds.length; i++) {
        uint256 currentBidId = tenderBidIds[i];
        Bid storage updatedBid = bids[currentBidId];
        if (bids[currentBidId].isExists) {
            // Check if the bid has the minimum quote amount
            if (bids[currentBidId].quotedAmount == minQuote) {
                
               updatedBid.bidStatus = 1;
            } else {
                updatedBid.bidStatus= 0;
            }
        }
    }
    return bidsList;
}
   modifier getAllFBids(address _partyAddress, uint256 _tenderId)  {
    uint256[] memory tenderBidIds = tenderRef.getBidIds(_tenderId);
    require(tenderBidIds.length > 0, "No bids exist");
    
    // Find the minimum quote amount
    uint256 minQuote = type(uint256).max; // Assuming max value for initialization
    for (uint256 i = 0; i < tenderBidIds.length; i++) {
        uint256 currentBidId = tenderBidIds[i];
        if (bids[currentBidId].quotedAmount < minQuote && bids[currentBidId].isExists) {
            minQuote = bids[currentBidId].quotedAmount;
        }
    }

    Bid[] memory bidsList = new Bid[](tenderBidIds.length);
    for (uint256 i = 0; i < tenderBidIds.length; i++) {
        uint256 currentBidId = tenderBidIds[i];
        Bid storage updatedBid = bids[currentBidId];
        if (bids[currentBidId].isExists) {
            // Check if the bid has the minimum quote amount
            if (bids[currentBidId].quotedAmount == minQuote) {
                
               updatedBid.bidStatus = 0;
            } else {
                updatedBid.bidStatus= 1;
            }
        }
    }
     _;
}

    function updateBidStatus(address _partyAddress, uint256 _tenderId, uint256 _bidAddress ,uint256 _bidStatus) public isTenderOwner(_partyAddress, _tenderId) {
        Bid storage updatedBid = bids[_bidAddress];
        updatedBid.bidStatus = _bidStatus;
    }

    function updateBid(address _bidderAddress, uint256 _bidId, string memory _bidClause, uint256 _quotedAmount) public isBidOwner(_bidderAddress, _bidId) {
        require(bids[_bidId].quotedAmount > 0 , "bid with address doesn't exists");
        require(bids[_bidId].bidStatus == 1 , "bid cannot be updated");
        Bid storage updatedBid = bids[_bidId];
        updatedBid.bidClause = _bidClause;
        updatedBid.quotedAmount = _quotedAmount;
    }

    function deleteBid(address _bidderAddress, uint256 _tenderId ,uint256 _bidId) public isBidOwner(_bidderAddress, _bidId){ 
        uint256[] memory tenderBidIds = tenderRef.getBidIds(_tenderId);
        require(tenderBidIds.length > 0, "No bids exists");
        require(bids[_bidId].quotedAmount > 0 , "bid with address doesn't exists");
        require(bids[_bidId].bidStatus == 1 , "bid cannot be deleted");
        bids[_bidId].isExists = false;
        // delete bids[_bidId];
        // tenderRef.deleteBidId(_tenderId, _bidId);         
        for(uint256 i=0;i<tenderBidIds.length;i++){
            if(tenderBidIds[i] == _bidId){
                tenderBidIds[i] = tenderBidIds[tenderBidIds.length -1];
                tenderRef.setBidIds(tenderBidIds, _tenderId);
                break;
            }
        }    
    }

    modifier isValidTender(uint256 tenderId) {
        uint256 _deadline = tenderRef.getDeadline(tenderId);
        TenderStatus _tenderStatus = tenderRef.getTenderStatus(tenderId);
        require(block.timestamp >= _deadline && _tenderStatus == TenderStatus.CLOSED);
        _;
    }

    

 
    // function filterBidsByQuotedAmount(Bid[] memory bidList) public returns(Bid[] memory) {
	// for (uint i = 1; i < bidList.length; i++) {
	// 	for (uint j = 0; j < i; j++) {
	// 		if (bidList[i].quotedAmount < bidList[j].quotedAmount) {
	// 			Bid memory tempBid = bidList[i];
	// 			bidList[i] = bidList[j];
	// 			bidList[j] = tempBid;
	// 		}
	// 	}
	// }
	// return bidList;
    //  }

}