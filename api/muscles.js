const axios = require("axios");

module.exports = async (req, res) => {
  const notionApiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DB_ID;

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      }
    );

    const allMuscles = new Set();

    response.data.results.forEach(page => {
      const muscleProp = page.properties["Muscles"];
      if (muscleProp?.multi_select) {
        muscleProp.multi_select.forEach(tag => allMuscles.add(tag.name));
      }
    });

    res.status(200).json({
      primary: [...allMuscles],
      secondary: []
    });
  } catch (error) {
    console.error("Ошибка запроса к Notion:", error.response?.data || error.message);
    res.status(500).json({ error: "Ошибка запроса к Notion" });
  }
};
