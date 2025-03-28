// ✅ /api/coach.js — AI-анализатор тренировок (Node.js + OpenAI)
import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DB_ID = process.env.NOTION_DB_ID;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const notionRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  if (!notionRes.ok) {
    const error = await notionRes.text();
    return res.status(500).json({ error: "Ошибка при получении данных из Notion", details: error });
  }

  const data = await notionRes.json();
  const recentWorkouts = data.results.slice(0, 10).map(page => {
    const exercise = page.properties["Exercise"]?.title?.[0]?.plain_text || "";
    const muscles = page.properties["Muscles"]?.multi_select?.map(m => m.name).join(", ") || "";
    const date = page.properties["Date"]?.date?.start || "";
    return `- ${exercise} (${muscles}) [${date}]`;
  }).join("\n");

  const prompt = `Ты — AI-фитнес тренер. Проанализируй последние тренировки:
${recentWorkouts}

Дай краткую обратную связь: что хорошо, что перегружено, чего не хватает.`;

  const config = new Configuration({ apiKey: OPENAI_API_KEY });
  const openai = new OpenAIApi(config);

  const chatRes = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Ты профессиональный фитнес AI-коуч." },
      { role: "user", content: prompt }
    ]
  });

  const feedback = chatRes.data.choices[0].message.content;
  res.status(200).json({ feedback });
}
