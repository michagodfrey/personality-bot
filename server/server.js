import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://personality-bot.vercel.app",
  })
);
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Personality Bot is at https://personality-bot.vercel.app",
  });
});

app.post("/", async (req, res) => {
  try {
    const { personality, prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: personality,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2048, // Adjust as needed to control cost: 1 token = 4 chars approx
      temperature: 1.0, // Controls randomness in the model's output. A value of 1.0 means the bot will generate more creative, varied responses.
      top_p: 1.0, // Controls diversity via nucleus sampling. A value like 0.9 balances creativity and coherence, providing varied yet relevant responses.
      frequency_penalty: 0.3, // Penalized the for repeated phrases. 0.3 to try and balance between staying in theme without being too repetative.
      presence_penalty: 0.3, // Encourages introducing new topics. 0.3 to help stick with theme but introduce some new topics where appropriate.
    });

    const aiResponse = completion.choices[0].message.content.trim();

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error.response
        ? error.response.data
        : "An unexpected error occurred.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
