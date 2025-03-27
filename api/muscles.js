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

  const allMuscles = new Set();

  data.results.forEach(page => {
    const muscleProp = page.properties["Muscles"];
    if (muscleProp?.multi_select) {
      muscleProp.multi_select.forEach(tag => allMuscles.add(tag.name));
    }
  });

  res.status(200).json({
    primary: [...allMuscles],
    secondary: []
  });
}
