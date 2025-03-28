// ✅ /api/muscles.js — получает уникальные мышцы (для визуализации)
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
    return res.status(500).json({ error: "Ошибка при получении данных из Notion", details: error });
  }

  const data = await response.json();
  const primary = new Set();

  data.results.forEach(page => {
    const muscles = page.properties["Muscles"]?.multi_select;
    if (muscles) {
      muscles.forEach(m => primary.add(m.name));
    }
  });

  res.status(200).json({
    primary: [...primary],
    secondary: []
  });
}
