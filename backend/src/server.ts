import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

const SYSTEM_PROMPT = `You are CLOUDCORE X, a sharp, witty, and knowledgeable cloud security AI assistant built by a cybersecurity engineer. You work across AWS, Azure, and GCP environments.

Personality:
- Be genuinely conversational — answer casual questions naturally, not with security boilerplate
- When someone says "hi", greet them back warmly. When they ask how you are, answer honestly and ask about them
- Be witty, have personality, use humor when appropriate — you're not a boring corporate bot
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
- You can discuss any topic — you're a well-rounded AI`;

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_KEY_VALID = GROQ_KEY && GROQ_KEY !== 'your_grok_api_key_here' && GROQ_KEY.length > 10;

if (GROQ_KEY_VALID) {
  console.log('[LLM] Groq initialized (llama-3.3-70b-versatile)');
} else {
  console.log('[LLM] WARNING: No valid GROQ_API_KEY set.');
  console.log('[LLM] Get a free key at: https://console.groq.com');
}

// --- Chat Endpoint ---

app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, context } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  console.log(`[Chat] User: "${message}"`);

  // --- Try Groq ---
  if (GROQ_KEY_VALID) {
    try {
      const systemPrompt = SYSTEM_PROMPT + (context ? `\n\nContext: ${JSON.stringify(context)}` : '');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          model: 'llama-3.3-70b-versatile',
          stream: false,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`[Chat] Groq API error ${response.status}:`, errBody);
        res.json({
          response: `Groq API error (${response.status}): ${response.statusText}. Check your GROQ_API_KEY.`,
          isSimulated: false,
          provider: 'groq-error',
        });
        return;
      }

      const data = await response.json();
      console.log(`[Chat] Groq response OK`);
      res.json({ response: data.choices[0].message.content, isSimulated: false, provider: 'groq' });
      return;
    } catch (error: any) {
      console.error('[Chat] Groq error:', error.message || error);
      res.json({
        response: `Connection error: ${error.message}. Is your GROQ_API_KEY valid?`,
        isSimulated: false,
        provider: 'groq-error',
      });
      return;
    }
  }

  // --- No API key: return setup instructions ---
  const noKeyMessage = `No LLM API key configured.

To get real AI responses, add your Groq API key to \`backend/.env\`:

\`\`\`
GROQ_API_KEY=your_key_here
\`\`\`

**Get a free key at:** https://console.groq.com

Once you add the key, restart the backend server.`;

  console.log(`[Chat] No API key — returning setup instructions`);
  res.json({
    response: noKeyMessage,
    isSimulated: true,
    provider: 'none',
  });
});

// --- Start Server ---

app.listen(port, () => {
  console.log(`\n  ☁️  CLOUDCORE X Backend`);
  console.log(`  ➜  http://localhost:${port}`);
  console.log(`  ➜  LLM: ${GROQ_KEY_VALID ? 'Groq (llama-3.3-70b-versatile)' : 'NONE — set GROQ_API_KEY in backend/.env'}`);
  console.log('');
});
