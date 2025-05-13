export function checkApiToken(req, res, next) {
  const clientToken = req.headers["x-api-key"];

  if (!clientToken) {
    return res.status(401).json({ error: "API key missing" });
  }

  if (clientToken !== process.env.API_TOKEN) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}
