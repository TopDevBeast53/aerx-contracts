import * as nearAPI from "near-api-js";
import { env } from "process";
import { getConfig } from "./config";
const initNear = async () => {
  // get network configuration values from config.js
  // based on the network ID we pass to getConfig()
  const nearConfig = getConfig(process.env.NEXT_PUBLIC_NODE_ENV);

  // create a keyStore for signing transactions using the user's key
  // which is located in the browser local storage after user logs in
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  // Initializing connection to the NEAR testnet
  const near = await nearAPI.connect({ keyStore, ...nearConfig });

  // Initialize wallet connection
  const walletConnection = new nearAPI.WalletConnection(near);

  if (walletConnection.getAccountId()) {
    const accountId = walletConnection.getAccountId();
    //Get Balance
    const account = await walletConnection.account(accountId);
    nearState.setNearAccount(account);
    const balance = await account.getAccountBalance();
    console.log("available near balance other contract: ", balance.available);
    const availableNear = balance.available;
    const nearBalanceBigN = new Big(availableNear || 0);
    const formattedNearBalance = nearBalanceBigN.div("10e23").toFixed(3);
    nearState.setNearBalance(formattedNearBalance);
    console.log("formated near balance other contract: ", formattedNearBalance);
  } else {
    console.log("ACCOUNT ID IS NULL");
  }

  return { accountId, balance, nearConfig, walletConnection };
};

const loadOtherContract = async (walletConnection) => {
  // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    // User's accountId as a string
    walletConnection.account(),
    // accountId of the contract we will be loading
    // NOTE: All contracts on NEAR are deployed to an account and
    // accounts can only have one contract deployed to them.
    contractName,
    {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ["ft_balance_of"],
      changeMethods: ["ft_transfer_call"],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: walletConnection.getAccountId(),
    }
  );
};

export { initNear, loadOtherContract };
