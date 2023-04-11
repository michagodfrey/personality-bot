import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
      message: "Go to https://michagodfrey.github.io/personality-bot",
    });
});

app.post('/', async (req, res) => {
    try {
        const personality = req.body.personality;
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Answer the prompt as if you are a ${personality}. Prompt: ${prompt}`,
          temperature: 0.8, // 0 - 1, higher = more random, lower = more repetative
          max_tokens: 1000, // 1 token = 4 chars approx. Max tokens = 2048
          top_p: 1, // 0 - 1 something about controling diversity via nucleus sampling ???
          frequency_penalty: 0.5, // 0 - 2, higher values make the bot less repetative 
          presence_penalty: 0, // 0 -2 Increases the likelihood to talk about new topics
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
});

app.listen(5000, () =>
  console.log("Server is listening on https://personality-bot.onrender.com/")
);