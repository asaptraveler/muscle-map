import axios from 'axios';

export default async function handler(req, res) {
  try {
    const notionRes = await axios.post(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      }
    );

    const allMuscles = new Set();
    notionRes.data.results.forEach(page => {
      const prop = page.properties["Muscles"];
      if (prop?.multi_select) {
        prop.multi_select.forEach(tag => allMuscles.add(tag.name));
      }
    });

    res.status(200).json({
      primary: [...allMuscles],
      secondary: []
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Ошибка при подключении к Notion");
  }
}
