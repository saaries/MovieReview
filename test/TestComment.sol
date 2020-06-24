pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Review.sol";

contract TestReview {
    Review myReview = Review(DeployedAddresses.Review());


    function testUserCanReviewScenicSpot() public {
      uint returnedId = myReview.review(2);
      uint expected = 2;
      Assert.equal(returnedId, expected, "Panel submitted");
    }


    function testGetReviewerAddressById() public {
      address expected = this;
      address reviewer = myReview.reviewers(2);
      Assert.equal(reviewer, expected, "Panel recorded.");
    }


    function testGetReviewerAddressByIdInArray() public {
      address expected = this;
      address[4] memory reviewers = myReview.getReviewers();
      Assert.equal(reviewers[2], expected, "Reviewer of ID 2 should be recorded.");
    }
}


