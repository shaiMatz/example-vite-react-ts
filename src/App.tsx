import React, { useState } from "react";
import "./App.css";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

const accountName = "wharfkit1111";
const permissionName = "test";

const chain = {
  id: "73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d",
  url: "https://jungle4.greymass.com",
};
const privateKey = "5Jtoxgny5tT7NiNFp1MLogviuPJ9NniWjnU4wKzaX4t7pL4kJ8s";
const walletPlugin = new WalletPluginPrivateKey(privateKey);

const session = new Session({
  actor: accountName,
  permission: permissionName,
  chain,
  walletPlugin,
});

const transferAction = {
  account: "eosio.token",
  name: "transfer",
  authorization: [session.permissionLevel],
  data: {
    from: session.actor,
    to: "wharfkittest",
    quantity: "0.0001 EOS",
    memo: "Hello World! from Shai",
  },
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
        <p className="">{transactionId}</p>
      </header>
    </div>
  );
};

export default App;
