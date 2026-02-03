import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// spam detection API
app.post("/analyze-email", (req, res) => {
  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const spamKeywords = [
    "free", "win", "winner", "cash", "offer",
    "urgent", "click", "prize", "money",
    "limited time", "act now", "verify",
    "suspended", "congratulations"
  ];

  const text = (subject + " " + body).toLowerCase();
  const links = (body.match(/http/g) || []).length;

  let score = 0;
  spamKeywords.forEach(word => {
    if (text.includes(word)) score++;
  });

  if (links >= 2) score += 2;
  if (subject === subject.toUpperCase()) score += 2;

  const isSpam = score >= 2;

  res.json({
    isSpam,
    score,
    message: isSpam ? "Spam detected" : "Email is safe"
  });
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
