pragma solidity ^0.8.0;

    contract Transactions{

        struct transaction
	    {
           address sender;
           address receiver;
           uint amount;
           string message;
           string timestamp;
	    }
        
        mapping(address => mapping(uint=>transaction)) public userTransactions;
        mapping (address => uint256) lastPosition;
        
        function publishTransaction(address sender, address receiver, uint amount, string memory message, string memory timestamp) public
        {
            userTransactions[sender][lastPosition[sender]] = transaction(sender,receiver,amount,message,timestamp);
            lastPosition[sender]++;
        }

        function readTransaction(address sender,uint id) view public returns(address,address,uint,string memory,string memory)
        {
            transaction memory t = userTransactions[sender][id];
            return (t.sender,
                    t.receiver,
                    t.amount,
                    t.message,
                    t.timestamp);
        }

        function readTransactionLength(address sender) view public returns(uint256)
        {
            return lastPosition[sender];
        }
        
    }
