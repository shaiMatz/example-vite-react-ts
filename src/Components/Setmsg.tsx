import React, { useState } from "react";
import { PrivateKey, APIClient } from "@wharfkit/antelope";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { Account, AccountKit } from "@wharfkit/account";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { Chains } from "@wharfkit/common";
import { Name } from "@wharfkit/antelope";

// Import additional types as necessary

interface SetmsgProps {
  session: any; 
  contract: any; 
}

const Setmsg: React.FC<SetmsgProps> = ({ session, contract }) => {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const activeblock = async () => {
    console.log("start");
    const actions = await contract.actionNames;
    console.log("actions: " + actions);
    const action = contract.action(
        actions[1],
        {
            user: Name.from(username),
            message: msg,
        }
      
      )
      const action2 = contract.action(
        actions[0],
        {
            user: Name.from(username),
           
        }
      
      )

    console.log("action1: " + action);
   

    console.log("action2: " + action2);
    
    try {
      const response = await session.transact({ action: action });
      console.log("response: " + response);
        const response2 = await session.transact({ action: action2 });
        console.log("response2: " + response2);
      setStatus("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Error sending message");
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
      <input
        type="text"
        placeholder="Message"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={activeblock}>Send Message</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Setmsg;
