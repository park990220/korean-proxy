const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/proxy/word', async (req, res) => {
  const { word } = req.query;
  if (!word) return res.status(400).json({ error: 'word query is required' });

  try {
    const apiKey = 'F1227BEB7A643149831D689B8E892276'; //
    const apiUrl = `https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${encodeURIComponent(word)}&type=json`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API 호출 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`프록시 서버 실행중: http://localhost:${PORT}`);
});
