//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

contract Guestbook {
  struct Greeting {
    address author;
    string message;
    uint createdAt;
  }

  Greeting[] greetings;

  function addGreeting(string memory _greeting) public {
    greetings.push(Greeting(tx.origin, _greeting, block.timestamp));
  }

  function getGreetings() public view returns (Greeting[] memory) {
    return greetings;
  }
}