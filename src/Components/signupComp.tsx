import React, { useState } from "react";
import { PrivateKey, APIClient } from "@wharfkit/antelope";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { Account, AccountKit } from "@wharfkit/account";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { Chains } from "@wharfkit/common";
import { Name } from "@wharfkit/antelope";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");

  const createAccount = async () => {
    try {
      // Generate keys
      const privateKey = PrivateKey.generate("K1");
      const publicKey = privateKey.toPublic();
      console.log("generated keys");
      // API Client
      const client = new APIClient({ url: "https://jungle4.greymass.com" });
      console.log("created client");
      // Session for transactions
      const privateKey2 = "5K6x2VoZZZUUx9SXqgbqprJRfXKWq5qSs4JRSZ8K6myzkdQi3Z3";

      const walletPlugin = new WalletPluginPrivateKey(privateKey2);
      const session = new Session(
        {
          actor: "votechain111",
          permission: "active",
          chain: Chains.Jungle4,
          walletPlugin,
        },
        {
          transactPlugins: [new TransactPluginResourceProvider()],
        }
      );
      console.log("created session");
      const name = Name.from(username);

      // Replace 'youraccountname' with the account that will create the new account
      // This account must have sufficient resources to create a new account
      await session.transact(
        {
          actions: [
            {
              account: "eosio",
              name: "newaccount",
              authorization: [
                {
                  actor: "votechain111",
                  permission: "active",
                },
              ],
              data: {
                creator: "votechain111",
                name: name,
                owner: {
                  threshold: 1,
                  keys: [{ key: String(publicKey), weight: 1 }],
                  accounts: [],
                  waits: [],
                },
                active: {
                  threshold: 1,
                  keys: [{ key: String(publicKey), weight: 1 }],
                  accounts: [],
                  waits: [],
                },
              },
            },{
                account: "eosio",
                name: "buyrambytes",
                authorization: [
                    {
                    actor: "votechain111",
                    permission: "active",
                    },
                ],
                data: {
                    payer: "votechain111",
                    receiver: name,
                    bytes: 8192,
                },
                },
                {
                account: "eosio",
                name: "delegatebw",
                authorization: [
                    {
                    actor: "votechain111",
                    permission: "active",
                    },
                ],
                data: {
                    from: "votechain111",
                    receiver: name,
                    stake_net_quantity: "1.0000 EOS",
                    stake_cpu_quantity: "1.0000 EOS",
                    transfer: false,
                },
            }
            

          ],
        },
        {
          expireSeconds: 30,
        }
      );

      setStatus("Account created successfully");
    } catch (error) {
      console.error("Error creating account:", error);
      setStatus("Error creating account");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={createAccount}>Create Account</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Signup;
