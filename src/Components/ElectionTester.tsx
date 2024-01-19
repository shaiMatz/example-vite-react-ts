import React, { useState, useEffect } from "react";
import { PrivateKey, APIClient } from "@wharfkit/antelope";
import { Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
import { TransactPluginResourceProvider } from "@wharfkit/transact-plugin-resource-provider";
import { Authority, ABI } from "@wharfkit/antelope";
import { AccountKit } from "@wharfkit/account";
import { Chains } from "@wharfkit/common";
import { Account } from "@wharfkit/account";
import { Permission } from "@wharfkit/account";
import { ContractKit } from "@wharfkit/contract";
import { Name } from "@wharfkit/antelope";

interface ElectionTesterProps {
  session: any;
  contract: any;
}

const ElectionTester: React.FC<ElectionTesterProps> = ({
  session,
  contract,
}) => {
  const [status, setStatus] = useState("");
  const [electionsCreated, setElectionsCreated] = useState(false);
  const [voter, setVoter] = useState("");
  const [candidate, setCandidate] = useState("");
  const [electionId, setElectionId] = useState("");
  // Hardcoded data
  const elections = [
    { id: 1, candidates: ["candidate1", "candidate2"] },
    { id: 4, candidates: ["candidate3", "candidate4"] },
  ];

  const voters = [
    {
      username: Name.from("shaishai1235"),
      privatekey: PrivateKey.from(
        "PVT_K1_7G7pQmcYAz1NYBNMzHET9hBULYJSuqeCx43D8bby5KpbeZK2c"
      ),
    },
    {
      username: Name.from("taltal123123"),
      privatekey: PrivateKey.from(
        "PVT_K1_2g5cK7oDqCswccy3LGHTghrpbknakoyBKBhVgwZuZeMCdSyP5U"
      ),
    },
    {
      username: Name.from("taltal123125"),
      privatekey: PrivateKey.from(
        "PVT_K1_mWJ1t8DUrKgniUHGb5wWXoiQ5h6gLYcvFoRF4h8NZ6kZnKz3e"
      ),
    },
  ];

  const initializeVoterSession = async (voterObject: any) => {
    const walletPlugin = new WalletPluginPrivateKey(voterObject.privatekey);

    return new Session(
      {
        actor: voterObject.username,
        permission: "active",
        chain: Chains.Jungle4,
        walletPlugin,
      },
      {
        transactPlugins: [new TransactPluginResourceProvider()],
      }
    );
  };
  // Function to create elections
  const createElections = async () => {
    try {
      for (const election of elections) {
        await session.transact({
          action: contract.action("createelc", {
            election_id: election.id,
            candidates: election.candidates,
          }),
        });
      }
      setStatus("Elections created successfully.");
      setElectionsCreated(true);
    } catch (error) {
      console.error("Error creating elections:", error);
      setStatus("Error creating elections");
    }

    try {
      for (const voterObject of voters) {
        const allowaccount = contract.action("allowaccount", {
          account_to_allow: voterObject.username,
        });
        const responseAdd = await session.transact({
          action: allowaccount,
        });
        console.log("allowaccount:", responseAdd);
      }
    } catch (error) {
      console.error("Error allowaccount:", error);
      setStatus("Error allowaccount");
    }
  };

  // Function to simulate voting
  const castVote = async () => {
    setElectionsCreated(true);
    if (!electionsCreated) {
      setStatus("Elections are not created yet.");
      return;
    }
    console.log("voter", voter);
    //print voters username list
    for (const voterObject of voters) {
      console.log("voterObject", voterObject.username);
    }
    //print if the first voter is in the list equal to the input
    console.log("voterObject", voters[0].username);
    console.log("voterObject", voters[0].username.equals(voter));
    const voterObject = voters.find((v) => v.username.equals(voter));
    //check if the elexction id is in the list
    const election = elections.find((e) => e.id === parseInt(electionId));

    if (!election) {
      setStatus("Invalid election ID.");
      return;
    }
    if (!voterObject) {
      setStatus("Invalid voter.");
      return;
    }
    console.log("election", election.id);
    console.log("voterObject", voterObject.username);
    try {
      const voterSession = await initializeVoterSession(voterObject);
      const addvoter = contract.action("addvoter", {
        username: voterObject.username,
        election_id: election.id,
      });
      const responseAdd = await voterSession.transact({ action: addvoter });
      console.log("Voter added:", responseAdd);
    } catch (error) {
      console.error("Error add voter:", error);
      setStatus("Error add voter");
      return;
    }

    try {
      const voterSession = await initializeVoterSession(voterObject);
      const castvote = contract.action("castvote", {
        voter: Name.from(voterObject.username),
        election_id: parseInt(electionId),
        candidate: Name.from(candidate),
      });

      const response = await voterSession.transact({ action: castvote });
      console.log("Vote cast:", response);
      setStatus("Vote cast successfully.");
    } catch (error) {
      console.error("Error casting vote:", error);
      setStatus("Error casting vote");
    }
  };

  return (
    <div className="d-flex flex-column">
      <button onClick={createElections}>Create Elections</button>
      <input
        type="text"
        placeholder="Voter"
        value={voter}
        onChange={(e) => setVoter(e.target.value)}
      />
      <input
        type="text"
        placeholder="Candidate"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Election ID"
        value={electionId}
        onChange={(e) => setElectionId(e.target.value)}
      />
      <button onClick={castVote}>Cast Vote</button>
      <p>{status}</p>
    </div>
  );
};

export default ElectionTester;
