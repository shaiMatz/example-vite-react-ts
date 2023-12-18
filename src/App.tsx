import React, { useState } from "react";
import "./App.css";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { WebRenderer } from "@wharfkit/web-renderer";
import { SessionKit } from "@wharfkit/session";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { APIClient,Authority } from "@wharfkit/antelope";
import { AccountKit, } from "@wharfkit/account";
import { Chains } from "@wharfkit/common";
import {Asset, Serializer } from "@wharfkit/antelope";
import { Account } from "@wharfkit/account";
import { Permission } from "@wharfkit/account";
import { ContractKit } from "@wharfkit/contract"
import {makeClient, mockSessionArgs, mockSessionOptions} from '@wharfkit/mock-data'
import {PlaceholderAuth} from '@wharfkit/signing-request'


const mockAccountName = 'wharfkit1133'
const client = new APIClient({ url: "https://jungle4.greymass.com" })
const accountKit = new AccountKit(Chains.Jungle4, {client})

let testAccount: Account
testAccount = await accountKit.load(mockAccountName)
const account = new Account({
  client,
  data: testAccount.data,
})

const privateKey = "5Jtoxgny5tT7NiNFp1MLogviuPJ9NniWjnU4wKzaX4t7pL4kJ8s";
const walletPlugin = new WalletPluginPrivateKey(privateKey);
const chain = {
  id: "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d",
  url: "https://jungle4.greymass.com",
};
const session = new Session(
  {
    actor: mockAccountName,
    permission: 'active',
    chain,
    walletPlugin,
  },
  {
    transactPlugins: [new TransactPluginResourceProvider()],
  }
);

console.log(testAccount.accountName.equals('wharfkit1133'))
const resources = testAccount.resource('ram')
console.log(resources)

const auth = Authority.from({
  accounts: [],
  keys: [],
  threshold: 1,
  waits: [],
})

const permission = Permission.from({
  parent: 'active',
  perm_name: 'foo',
  required_auth: auth,
})
const action = testAccount.setPermission(permission)

console.log(action.account.equals('eosio'))
console.log(action.name.equals('updateauth'))

const action1 = testAccount.buyRam('10.0000 EOS', {
  receiver: 'votechain111',
})
console.log(action1.account.equals('eosio'))
console.log(action1.name.equals('buyram'))








const accountName = "wharfkit1111";
const permissionName = "test";
const accountName2 = "votechain111";
const permissionName2 = "owner";



const privateKey2 = "5K6x2VoZZZUUx9SXqgbqprJRfXKWq5qSs4JRSZ8K6myzkdQi3Z3";
const walletPlugin2 = new WalletPluginPrivateKey(privateKey2);


const session1 = new Session(
  {
    actor: accountName,
    permission: permissionName,
    chain,
    walletPlugin,
  },
  {
    transactPlugins: [new TransactPluginResourceProvider()],
  }
);
const session2 = new Session(
  {
    actor: accountName2,
    permission: permissionName2,
    chain,
    walletPlugin:walletPlugin2,
  },
  {
    transactPlugins: [new TransactPluginResourceProvider()],
  }
);

const contractKit = new ContractKit({
  client: client
})

const contract = await contractKit.load("votechain111")
const actionname = contract.actionNames
const action5 = contract.action(
  actionname[0],
  {
user: "votechain123",
  }

)
console.log(contract)
const buyRamBytes = async () => {
  try {
    console.log("Ram buying");
    // const client1 = new APIClient({ url: "https://jungle4.greymass.com" });
    // const response = await client1.v1.chain.get_info();

    // console.log(Serializer.objectify(response));
    // const accountKit = new AccountKit(Chains.EOS, {
    //   client:client1,
     
    // });
    // console.log(accountKit);
    // const account = await accountKit.load("votechain111");
    // console.log(account.data);
    // console.log(account.accountName);
    // account.permission("owner")
    // const action = account.buyRam("0.0001 EOS");
    // console.log('action.account',action.account.equals("Name"));
    // console.log('action.account',action.account);
    // console.log('action.name',action.name.equals("buyRam"));
    // console.log('action.name',action.name);
    // console.log(action);
    // const argument={
    //   account: "votechain111",
    //   name: "buyrambytes",
    //   authorization: [session2.permissionLevel],
    //   action:action,
    //   date: {
    //     payer: "votechain111",
    //     receiver: "votechain111",
    //     bytes: 100,
    //   },

    // }

    
    //buyram
    const result = await session.transact( {action:action1} );
    console.log("Ram bought:", result);
    const result2 = await session.transact( {action:action5} );
    console.log("hi:", result2);
  } catch (error) {
    console.error("Error occurred during transaction:", error);
  }
};

const transferAction = {
  account: "eosio.token",
  name: "transfer",
  authorization: [session.permissionLevel],
  data: {
    from: session.actor,
    to: "votechain111",
    quantity: "0.0001 EOS",
    memo: "Hello World! from Shailendra",
  },
};

const args = {
  appName: "voteChain",
  chains: [chain],
  ui: new WebRenderer(),
  walletPlugins: [walletPlugin],
};
const sessionKit = new SessionKit(args);

const login = async () => {
  try {
    await sessionKit.login();
  } catch (error) {
    console.error("Error occurred during login:", error);
  }
};

const logout = async () => {
  try {
    await sessionKit.logout();
  } catch (error) {
    console.error("Error occurred during logout:", error);
  }
};

const App = () => {
  const [transactionId, setTransactionId] = useState(null);

  const onClick = async () => {
    try {
      const result = await session.transact({ action: transferAction });
      const res = result["response"] as any;
      const transactionId = res.transaction_id;
      setTransactionId(transactionId);
      console.log(transactionId);
    } catch (error) {
      console.error("Error occurred during transaction:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WharfKit React Demo 123</h1>
        <Button as="a" variant="primary" onClick={onClick}>
          Transfer
        </Button>
        <Button as="a" variant="primary" onClick={login}>
          Login
        </Button>
        <Button as="a" variant="primary" onClick={logout}>
          Logout
        </Button>
        <Button as="a" variant="primary" onClick={buyRamBytes}>
          Buy Ram
        </Button>
        <p className="">{transactionId}</p>
      </header>
      {/* <signupComp /> */}
    </div>
  );
};

export default App;
