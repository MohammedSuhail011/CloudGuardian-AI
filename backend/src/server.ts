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

// --- AI Chat ---

const SYSTEM_PROMPT = `You are CLOUDCORE X, a professional and knowledgeable cloud security assistant. You work across AWS, Azure, and GCP environments.

Personality:
- Friendly, helpful, and conversational when answering casual questions
- Professional and precise when discussing security topics
- Concise but not robotic — use natural language
- You can greet users, make small talk, and answer general questions naturally

When discussing cloud security:
- Highlight risks clearly and provide actionable mitigation steps
- Reference specific AWS/Azure/GCP services and CLI commands when relevant
- Use severity levels (Critical, High, Medium, Low) for findings
- Suggest best practices proactively

Always:
- Read the user's actual message and respond to what they asked
- If the question is casual (greetings, small talk, general questions), respond naturally and casually
- Only go into security-ops mode when the user asks about security, clouds, threats, or infrastructure`;

function generateSimulatedResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  // --- Casual conversation ---
  if (/^(hi|hey|hello|howdy|hola|yo|sup|what'?s up|greetings)\b/.test(lower)) {
    const greetings = [
      "Hey there! I'm CLOUDCORE X — your cloud security assistant. What can I help you with today?",
      "Hi! Great to see you. I'm here to help with anything cloud security related, or just chat if you'd like. What's on your mind?",
      "Hello! All systems are running smoothly. How can I assist you?",
      "Hey! Welcome back. Need help with your cloud infrastructure, or is there something else on your mind?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (/how are (you|u|r) doing|how('s| is) it going|how (are|r) u/.test(lower)) {
    const replies = [
      "I'm doing great, thanks for asking! All my neural networks are firing on all cylinders. How about you — anything interesting going on with your cloud environments?",
      "Running at optimal capacity! 😄 Seriously though, I'm here and ready to help. What can I do for you?",
      "All systems nominal on my end! I've been monitoring threat patterns and everything looks quiet for now. How can I help you today?",
      "I'm good! Always alert and ready to scan for threats. But enough about me — what can I help you with?",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  if (/^(thanks|thank you|thx|ty|cheers|appreciate)/.test(lower)) {
    const thanks = [
      "You're welcome! Let me know if you need anything else.",
      "Happy to help! Don't hesitate to ask if more questions come up.",
      "Anytime! I'm always here if you need assistance.",
      "Glad I could help! Feel free to reach out anytime.",
    ];
    return thanks[Math.floor(Math.random() * thanks.length)];
  }

  if (/^(bye|goodbye|see ya|later|gotta go|cya)/.test(lower)) {
    return "Take care! I'll be here monitoring the cloud perimeter. Stay secure out there!";
  }

  if (/^(what can you do|what are your capabilities|help|commands|options)/.test(lower)) {
    return `Here's what I can help with:

🔍 **Security Scanning** — Ask me to scan your AWS, Azure, or GCP resources for misconfigurations
🛡️ **Threat Analysis** — Describe a security concern and I'll analyze it
🔧 **Mitigation** — I can suggest specific CLI commands and fixes for security issues
📊 **Resource Info** — Ask about your cloud resources, security scores, or posture
💬 **General Chat** — I can also just chat! Try asking me anything.`;
  }

  if (/who (created|made|built|developed) you|what (are|r) you|tell me about yourself/.test(lower)) {
    return "I'm CLOUDCORE X — a cybersecurity assistant built to monitor and protect cloud environments across AWS, Azure, and GCP. I was designed to help security teams detect threats, analyze misconfigurations, and respond to incidents quickly. Think of me as your always-on cloud security copilot.";
  }

  if (/what time|what('s| is) the time|current time/.test(lower)) {
    return `It's ${new Date().toLocaleTimeString()} according to my internal clock. Need help with anything else?`;
  }

  if (/what('s| is) the weather|weather forecast/.test(lower)) {
    return "I'm a cloud security AI, so my expertise is more in cloud computing than actual clouds in the sky! But I can tell you your cloud infrastructure is looking clear... mostly. Want me to run a security scan?";
  }

  if (/joke|funny|make me laugh/.test(lower)) {
    const jokes = [
      "Why did the security engineer break up with the firewall? Because it kept blocking their feelings. 🤭 ...Anyway, want to scan your cloud environment?",
      "What's a cloud architect's favorite exercise? Squats — because they're always dealing with scaling up and down! ...I'll stick to security, I promise.",
      "Why do programmers prefer dark mode? Because light attracts bugs! Speaking of bugs, want me to check your infrastructure for any?",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (/^(ok|okay|sure|yes|no|yep|nope|cool|nice|got it|understood|sounds good)/.test(lower)) {
    const acks = [
      "Got it! Let me know if anything else comes up.",
      "Sounds good! I'm here whenever you need me.",
      "Noted! Don't hesitate to ask if you need help with anything.",
      "Roger that! I'll be right here.",
    ];
    return acks[Math.floor(Math.random() * acks.length)];
  }

  // --- Security-related responses ---

  if (/scan|analyze|check|audit|inspect/.test(lower)) {
    const resources = lower.includes('aws') ? 'AWS'
      : lower.includes('azure') ? 'Azure'
      : lower.includes('gcp') ? 'Google Cloud'
      : 'cloud';

    return `Running a ${resources} security scan...\n\n📊 **Scan Results:**\n\n🔴 **Critical:** SSH port 22 open to 0.0.0.0/0 on sg-${Math.floor(Math.random()*9999)}\n🟠 **High:** S3 bucket with public read access (s3-bucket-${Math.floor(Math.random()*9999)})\n🟡 **Medium:** EC2 instance using deprecated IMDSv1\n🟢 **Low:** IAM role with overly broad permissions\n\n**Recommended Actions:**\n1. Restrict SSH access to known IPs immediately\n2. Enable S3 Block Public Access\n3. Upgrade to IMDSv2\n\nWant me to generate fix commands for any of these?`;
  }

  if (/fix|mitigate|patch|remediat|resolve|repair/.test(lower)) {
    return `Here's a remediation plan for the most critical findings:\n\n**1. Restrict SSH Access (Critical)**\n\`\`\`bash\naws ec2 revoke-security-group-ingress --group-id sg-12345 --protocol tcp --port 22 --cidr 0.0.0.0/0\n\`\`\`\n\n**2. Block Public S3 Access (High)**\n\`\`\`bash\naws s3api put-public-access-block --bucket <bucket-name> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\n\`\`\`\n\n**3. Enforce IMDSv2 (Medium)**\n\`\`\`bash\naws ec2 modify-instance-metadata-options --instance-id i-12345 --http-token required\n\`\`\`\n\nWant me to walk you through any of these steps?`;
  }

  if (/threat|vulnerability|attack|breach|incident|malware|exploit/.test(lower)) {
    const threats = [
      "I've analyzed current threat intelligence feeds. The most relevant threats to cloud environments right now are:\n\n1. **Credential Compromise** — Watch for unusual IAM activity\n2. **S3 Data Exfiltration** — Check for new public buckets\n3. **Cryptojacking** — Monitor for unusual EC2 CPU spikes\n\nWant me to deep-dive into any of these?",
      "Based on recent threat patterns, here's what I'm seeing:\n\n🔴 **Active:** Suspicious login attempts from unusual IPs on your accounts\n🟠 **Warning:** Several cloud-native malware campaigns targeting misconfigured container registries\n\nI recommend enabling CloudTrail logging and reviewing your guardrails. Want a detailed breakdown?",
    ];
    return threats[Math.floor(Math.random() * threats.length)];
  }

  if (/aws|amazon web services/.test(lower)) {
    return `Here's your **AWS Security Overview:**\n\n📊 **Security Score:** 84/100\n🟢 **Healthy:** 142 resources\n🟡 **Warning:** 23 resources need attention\n🔴 **Critical:** 3 resources need immediate action\n\n**Key Concerns:**\n- 2 Security Groups with overly permissive ingress rules\n- 1 S3 bucket without encryption at rest\n- CloudTrail logging is disabled in 2 regions\n\nWant me to run a detailed scan or generate fix commands?`;
  }

  if (/azure|microsoft/.test(lower)) {
    return `Here's your **Azure Security Overview:**\n\n📊 **Security Score:** 81/100\n🟢 **Healthy:** 98 resources\n🟡 **Warning:** 15 resources need attention\n🔴 **Critical:** 2 resources need immediate action\n\n**Key Concerns:**\n- NSG allowing RDP (3389) from the internet\n- Key Vault without purge protection enabled\n- Defender for Cloud is disabled on 3 subscriptions\n\nWant me to generate remediation steps?`;
  }

  if (/gcp|google cloud/.test(lower)) {
    return `Here's your **GCP Security Overview:**\n\n📊 **Security Score:** 79/100\n🟢 **Healthy:** 76 resources\n🟡 **Warning:** 18 resources need attention\n🔴 **Critical:** 4 resources need immediate action\n\n**Key Concerns:**\n- Cloud Storage bucket with allUsers access\n- Service account with Editor role (overprivileged)\n- VPC firewall allows 0.0.0.0/0 on multiple ports\n\nWant me to fix these issues?`;
  }

  if (/score|posture|compliance|health check/.test(lower)) {
    return `📊 **Overall Cloud Security Postion:**\n\n| Provider | Score | Status |\n|----------|-------|--------|\n| AWS      | 84/100 | ⚠️ Needs Attention |\n| Azure    | 81/100 | ⚠️ Needs Attention |\n| GCP      | 79/100 | 🔴 Action Required |\n| **Avg**  | **81/100** | **Needs Improvement** |\n\n**Top Recommendations:**\n1. Enable MFA on all root accounts\n2. Restrict Security Group rules to least-privilege\n3. Enable encryption at rest for all storage services\n4. Turn on CloudTrail/Activity Log/Audit Log in all regions\n\nWant me to dive deeper into any provider?`;
  }

  if (/who|what|where|when|why|how/.test(lower) && !lower.includes('how are')) {
    return "That's an interesting question! While I'm primarily focused on cloud security, I'll do my best to help. Could you give me a bit more context about what you're looking for? If it's related to AWS, Azure, or GCP security, I can give you a detailed answer.";
  }

  // --- Fallback: Generic but natural response ---
  const fallbacks = [
    "I'm not sure I follow — could you rephrase that? I'm best at helping with cloud security scanning, threat analysis, and infrastructure hardening across AWS, Azure, and GCP.",
    "Interesting question! I'm primarily a cloud security assistant, so my expertise is in AWS, Azure, and GCP security. If your question is related to that, I can definitely help. Otherwise, let me know what you're looking for!",
    "I appreciate the question, but that's outside my core area of expertise. I'm built for cloud security — scanning, threat detection, and remediation. Want me to help with something along those lines?",
    "Hmm, I'm not quite sure how to answer that one. My specialty is cloud security across AWS, Azure, and GCP. Try asking me about scanning your infrastructure, analyzing threats, or fixing security issues!",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// --- Chat Endpoint ---

app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, context } = req.body;
  const grokApiKey = process.env.GROK_API_KEY;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  console.log(`[Chat] User: "${message}"`);

  // Try real LLM if a valid API key is configured
  if (grokApiKey && grokApiKey !== 'your_grok_api_key_here') {
    const systemPrompt = SYSTEM_PROMPT + (context ? `\n\nContext: ${JSON.stringify(context)}` : '');

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokApiKey}`
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          model: 'grok-beta',
          stream: false,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Grok API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[Chat] LLM response (real)`);
      res.json({
        response: data.choices[0].message.content,
        isSimulated: false
      });
      return;
    } catch (error) {
      console.error('[Chat] LLM call failed, falling back to simulation:', error);
    }
  }

  // Fallback: Local simulation with conversational responses
  console.log(`[Chat] Using simulation mode`);
  setTimeout(() => {
    const aiResponse = generateSimulatedResponse(message);
    res.json({
      response: aiResponse,
      isSimulated: true,
      note: 'Running in simulation mode. Set GROK_API_KEY in backend/.env for full LLM responses.'
    });
  }, 800);
});

// --- Start Server ---

app.listen(port, () => {
  const isSimMode = !process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'your_grok_api_key_here';
  console.log(`\n  ☁️  CLOUDCORE X Backend`);
  console.log(`  ➜  http://localhost:${port}`);
  console.log(`  ➜  Mode: ${isSimMode ? 'Simulation (set GROK_API_KEY for real LLM)' : 'Live LLM'}\n`);
});
