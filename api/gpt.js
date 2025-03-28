// ✅ /api/gpt.js
export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Ты фитнес-ассистент. Анализируй тренировки, оценивай нагрузку по мышцам и давай краткие рекомендации."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("GPT error:", err);
    return res.status(500).json({ error: "Ошибка при обращении к OpenAI" });
  }
}
