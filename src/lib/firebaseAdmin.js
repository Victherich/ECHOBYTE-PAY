// // lib/firebaseAdmin.js  (server-side only, never import this in client components)
// import { initializeApp, getApps, cert } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";

// let configured = false;

// export function getAdminDb() {
//   if (!getApps().length) {
//     initializeApp({
//       credential: cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         // On Vercel/.env the key contains literal "\n" characters
//         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//       }),
//     });
//   }

//   const db = getFirestore();

//   // settings() can only be called once per instance
//   if (!configured) {
//     db.settings({ ignoreUndefinedProperties: true });
//     configured = true;
//   }

//   return db;
// }



// lib/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let configured = false;

function getPrivateKey() {
  let key = process.env.FIREBASE_PRIVATE_KEY || "";

  // Remove wrapping quotes if they were pasted in
  key = key.trim().replace(/^["']|["']$/g, "");

  // Convert literal "\n" into real line breaks
  key = key.replace(/\\n/g, "\n");

  return key;
}

export function getAdminDb() {
  if (!getApps().length) {
    const privateKey = getPrivateKey();

    // Quick sanity check, logs only whether the key looks right, never the key itself
    console.log("Private key check:", {
      hasBegin: privateKey.includes("-----BEGIN PRIVATE KEY-----"),
      hasEnd: privateKey.includes("-----END PRIVATE KEY-----"),
      lineCount: privateKey.split("\n").length,
    });

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }

  const db = getFirestore();

  if (!configured) {
    db.settings({ ignoreUndefinedProperties: true });
    configured = true;
  }

  return db;
}