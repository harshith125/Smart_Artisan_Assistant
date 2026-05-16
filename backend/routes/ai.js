const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Production = require('../models/Production');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// @route   POST /api/ai/chat
// @desc    Chat with Groq Llama AI assistant using artisan context
// @access  Public (for MVP)
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    // Fetch the artisan's real production data to inject as context
    const productions = await Production.find().sort({ dateAdded: -1 }).limit(50);

    const productionSummary = productions.length === 0
      ? 'No productions have been logged yet.'
      : productions.map(p =>
          `- ${p.itemName} (${p.category}): ₹${p.price}, Materials: ${p.materials || 'N/A'}, Date: ${p.dateAdded.toISOString().split('T')[0]}`
        ).join('\n');

    const totalValue = productions.reduce((acc, p) => acc + (p.price || 0), 0);

    const systemPrompt = `You are a smart AI assistant embedded inside "Smart Artisan Assistant", a platform for Indian artisans to manage their handcrafted production.

Your role is to:
- Help artisans with pricing strategies for their handcrafted items
- Suggest materials and cost-saving alternatives
- Provide business insights based on their actual production data
- Answer questions about their production history and earnings
- Give advice on production planning and efficiency
- Help them understand market trends for handcrafted goods in India

IMPORTANT RULES:
- Always use INR (₹) for currency
- Be encouraging and supportive — many users are small-scale craftspeople
- Keep responses concise and practical (2-4 short paragraphs max)
- When they ask about their data, use the production context provided below

=== ARTISAN'S CURRENT PRODUCTION DATA ===
Total items logged: ${productions.length}
Total value created: ₹${totalValue.toLocaleString('en-IN')}

Recent productions:
${productionSummary}
==========================================`;

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ reply });

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ error: 'AI request failed. Please try again.' });
  }
});

module.exports = router;
