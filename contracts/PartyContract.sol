pragma solidity >=0.7.0 <0.9.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol"; // Use this while running it in remix

import "./Token.sol";

contract PartyContract {

    struct Party {
        string name;
        string contactNumber;
        string email;
        string password;
        uint256 trustScore;
        uint256 createdAt;
        address partyAddress;
        uint256[] tenderIds;
        uint256 freezedBalance;
        uint256[] tenderIdsToValidate;
        uint8 verifyParty; // 0: Not Verified, 1: Verified
    }

    mapping (address => Party) public parties;
    address[] public partyAddresses;
    address public admin;
    Token public tokenRef;
    uint256 tokenAmount = 50; // Giving 50 tokens to a created party, fixed amount of tokens to credit

       
    constructor() {
        // tokenRef = _tokenRef;  
        // admin = msg.sender;
    }

    //setters and getters
    function getTrustScore(address _partyAddress) public view returns(uint256) {
        return parties[_partyAddress].trustScore;
    }

    function setTrustScore(address _partyAddress, uint256 _trustScore) public {
        parties[_partyAddress].trustScore = _trustScore;
    }

    modifier isOwner(address owner) {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier isPartyExists(address _partyAddress) {
        require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
        _;
    }

    // Function for creating party
   function createParty(string memory _name, string memory _contactNumber, string memory _email, string memory _password, address _partyAddress) public isOwner(_partyAddress) {
        require(parties[_partyAddress].partyAddress == address(0), "Party already exists");

        Party storage newParty = parties[_partyAddress];
        newParty.name = _name;
        newParty.contactNumber = _contactNumber;
        newParty.email = _email;
        newParty.password = _password;
        newParty.trustScore = 0;
        newParty.createdAt = block.timestamp;
        newParty.partyAddress = _partyAddress;
        newParty.tenderIds = new uint256[](0);
        newParty.verifyParty = 0; // Set verifyParty to 0 when creating a new party

        partyAddresses.push(_partyAddress);
    }

    // Function for validating a user by a government address/////----++
    function updateVerificationStatus(address _userAddress, uint8 _status) public isOwner(admin) isPartyExists(_userAddress) {
    parties[_userAddress].verifyParty = _status;
}

function getVerificationStatus(address _userAddress) public view isPartyExists(_userAddress) returns (uint8) {
    return parties[_userAddress].verifyParty;
}


    //Function for updating party
    function updateParty(string memory _name, string memory _password, address _partyAddress) public isOwner(_partyAddress) isPartyExists(_partyAddress) {
        // require(msg.sender == parties[_partyAddress].partyAddress, "Only party owner can update/delete party details.");
        Party storage updatedParty = parties[_partyAddress];
        updatedParty.name  = _name;
        updatedParty.password = _password;
    }
    
    //Function for deleting a party on platform
    function deleteParty(address _partyAddress) public isOwner(_partyAddress) isPartyExists(_partyAddress) {
        // require(msg.sender == parties[_partyAddress].partyAddress, "Only party owner can update/delete party details.");
        delete parties[_partyAddress];
        for (uint256 i = 0; i < partyAddresses.length; i++) {
            if (partyAddresses[i] == msg.sender) {
                partyAddresses[i] = partyAddresses[partyAddresses.length - 1];
                partyAddresses.pop();
                break;
            }
        }
    }
 
    // Function for getting details of a particular party
    function getPartyDetails(address _partyAddress) public isOwner(_partyAddress) isPartyExists(_partyAddress) view returns (string memory, string memory, string memory, address, uint256, string memory) {
        return (parties[_partyAddress].name, parties[_partyAddress].contactNumber, parties[_partyAddress].email, parties[_partyAddress].partyAddress, parties[_partyAddress].trustScore, parties[_partyAddress].password);
    }
}
