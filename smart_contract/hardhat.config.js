require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:
  {
    rinkeby:
    {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/ZntU6uxAx4IzPsZhH9TB5o0R6UvHuM3J',
      accounts: [
        '45c6ca04862a794b8fd77a93cdf68ab20435032e22c20494e4e7c57fdfe1107d'
      ],
    },
  },
};
