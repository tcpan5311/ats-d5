pragma solidity ^0.8.0;

    contract Transactions{

        struct transaction
	    {
           address sender;
           address receiver;
           uint amount;
           string message;
           string keyword;
	    }
        
        mapping (address => uint256) lastPosition;
        mapping(address => mapping(uint=>transaction)) public userTransactions;
        
         // event Transfer(address sender, address receiver, uint amount, string message, uint256 timestamp, string keyword);

        constructor() public
        {

            publishTransaction(
            0x880B0c348DabcE31cfa2f9014C6445abb55d4459,    
            0x8B80976C275552b75001E2353FfB0351098a7836,
            200000000000000000,
            "Transfering ETH 0.2 to 0x8B80976C275552b75001E2353FfB0351098a7836",
            "Transfer"
            );

            publishTransaction(
            0x880B0c348DabcE31cfa2f9014C6445abb55d4459,    
            0x8B80976C275552b75001E2353FfB0351098a7836,
            300000000000000000,
            "Transfering ETH 0.3 to 0x8B80976C275552b75001E2353FfB0351098a7836",
            "Transfer"
            );

            publishTransaction(
            0x8B80976C275552b75001E2353FfB0351098a7836,
            0x880B0c348DabcE31cfa2f9014C6445abb55d4459,    
            300000000000000000,
            "Transfering ETH 0.3 to 0x8B80976C275552b75001E2353FfB0351098a7836",
            "Transfer"
            );

        }

        function publishTransaction(address sender, address receiver, uint amount, string memory message, string memory keyword) public
        {
            userTransactions[sender][lastPosition[sender]] = transaction(sender,receiver,amount,message,keyword);
            lastPosition[sender]++;
        }

        function readTransaction(address sender,uint id) view public returns(address,address,uint,string memory,string memory)
        {
            return (userTransactions[sender][id].sender,
                    userTransactions[sender][id].receiver,
                    userTransactions[sender][id].amount,
                    userTransactions[sender][id].message,
                    userTransactions[sender][id].keyword);
        }

        function readTransactionLength(address sender) view public returns(uint256)
        {
            return lastPosition[sender];
        }


    }
