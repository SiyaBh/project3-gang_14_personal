const express = require('express');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
    const { text, target } = req.body;

    if (!text || !target) {
        return res.status(400).json({ error: "Missing text or target language" });
    }

    try {
        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

        const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            q: text,
            target
            })
        }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Google Translate API error:", data);
            return res.status(500).json({ error: "Translation API error", details: data.error });
        }

        const translatedText = data.data.translations[0].translatedText;

        res.json({ translatedText });

    } catch (err) {
        console.error("Translation error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;