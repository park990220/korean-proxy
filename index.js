const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// ✅ 우리말샘 API 호출 함수 (JSON 전용, 필수 파라미터 포함)
const fetchWordData = async (word) => {
  const apiKey = 'F1227BEB7A643149831D689B8E892276';
  const apiUrl = `https://opendict.korean.go.kr/api/search.do?key=${apiKey}&q=${encodeURIComponent(word)}&req_type=json&start=1&num=10`;

  console.log("👉 최종 요청 URL:", apiUrl); // 디버깅용 로그

  try {
    const response = await axios.get(apiUrl);
    return response.data; // JSON 형태로 응답
  } catch (err) {
    console.error('fetchWordData 에러:', err.message);
    throw new Error('우리말샘 API 호출 실패');
  }
};

// ✅ 코디니 JSON 모드용 GET 요청
app.get('/proxy/word', async (req, res) => {
  const { word } = req.query;
  if (!word) return res.status(400).json({ error: 'word query is required' });

  try {
    const data = await fetchWordData(word);
    res.json({ src: data }); // 코디니가 요구하는 JSON 구조
  } catch (error) {
    console.error('GET 에러:', error.message);
    res.status(500).json({ error: 'API 호출 실패 (GET)' });
  }
});

// POST 요청 (테스트용)
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
