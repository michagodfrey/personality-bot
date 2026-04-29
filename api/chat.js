import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { personality, prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
      max_tokens: 2048,
      temperature: 1.0,
      top_p: 1.0,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
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
}
