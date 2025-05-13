import { auth } from "../config/firebase.js";

export async function authenticateFirebase(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or invalid" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; // Attach user data to request
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Invalid or expired Firebase ID token" });
  }
}
