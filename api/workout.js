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

  const workouts = data.results.map(page => {
    const properties = page.properties;

    // 🧠 Автоопределение ключа title (заголовка)
    const titleKey = Object.keys(properties).find(
      key => properties[key].type === "title"
    );

    const titleArray = properties[titleKey]?.title || [];
    const title = titleArray.map(t => t.plain_text || t.text?.content || "").join("");

    console.log("🔥 RAW PROPERTIES:", JSON.stringify(properties, null, 2));
    console.log("🏷 TITLE EXTRACTED:", title);

    return {
      name: title || "Без названия",
      muscles: properties["Muscles"]?.multi_select?.map(m => m.name) || [],
      date: properties["Date"]?.date?.start || "",
      sets: properties["Sets"]?.number || "",
      reps: properties["Reps"]?.number || "",
      weight: properties["Weight"]?.rich_text?.[0]?.plain_text || ""
    };
  });

  console.log("💪 FINAL WORKOUTS:", JSON.stringify(workouts, null, 2));
  res.status(200).json(workouts);
}
