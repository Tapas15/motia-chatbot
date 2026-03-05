import { ApiRouteConfig, ApiRequest, FlowContext } from 'motia';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// Response type for both success and error cases
type ChatResponse = {
  conversationId: string;
  title: string;
  explanation: string;
};

export const config: ApiRouteConfig = {
  type: 'api',
  name: 'ChatApi',
  description: 'Chat API endpoint using Groq',
  method: 'POST',
  path: '/chat',
  bodySchema: z.object({
    message: z.string().min(1, 'Message is required'),
    conversationId: z.string().optional(),
  }),
  responseSchema: {
    200: z.object({
      conversationId: z.string(),
      title: z.string(),
      explanation: z.string(),
    }),
    500: z.object({
      conversationId: z.string(),
      title: z.string(),
      explanation: z.string(),
    }),
  },
  emits: [],
  flows: ['chat'],
};

export const handler = async (
  req: ApiRequest<{ message: string; conversationId?: string }>,
  ctx: FlowContext
) => {
  const { message, conversationId: inputConversationId } = req.body;
  
  const conversationId = inputConversationId || randomUUID();

  ctx.logger.info('Processing chat message', { message, conversationId });

  // Groq configuration
  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  // For demo purposes, if no API key is configured, return a mock response
  if (!groqApiKey || groqApiKey === 'your_groq_api_key_here') {
    ctx.logger.info('Using mock response - GROQ_API_KEY not configured');
    return {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: {
        conversationId,
        title: 'Demo Response',
        explanation: 'This is a demo response. To get real AI responses, please set your GROQ_API_KEY in the .env file. You can obtain a free API key from https://console.groq.com/.',
      },
    };
  }

  try {
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant. Respond in JSON format with "title" and "explanation" fields. Keep the title short and the explanation concise.' 
          },
          { role: 'user', content: message }
        ],
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON response from AI
    let title = 'Response';
    let explanation = content;
    
    try {
      const parsed = JSON.parse(content);
      title = parsed.title || 'Response';
      explanation = parsed.explanation || content;
    } catch {
      // If not valid JSON, use content as explanation
      explanation = content;
    }

    ctx.logger.info('Chat response generated', { conversationId, title });

    return {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: {
        conversationId,
        title,
        explanation,
      },
    };
  } catch (error) {
    ctx.logger.error('Error calling Groq API', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    return {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: {
        conversationId,
        title: 'Error',
        explanation: 'Could not connect to Groq API. Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
    };
  }
};

export default config;
