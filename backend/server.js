const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_KEY || "AIzaSyD7kYHVIw-QawHF60S-1zETzfIcTAoYEnk";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const VT_KEY = process.env.VIRUSTOTAL_KEY;

app.get('/api/check-ip/:ip', async (req, res) => {
    const ip = req.params.ip;
    try {
        const vtRes = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
            headers: { 'x-apikey': VT_KEY }
        }).catch(() => null);

        const vtData = vtRes ? vtRes.data.data : null;
        let aiAnalysis = "";

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `أنت خبير أمن سيبراني في نظام 3Titan. حلل IP: ${ip}. البيانات: ${JSON.stringify(vtData?.attributes?.last_analysis_stats)}. اكتب تقريراً بالعربية احترافياً مع توصيات SOAR.`;
            const result = await model.generateContent(prompt);
            aiAnalysis = result.response.text();
        } catch (e) {
            aiAnalysis = "⚠️ محرك الذكاء الاصطناعي قيد التحديث أو المفتاح غير صالح.";
        }

        res.json({ vt: vtData, ai: aiAnalysis });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`3Titan Backend Active on ${PORT}`));