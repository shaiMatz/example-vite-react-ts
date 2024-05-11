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
import { TimePointSec } from "@wharfkit/antelope"

interface ElectionTesterProps {
  session: any;
  contract: any;
}

interface Criteria {
  minage: number | null;
  maxage: number | null;
  city: string | null;
  state: string | null;
  country: string | null;
  userList: string[] | null;
}

interface Voter {
  username: Name;
  privatekey: PrivateKey;
  name: string;
  birthdate: string;
  city: string;
  state: string;
  country: string;
}

interface Election {
  title: string;
  start_time: number;
  end_time: number;
  candidates: string[];
  criteria: Criteria;
}

const addOneMonth = (date: string | number | Date) => {
  const newDate = new Date(date); // create a new date object to avoid mutating the original date
  newDate.setMonth(newDate.getMonth() + 1); // add one month
  return newDate.getTime(); // return the new date as a timestamp
};
const ElectionTester: React.FC<ElectionTesterProps> = ({
  session,
  contract,
}) => {
  const [status, setStatus] = useState("");
  const [electionsCreated, setElectionsCreated] = useState(false);
  const [voter, setVoter] = useState("");
  const [candidate, setCandidate] = useState("");
  const [electionId, setElectionId] = useState("");
  const startTime = Date.now();

  // Hardcoded data
  const elections = [
    {
      title: "Local Election", start_time: startTime,
      end_time: addOneMonth(startTime), candidates: ["candidate1", "candidate2"],
      criteria: { minage: 18, maxage: 60, city: "Mumbai", state: "Maharashtra", country: "India", userList: ["user1", "user2"] } as Criteria
    } as Election,
    {
      title: "National Election",
      start_time: startTime, end_time: addOneMonth(startTime), candidates: ["candidate3", "candidate4"]
      , criteria: { userList: ["user3", "user2"] } as Criteria
    } as Election
    ,
  ];

  const voters = [

    {
      username: Name.from("colorfulenth"),
      privatekey: PrivateKey.from("5HvEVJZdKswBCaP5NfUoBCeAqvgzS2TkEk4aPK7DS8v9xS2XjCq"),
      name: "colorfulenth",
      birthdate: "1999-01-01",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India"

    } as Voter,
    {
      username: Name.from("taltal123123"),
      privatekey: PrivateKey.from("PVT_K1_2g5cK7oDqCswccy3LGHTghrpbknakoyBKBhVgwZuZeMCdSyP5U"),
      name: "taltal123123",
      birthdate: "1999-01-01",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India"

    } as Voter,
    {
      username: Name.from("taltal123125"),
      privatekey: PrivateKey.from("PVT_K1_mWJ1t8DUrKgniUHGb5wWXoiQ5h6gLYcvFoRF4h8NZ6kZnKz3e"),
      name: "taltal123125",
      birthdate: "1959-01-01",
      city: "Mumbaia",
      state: "Maharashtra",
      country: "India"
    } as Voter,

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
    setStatus("Creating elections...");

    try {
      for (const election of elections) {
        const startTime = TimePointSec.fromMilliseconds(election.start_time);
        const endTime = TimePointSec.fromMilliseconds(election.end_time);


        await session.transact({
          action: contract.action("createlect", {
            title: election.title,
            start_time: startTime,
            end_time: endTime,
            candidates: election.candidates,
          }),
        });
      }
      setStatus("Elections created successfully.");
      setElectionsCreated(true);
    } catch (error) {
      console.error("Error creating elections:", error);
      setStatus(`Error creating elections: ${error}`);
    }

  };

  // Function to register voter
  const registerVoter = async () => {
    const voterObject = voters.find((v) => v.username.equals(voter));
    if (!voterObject) {
      setStatus("Voter not found.");
      return;
    }
    const voterSession = await initializeVoterSession(voterObject);
    try {
      // await voterSession.transact({
      //   action: contract.action("regvoter", {
      //     voter: voterObject.username,
      //   }),
      // });
      setStatus("Voter registered successfully.");
      mintNftToUser(voterObject);
      setStatus("Voter registered and NFT minted successfully.")
    } catch (error) {
      console.error("Error registering voter:", error);
      setStatus("Error registering voter.");
    }
  };


  const mintNftToUser = async (voterObject: any) => {
    const voterSession = await initializeVoterSession(voterObject);

    try {
      console.log("Minting NFT");
      const allElections = await contract.table("electionst").all();
      if (!allElections) {
        setStatus("No elections found.");
        return;
      }

      const now = Date.now();
      const openElections = allElections.filter((e: { end_time: string | number | Date; }) => new Date(e.end_time).getTime() > now);

      for (const election of openElections) {
        const birthdateTimestamp = new Date(voterObject.birthdate).getTime();
        const electionObject = elections.find(e => e.title === election.title);

        if (!electionObject || !electionObject.criteria) {
          console.log("No specific criteria or invalid election ID.");
          continue;
        }

        const { criteria } = electionObject;
        if (!isEligible(voterObject, criteria, birthdateTimestamp)) continue;

        const unhashedToken = `${voterObject.username}${election.id}`;
        const hashedToken = await hashToken(unhashedToken);
        console.log("Token:", hashedToken);
        try {
          await session.transact({
            action: contract.action("mintnft", {
              owner: voterObject.username,
              election_id: election.id,
              hashedtoken: hashedToken
            }),
          });
          console.log(`NFT minted for election: ${election.id}`);
        } catch (error: any) {
          if (error.message.includes("NFT already minted for this election")) {
            console.log(`NFT already minted for election: ${election.id}, continuing...`);
            continue;
          } else {
            console.error("Error during NFT minting:", error);
            continue; // Optionally, decide if other errors should also not break the loop
          }
        }
      }

      setStatus("NFT minting completed successfully.");
    } catch (error) {
      console.error("Error processing elections:", error);
      setStatus("Error processing elections.");
    }
  };

  async function hashToken(token: string | undefined) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const isEligible = (voter: { city: any; state: any; country: any; username: any; }, criteria: Criteria, birthdateTimestamp: number) => {
    const currentDate = new Date();

    if (criteria.maxage && criteria.minage && criteria.minage > criteria.maxage) {
    const minAgeTimestamp = new Date(currentDate.getFullYear() - criteria.minage, currentDate.getMonth(), currentDate.getDate()).getTime();
    const maxAgeTimestamp = new Date(currentDate.getFullYear() - criteria.maxage, currentDate.getMonth(), currentDate.getDate()).getTime();
    
    if ((criteria.minage && birthdateTimestamp > minAgeTimestamp) ||
      (criteria.maxage && birthdateTimestamp < maxAgeTimestamp) ||
      (criteria.city && voter.city !== criteria.city) ||
      (criteria.state && voter.state !== criteria.state) ||
      (criteria.country && voter.country !== criteria.country) ||
      (criteria.userList && !criteria.userList.includes(voter.username))) {
      return false;
    }
  }
    return true;
  };
  async function hashToHex(input: string): Promise<string> {
    // Encode the input string as UTF-8
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // Hash the data using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    // Return only the last 16 characters (64 bits)
    return hashHex.slice(-16);
  }

  async function stringToUint64_t(hexValue: string): Promise<BigInt> {
    return BigInt(`0x${hexValue}`);
  }

  const verifyAndFetchTokenId = async (voterSession: Session, voter: Voter, election: any ) => {
    try {
      console.log("Verifying voter:", voter.username);
      //hash the key as uint64_t
      const unhashedToken = `${voter.username}${election.id}`;
      const hexToken = await hashToHex(unhashedToken); // Hash the token
      const hashedToken = await stringToUint64_t(hexToken); // Convert to BigInt

      console.log("Token:", hashedToken);

      const response = await voterSession.transact({
        
        action: contract.action("verifyvoters", {
          key: hashedToken,
          voter: voter.username,
          election_id: election.id,
        }),
      })as any;

      console.log("Response:", response);
      setStatus("Voter verified successfully.");
      return hashedToken
    } catch (error) {
      console.error("Error verifying voter or fetching token:", error);
      setStatus("Error verifying voter.");
      throw error;
    }
  };
  // Function to cast a vote
  const castVote = async () => {
    if (!electionsCreated) {
      setStatus("Elections are not created yet.");
      return;
    }
    const voterObject = voters.find((v) => v.username.equals(voter));
    const allElections = await contract.table("electionst").all();
    if (!allElections) {
      setStatus("No elections found.");
      return;
    }
    console.log("All Elections:", allElections);
    //find the election id
    const election = allElections.find((e: { id: any; }) => e.id == electionId);

    console.log("Election:", election);

    if (!election) {
      setStatus("Invalid election ID.");
      return;
    }
    if (!voterObject) {
      setStatus("Invalid voter.");
      return;
    }
    const voterSession = await initializeVoterSession(voterObject);

    try {
      const tokenId = await verifyAndFetchTokenId(voterSession, voterObject, election);
      await session.transact({
        action: contract.action("vote", {
          token_id: tokenId, 
          election_id: election.id,
          candidate: candidate,
        }),
      });
      setStatus("Vote cast successfully.");
    } catch (error) {
      console.error("Error casting vote:", error);
      setStatus("Error casting vote.");
    }
    
   
  };

  const getRAM = async () => {
    try {
      // use buyrambytes to buy RAM
      await session.transact({
        actions: [
          {
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
              receiver: "votechain111",
              bytes: 108192,
            },
          },
        ],
      });
      console.log("RAM bought successfully");

    } catch (error) {
      console.error("Error getting RAM:", error);
    }
  };


  return (
    <div className="d-flex flex-column">
      <button onClick={createElections}>Create Elections</button>
      <button onClick={registerVoter}>Register Voter</button>
      <button onClick={getRAM} >Get RAM</button>
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
