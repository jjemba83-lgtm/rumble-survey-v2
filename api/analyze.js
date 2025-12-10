// Vercel Serverless Function - Generates personalized follow-up question based on CBC patterns
// Environment variable required: OPENAI_API_KEY (set in Vercel Dashboard)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { patterns, demographics } = req.body;

    if (!patterns) {
      return res.status(400).json({ error: 'Missing patterns data' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return a mock response for testing
    if (!apiKey) {
      console.log('OPENAI_API_KEY not configured - returning mock response');
      const mockInsight = generateInsight(patterns);
      return res.status(200).json({
        question: "Based on your choices, what's the ONE thing that would make you upgrade to a higher tier membership?",
        insight: mockInsight,
        patterns: patterns,
        mock: true
      });
    }

    // Build the prompt with CBC pattern analysis
    const prompt = buildPrompt(patterns, demographics);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a friendly, insightful fitness membership consultant for Rumble Boxing.
Your job is to analyze a member's survey choices and generate ONE personalized follow-up question.

Guidelines:
- Be conversational and warm, not corporate
- Reference specific patterns you noticed in their choices
- Ask something that reveals WHY they made those choices
- Keep it to 1-2 sentences max
- Don't be salesy - be genuinely curious
- Use "you" language, make it personal
- Match Rumble's bold, energetic brand voice`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({ error: 'Failed to generate question' });
    }

    const data = await response.json();
    const generatedQuestion = data.choices[0]?.message?.content?.trim();

    if (!generatedQuestion) {
      return res.status(500).json({ error: 'No question generated' });
    }

    // Also generate a brief insight about their pattern
    const insight = generateInsight(patterns);

    return res.status(200).json({
      question: generatedQuestion,
      insight: insight,
      patterns: patterns // Echo back for debugging/storage
    });

  } catch (error) {
    console.error('Error in analyze function:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function buildPrompt(patterns, demographics) {
  const {
    pricePreference,
    commitmentPreference,
    heroPreference,
    bookingPreference,
    neitherCount,
    totalChoices,
    choiceDetails
  } = patterns;

  let prompt = `Analyze this Rumble Boxing member's survey choices and generate a personalized follow-up question:\n\n`;

  // Demographics context
  if (demographics?.location) {
    prompt += `Studio: ${demographics.location}\n`;
  }
  if (demographics?.status) {
    prompt += `Member status: ${demographics.status}\n`;
  }

  prompt += `\n## Choice Patterns:\n`;

  // Price/Tier patterns
  if (pricePreference) {
    const priceLabels = {
      'low': 'consistently chose lower-priced tiers ($119-$179)',
      'high': 'consistently chose premium tiers ($219-$249)',
      'mixed': 'showed no strong price preference'
    };
    prompt += `- Price behavior: ${priceLabels[pricePreference] || pricePreference}\n`;
  }

  // Commitment patterns
  if (commitmentPreference) {
    const commitLabels = {
      'flexible': 'strongly preferred month-to-month flexibility',
      'committed': 'preferred longer commitments for savings (6-12 months)',
      'mixed': 'balanced between flexibility and commitment'
    };
    prompt += `- Commitment style: ${commitLabels[commitmentPreference] || commitmentPreference}\n`;
  }

  // Hero perk patterns
  if (heroPreference) {
    const heroLabels = {
      'H_None': 'often chose options without perks (price-focused)',
      'H_GUESTS': 'valued guest passes highly',
      'H_RECOVERY': 'prioritized recovery lounge access',
      'H_CHILDCARE': 'prioritized childcare services',
      'mixed': 'no strong perk preference'
    };
    prompt += `- Perk preference: ${heroLabels[heroPreference] || heroPreference}\n`;
  }

  // Booking window patterns
  if (bookingPreference) {
    const bookingLabels = {
      'short': 'preferred shorter booking windows (7-day)',
      'long': 'preferred longer booking windows (30-day)',
      'mixed': 'no strong booking preference'
    };
    prompt += `- Booking style: ${bookingLabels[bookingPreference] || bookingPreference}\n`;
  }

  // Neither selections
  if (neitherCount > 0) {
    prompt += `- Selected "neither option" ${neitherCount} out of ${totalChoices} times\n`;
  }

  prompt += `\nGenerate ONE follow-up question that:
1. Acknowledges a specific pattern you noticed
2. Asks WHY they made those choices
3. Helps us understand their fitness lifestyle better

Just output the question, nothing else.`;

  return prompt;
}

function generateInsight(patterns) {
  const { pricePreference, commitmentPreference, heroPreference, neitherCount, totalChoices } = patterns;

  // Generate a brief insight based on dominant pattern
  if (neitherCount >= 3) {
    return "You're selective - you know exactly what you want.";
  }

  if (commitmentPreference === 'flexible' && pricePreference === 'low') {
    return "You value freedom and smart spending.";
  }

  if (commitmentPreference === 'committed' && pricePreference === 'high') {
    return "You're all-in when you commit to something.";
  }

  if (heroPreference === 'H_RECOVERY') {
    return "Recovery is part of your training, not an afterthought.";
  }

  if (heroPreference === 'H_CHILDCARE') {
    return "You're making fitness work around family life.";
  }

  if (heroPreference === 'H_GUESTS') {
    return "Fitness is better with friends for you.";
  }

  if (pricePreference === 'low') {
    return "You're strategic about where your money goes.";
  }

  if (pricePreference === 'high') {
    return "You invest in experiences that matter.";
  }

  return "Your choices tell an interesting story.";
}
