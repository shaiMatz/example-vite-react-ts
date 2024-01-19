import React, { useState } from "react";
import "./App.css";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { WebRenderer } from "@wharfkit/web-renderer";
import { SessionKit } from "@wharfkit/session";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { APIClient, Authority,ABI } from "@wharfkit/antelope";
import { AccountKit } from "@wharfkit/account";
import { Chains } from "@wharfkit/common";
import { Account } from "@wharfkit/account";
import { Permission } from "@wharfkit/account";
import { ContractKit } from "@wharfkit/contract";
import Signup from "./Components/signupComp"
import Setmsg from "./Components/Setmsg"
import ElectionTester from "./Components/ElectionTester"






//create a session to interact with the blockchain for active actions
const accountName = "votechain111";
const permissionName = "active";
const privateKey = "5K6x2VoZZZUUx9SXqgbqprJRfXKWq5qSs4JRSZ8K6myzkdQi3Z3";
const walletPlugin = new WalletPluginPrivateKey(privateKey);
const chain = {
  id: "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d",
  url: "https://jungle4.greymass.com",
};

const session = new Session(
  {
    actor: accountName,
    permission: permissionName,
    chain,
    walletPlugin: walletPlugin,
  },
  {
    transactPlugins: [new TransactPluginResourceProvider()],
  }
);

// create a contract to load the contract actions
const client = new APIClient(
  { url: "https://jungle4.greymass.com" }); 
  testAccount: Account;
  const contractKit = new ContractKit({
  client: client,
});

const contract = await contractKit.load("votechain111");
const actionname = contract.actionNames;
console.log(actionname);

const response = await client.v1.chain.get_abi("votechain111");






const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


      return (
        <div className="App">
          <header className="App-header">
            <h1>VoteChain Demo</h1>
          </header>
          <div className="App-body">
            <div className="App-content">
              <h2>Send message</h2>
              {/* <h2>Signup</h2> */}

              {/* <Signup /> */}
              {/* <Setmsg session={session} contract = {contract}/> */}
              <ElectionTester contract={contract} session={session} />

            </div>
        </div>
   
    </div>
  );
};

export default App;
