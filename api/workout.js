// /api/workout.js

export default async function handler(req, res) {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_DB_ID = process.env.NOTION_DB_ID;

  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Ошибка запроса к Notion:", error);
    return res.status(500).json({ error: "Ошибка при получении данных из Notion" });
  }

  const data = await response.json();

  const workouts = data.results.map(page => ({
    name: page.properties["Exercise"]?.title?.[0]?.plain_text || "Без названия",
    muscles: page.properties["Muscles"]?.multi_select?.map(m => m.name) || [],
    date: page.properties["Date"]?.date?.start || "",
    sets: page.properties["Sets"]?.number || "",
    reps: page.properties["Reps"]?.number || "",
    weight: page.properties["Weight"]?.number
         ?? page.properties["Weight"]?.rich_text?.[0]?.plain_text
         ?? ""
  }));

  res.status(200).json(workouts);
}
