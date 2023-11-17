import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import WebRenderer from "@wharfkit/web-renderer";
import React from "react";
import metamask from "@metamask/onboarding";
import { useSDK } from "@metamask/sdk-react";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { Result } from "ethers";

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
  let temp;

  const onClick = async () => {
    const result = await session.transact({ action: transferAction });
    temp = result;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WharfKit React Demo 123</h1>

        <button onClick={onClick}>Transfer</button>

        {temp}
      </header>
    </div>
  );
};

export default App;
