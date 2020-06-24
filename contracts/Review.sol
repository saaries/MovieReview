pragma solidity >=0.4.21 <0.7.0;

contract Review {

  // Saving address for reviewers that have already voted
  address[4] public reviewers;

  // Mapp address to bool[], in order to record the panel that has already submitted
  mapping(address => bool[]) public voters;

  // Function: make review
  function review(uint panelId) public returns (uint) {

      // make sure the panelId is right
      require(panelId >= 0 && panelId < 4);

      // save address to array reviewers
      reviewers[panelId] = msg.sender;

      return panelId;
  }

  // Getter for array reviewers
  function getReviewers() public view returns (address[4] memory) {
      return reviewers;
  }
}




