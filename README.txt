PROPERTY AI — OPENAI READY WEBSITE

This version looks less like a demo and includes a real OpenAI-ready backend.

Configured:
- Business location: 357 Esplanade, Scarness, Hervey Bay QLD 4655
- Contact form routes email to: ashtonrevell@gmail.com
- The chat side panel does NOT display your email address.
- The chat calls /api/chat, which is powered by OpenAI from server.js.

How to run locally:
1. Install Node.js from nodejs.org
2. Unzip this folder.
3. Open a terminal inside the folder.
4. Run: npm install
5. Rename .env.example to .env
6. Put your OpenAI API key in .env
7. Run: npm start
8. Open: http://localhost:3000

Important:
- Do NOT put your OpenAI API key in script.js or any browser file.
- Keep the key in .env only.
- For live hosting, deploy this as a Node app on Render, Railway, Vercel, Fly.io or similar.
- For Facebook Messenger, connect Meta webhooks to the same style of /api/chat backend.
- Have the legal and privacy pages reviewed before launching publicly.
