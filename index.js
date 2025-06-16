const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // POST 요청 body(JSON) 파싱을 위해 필요

// 공통 API 호출 함수
const fetchWordData = async (word) => {
  const apiKey = 'F1227BEB7A643149831D689B8E892276';
  const apiUrl = `https://opendict.korean.go.kr/api/search?key=${apiKey}&q=${encodeURIComponent(word)}&type=json`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Accept: 'application/json' // 👉 응답을 반드시 JSON으로 받도록 명시
      }
    });

    // JSON 파싱 오류 방지
    const parsed = typeof response.data === 'string'
      ? JSON.parse(response.data)
      : response.data;

    return parsed;
  } catch (err) {
    console.error('fetchWordData 에러:', err.message);
    throw new Error('우리말샘 API 호출 또는 JSON 파싱 실패');
  }
};

// GET 요청 처리 (코디니 JSON 모드용)
app.get('/proxy/word', async (req, res) => {
  const { word } = req.query;
  if (!word) return res.status(400).json({ error: 'word query is required' });

  try {
    const data = await fetchWordData(word);
    res.json({ src: data }); // 코디니 JSON 모드 호환 구조
  } catch (error) {
    console.error('GET 에러:', error.message);
    res.status(500).json({ error: 'API 호출 실패 (GET)' });
  }
});

// POST 요청 처리 (직접 테스트용, 코디니에서는 사용 안 함)
app.post('/proxy/word', async (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ error: 'word is required in body' });

  try {
    const data = await fetchWordData(word);
    res.json({ src: data });
  } catch (error) {
    console.error('POST 에러:', error.message);
    res.status(500).json({ error: 'API 호출 실패 (POST)' });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`프록시 서버 실행 중: http://localhost:${PORT}`);
});
