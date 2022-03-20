pragma solidity ^0.8.0;

    contract Transactions{

        struct transaction
	    {
           address receiver;
           uint amount;
           string timestamp;
	    }
        
        mapping(address => mapping(uint=>transaction)) public userTransactions;
        mapping (address => uint256) lastPosition;

        function publishTransaction(address receiver, uint amount,string memory timestamp) public
        {
            userTransactions[msg.sender][lastPosition[msg.sender]] = transaction(receiver,amount,timestamp);
            lastPosition[msg.sender]++;
        }

        function readTransaction(uint id) view public returns(address,uint,string memory)
        {
            transaction memory t = userTransactions[msg.sender][id];
            return (
                    t.receiver,
                    t.amount,
                    t.timestamp);
        }

        function readTransactionLength() view public returns(uint)
        {
            return lastPosition[msg.sender];
        }
        
    }
