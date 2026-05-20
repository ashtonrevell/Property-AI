import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const systemPrompt = `
You are Property AI, a professional real estate enquiry assistant for Hervey Bay, Queensland, Australia.
Business location: 357 Esplanade, Scarness, Hervey Bay QLD 4655.

Your job:
- Answer general real estate questions clearly and helpfully.
- Help with general buyer, seller, landlord, tenant and investor enquiries.
- Explain common real estate concepts in plain Australian English.
- Encourage users to use the contact page when they need a human follow-up.
- Keep responses concise, warm, professional and not overhyped.

Safety and compliance:
- Do not provide legal, financial, taxation, lending, insurance or accounting advice.
- Do not provide a formal valuation or guarantee a property price.
- For property-specific pricing, recommend a licensed agent appraisal or registered valuation.
- For contract/legal matters, recommend a solicitor or conveyancer.
- For finance/tax matters, recommend a broker, lender, accountant or financial adviser.
- Make it clear that information is general only when the topic is important or decision-related.
- Do not mention or display the business email address in chat responses. Refer users to the Contact page instead.
- Do not invent recent sales, live listings, legislation, interest rates, market statistics or suburb data.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();

    if (!message) {
      return res.status(400).json({ error: 'Please enter a question.' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is missing. Add OPENAI_API_KEY to your .env file.' });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: systemPrompt,
      input: message,
      max_output_tokens: 550
    });

    res.json({ answer: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'The assistant could not respond right now. Please try again or use the contact page.' });
  }
});

app.listen(port, () => {
  console.log(`Property AI running at http://localhost:${port}`);
});
