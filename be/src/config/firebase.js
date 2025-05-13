import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  throw new Error(
    "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
  );
}

const resolvedPath = path.resolve(serviceAccountPath);

// Read and parse JSON file
const fileContent = fs.readFileSync(resolvedPath, "utf-8");
const serviceAccount = JSON.parse(fileContent);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
