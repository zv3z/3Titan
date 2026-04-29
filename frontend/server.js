const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// تجربة السيرفر
app.get('/', (req, res) => {
    res.send('3Titan Backend is Running! 🚀');
});

// مسار فحص الـ IP عبر VirusTotal (كمثال)
app.get('/api/check-ip/:ip', async (req, res) => {
    const ip = req.params.ip;
    try {
        const response = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
            headers: { 'x-apikey': process.env.VIRUSTOTAL_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from VirusTotal' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});