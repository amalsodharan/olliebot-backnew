import axios from 'axios';
import { marked } from 'marked';
import dotenv from 'dotenv';

dotenv.config();

let conversationHistory = [];

const getChatGPTResponse = async (prompt, chatStatus) => {
  const startTime = Date.now();
  if(chatStatus == 'Started'){
    conversationHistory = [];
    console.log("started only");
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt is empty');
  }

  // add user message to history
  conversationHistory.push({ role: 'user', content: prompt });

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: conversationHistory, // include full chat history
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:8080',
          'X-Title': 'my-express-app',
        },
      }
    );

    const endTime = Date.now();
    console.log(`OpenRouter API call took ${endTime - startTime}ms`);

    if (response.data?.choices?.[0]?.message?.content) {
      const rawContent = response.data.choices[0].message.content;
      const htmlContent = marked.parse(rawContent);

      conversationHistory.push({ role: 'assistant', content: rawContent });

      return htmlContent;
    } else {
      throw new Error('Invalid response from OpenRouter API');
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error.response?.data || error.message);
    throw new Error('Error calling OpenRouter API');
  }
};

export default getChatGPTResponse;
