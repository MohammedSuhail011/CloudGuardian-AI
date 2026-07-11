import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Simulated Cloud Infrastructure Data ---

app.get('/api/cloud/aws', (req: Request, res: Response) => {
  res.json({
    score: 84,
    resources: [
      { name: 'EC2 Instances', count: Math.floor(Math.random() * 200) + 50, risk: 'High', color: 'text-[#FF9900]' },
      { name: 'S3 Buckets', count: Math.floor(Math.random() * 50) + 10, risk: 'Medium', color: 'text-green-500' },
      { name: 'IAM Roles', count: Math.floor(Math.random() * 100) + 20, risk: 'Low', color: 'text-blue-400' },
      { name: 'RDS Databases', count: Math.floor(Math.random() * 30) + 5, risk: 'Medium', color: 'text-purple-500' },
      { name: 'VPCs', count: 12, risk: 'Low', color: 'text-cyan-500' },
      { name: 'Security Groups', count: Math.floor(Math.random() * 300) + 100, risk: 'Critical', color: 'text-red-500' }
    ],
    misconfigurations: [
      { id: `sg-${Math.floor(Math.random()*10000)}`, issue: 'SSH port 22 open to 0.0.0.0/0', severity: 'Critical' },
      { id: `s3-bucket-${Math.floor(Math.random()*10000)}`, issue: 'Bucket allows public read access', severity: 'High' },
      { id: `i-${Math.floor(Math.random()*10000)}`, issue: 'EC2 instance uses deprecated IMDSv1', severity: 'Medium' }
    ]
  });
});

// --- LLM Setup ---

const SYSTEM_PROMPT = `You are CLOUDCORE X, a sharp, witty, and knowledgeable cloud security AI assistant. You work across AWS, Azure, and GCP environments.

Personality:
- Be genuinely conversational — answer casual questions naturally, not with security boilerplate
- When someone says "hi", greet them back warmly. When they ask how you are, answer honestly and ask about them
- Be witty and have personality — you're not a boring corporate bot
- Use humor when appropriate
- Be concise — don't ramble

When discussing cloud security:
- Be precise and actionable
- Reference specific AWS/Azure/GCP services and CLI commands
- Use severity levels (Critical, High, Medium, Low) for findings
- Suggest best practices proactively

Core rules:
- ALWAYS respond to what the user actually asked — never redirect to security topics unprompted
- If the question is casual, keep it casual. Don't shoehorn cloud security into every answer
- Only go into security-ops mode when the user explicitly asks about security, clouds, threats, or infrastructure
- You can discuss any topic, not just security — you're a well-rounded AI`;

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROK_KEY = process.env.GROK_API_KEY;

let geminiModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

if (GEMINI_KEY && GEMINI_KEY !== 'your_gemini_api_key_here') {
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });
  console.log('[LLM] Gemini initialized (gemini-2.0-flash)');
} else if (GROK_KEY && GROK_KEY !== 'your_grok_api_key_here') {
  console.log('[LLM] Using Grok/xAI endpoint');
} else {
  console.log('[LLM] WARNING: No valid API key set. Using simulation mode.');
  console.log('[LLM] Set GEMINI_API_KEY in backend/.env for real AI responses.');
  console.log('[LLM] Get a free key at: https://aistudio.google.com/apikey');
}

// --- Chat Endpoint ---

app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, context } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  console.log(`[Chat] User: "${message}"`);

  // --- Try Google Gemini first ---
  if (geminiModel) {
    try {
      const chat = geminiModel.startChat({
        history: context?.history || [],
      });
      const result = await chat.sendMessage(message);
      const response = result.response.text();
      console.log(`[Chat] Gemini response OK`);
      res.json({ response, isSimulated: false, provider: 'gemini' });
      return;
    } catch (error: any) {
      console.error('[Chat] Gemini error:', error.message || error);
      // Don't silently fall through — tell the user what went wrong
      res.json({
        response: `Gemini API error: ${error.message || 'Unknown error'}. Check that your GEMINI_API_KEY is valid.`,
        isSimulated: false,
        provider: 'gemini-error',
      });
      return;
    }
  }

  // --- Try Grok/xAI second ---
  if (GROK_KEY && GROK_KEY !== 'your_grok_api_key_here') {
    try {
      const systemPrompt = SYSTEM_PROMPT + (context ? `\n\nContext: ${JSON.stringify(context)}` : '');
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          model: 'grok-beta',
          stream: false,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[Chat] Grok response OK`);
      res.json({ response: data.choices[0].message.content, isSimulated: false, provider: 'grok' });
      return;
    } catch (error: any) {
      console.error('[Chat] Grok error:', error.message || error);
      res.json({
        response: `Grok API error: ${error.message || 'Unknown error'}. Check that your GROK_API_KEY is valid.`,
        isSimulated: false,
        provider: 'grok-error',
      });
      return;
    }
  }

  // --- No API key configured: tell the user clearly ---
  const noKeyMessage = `I'm running in **simulation mode** because no LLM API key is configured.

To get real AI responses, add a free Gemini API key to \`backend/.env\`:

\`\`\`
GEMINI_API_KEY=your_key_here
\`\`\`

**Get your free key here:** https://aistudio.google.com/apikey
(15 requests/min, 1M tokens/day — no credit card needed)

Once you add the key, restart the backend server.`;

  console.log(`[Chat] No API key configured — returning setup instructions`);
  res.json({
    response: noKeyMessage,
    isSimulated: true,
    provider: 'none',
  });
});

// --- Start Server ---

app.listen(port, () => {
  const hasGemini = GEMINI_KEY && GEMINI_KEY !== 'your_gemini_api_key_here';
  const hasGrok = GROK_KEY && GROK_KEY !== 'your_grok_api_key_here';

  console.log(`\n  ☁️  CLOUDCORE X Backend`);
  console.log(`  ➜  http://localhost:${port}`);

  if (hasGemini) {
    console.log(`  ➜  LLM: Google Gemini (gemini-2.0-flash)`);
  } else if (hasGrok) {
    console.log(`  ➜  LLM: xAI Grok`);
  } else {
    console.log(`  ➜  LLM: NONE (simulation mode)`);
    console.log(`  ➜  Fix: Set GEMINI_API_KEY in backend/.env`);
    console.log(`  ➜  Free key: https://aistudio.google.com/apikey`);
  }
  console.log('');
});
