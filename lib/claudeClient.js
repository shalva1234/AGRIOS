const EMERGENT_API_URL = process.env.EMERGENT_API_URL || 'https://api.emergent.sh/v1/chat';
const EMERGENT_UNIVERSAL_KEY = process.env.EMERGENT_UNIVERSAL_KEY;

if (!EMERGENT_UNIVERSAL_KEY) {
  console.warn('Missing EMERGENT_UNIVERSAL_KEY in environment variables');
}

export async function callClaude(messages, options = {}) {
  const {
    stream = false,
    model = 'claude-3-5-sonnet-20241022',
    maxTokens = 2000,
  } = options;

  const requestBody = {
    model,
    messages,
    max_tokens: maxTokens,
    stream,
  };

  try {
    const response = await fetch(EMERGENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMERGENT_UNIVERSAL_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}

export async function getChatCompletion(messages) {
  const response = await callClaude(messages, { stream: false });
  const data = await response.json();
  
  if (data.content && data.content[0] && data.content[0].text) {
    return data.content[0].text;
  }
  
  return data;
}

export async function getStreamingResponse(messages) {
  return await callClaude(messages, { stream: true });
}
