const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

async function run() {
  console.log('Testing Gemini API Synthesis with gemini-3.5-flash-lite...');
  const t0 = Date.now();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
SOURCE DISPATCH TO SYNTHESIZE:
Category: Artificial Intelligence
Source Publication: Reuters Tech
Original Title: Nvidia unveils Blackwell Ultra GPU architecture with 288GB HBM3e memory
Raw Extracted Text:
Nvidia announced its next generation Blackwell Ultra AI accelerator series featuring enhanced high bandwidth memory configurations designed for trillion-parameter foundation models. Major hyperscalers including Microsoft Azure, Google Cloud, and AWS are expanding cluster procurements as capital expenditure forecasts reach record highs for the fiscal year.

Perform full journalistic synthesis and return strictly valid JSON with title, seoTitle, slug, focusKeyword, metaDescription, tldr, keyTakeaways, content, faqs, trendStat, topicTags, pexelsSearchQuery.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    console.log(`Response status: SUCCESS in ${Date.now() - t0}ms!`);
    const json = JSON.parse(response.text);
    console.log('Title:', json.title);
    console.log('Focus Keyword:', json.focusKeyword);
    console.log('TL;DR:', json.tldr);
    console.log('Takeaways count:', json.keyTakeaways?.length);
    console.log('Content preview:', (json.content || '').slice(0, 150) + '...');
  } catch (err) {
    console.error(`Synthesis test failed in ${Date.now() - t0}ms:`, err);
  }
}

run();
