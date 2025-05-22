import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ error: "Pergunta não enviada" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // ou "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: "Você é um especialista em direito tributário brasileiro. Responda de forma clara, objetiva e com base na legislação brasileira.",
        },
        {
          role: "user",
          content: pergunta,
        },
      ],
      temperature: 0.3,
    });

    const resposta = completion.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error("Erro ao acessar a OpenAI:", error.message);
    res.status(500).json({ error: "Erro na IA" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
