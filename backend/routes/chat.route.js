import express from "express";
import axios from "axios";

const router = express.Router();

const baseURL = "https://api.novita.ai/v3/openai/chat/completions";
const apiKey =
  process.env.NOVITA_API_KEY ||
  "sk_1mayD6iD7EXV8t2VLMQgKbEYrcNJ4pb4LCivHklPUoc"; // ✅ Prefer environment variable
const model = "deepseek/deepseek-v3-turbo";

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages array." });
  }

  try {
    const response = await axios.post(
      baseURL,
      {
        model,
        messages,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message;
    res.json(reply);
  } catch (error) {
    console.error(
      "❌ Error fetching chatbot response:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to get chatbot response.",
      detail: error.response?.data || error.message,
    });
  }
});

export default router; // ✅ This fixes the default export issue
