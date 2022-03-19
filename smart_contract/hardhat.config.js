require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ALCHEMY_API_KEY = "wfTxodlNuOKdPNWHHATwNOnZGgaTg8LC";
const RINKEBY_PRIVATE_KEY = "f501f753142512a5424f7a5e6cec78f1f078d7fbb36ebef9aec95ff61f597933";



module.exports = {
  solidity: "0.8.4",
  networks:
  {
    rinkeby:
    {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    },
  },
};
