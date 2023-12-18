// import React, { useState } from "react";
// import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";
// import { Session } from "@wharfkit/session";

// const SignUpForm = () => {
//   const [username, setUsername] = useState("");
//   const [privateKey, setPrivateKey] = useState(""); // For demonstration purposes only, NEVER store private keys like this in production

//   const handleSignUp = async () => {
//     try {
//       // Create a new wallet plugin with the provided private key
//       const walletPlugin = new WalletPluginPrivateKey(privateKey);

//       // Initialize a session with the wallet plugin
//       const session = new Session({
//         chain: {
//           // Define your EOS chain details here
//           id: "YourChainID",
//           url: "YourChainURL",
//         },
//         walletPlugin,
//       });

//       // Create a new EOSIO account using Wharf
//       const result = await session.({
//         accountName: username, // Use the username collected from the form
//       });

//       // Handle successful account creation
//       console.log("Account created:", result);
//     } catch (error) {
//       // Handle account creation error
//       console.error("Error creating account:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSignUp}>
//         <label>
//           Username:
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Private Key:
//           <input
//             type="text"
//             value={privateKey}
//             onChange={(e) => setPrivateKey(e.target.value)}
//           />
//         </label>
//         <br />
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default SignUpForm;
