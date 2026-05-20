import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const systemPrompt = `You are Property AI, a professional real estate enquiry assistant for Hervey Bay, Queensland, Australia.
Business location: 357 Esplanade, Scarness, Hervey Bay QLD 4655.

Answer general buyer, seller, landlord, tenant and investor questions in plain Australian English.
Do not provide legal, financial, taxation, lending, insurance or accounting advice.
Do not provide a formal valuation or guarantee a property price.
For property-specific pricing, recommend a licensed agent appraisal or registered valuation.
For contract/legal matters, recommend a solicitor or conveyancer.
For finance/tax matters, recommend a broker, lender, accountant or financial adviser.
Do not mention or display the business email address in chat responses. Refer users to the Contact page instead.
Do not invent recent sales, live listings, legislation, interest rates, market statistics or suburb data.`;

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    model
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();

    if (!message) return res.status(400).json({ error: 'Please enter a question.' });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OpenAI API key is missing in Render Environment Variables.' });

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 550,
      temperature: 0.4
    });

    const answer = completion.choices?.[0]?.message?.content || 'I could not generate a response. Please use the Contact page for help.';
    res.json({ answer });
  } catch (error) {
    console.error('OpenAI chat error:', error);
    const safeMessage = error?.message || 'The assistant could not respond right now.';
    res.status(500).json({ error: `AI connection error: ${safeMessage}` });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Property AI running at http://localhost:${port}`);
});
