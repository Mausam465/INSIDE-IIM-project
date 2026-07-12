import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Gemini API Key loaded:', apiKey ? apiKey.substring(0, 15) + '...' : 'NONE');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Google Gen AI client lists models using listModels
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log('Response Status:', response.status);
    if (response.ok) {
      console.log('Available Models List:');
      const models = data.models || [];
      console.log(models.map(m => `${m.name} (supports: ${m.supportedGenerationMethods.join(', ')})`));
    } else {
      console.error('ListModels Request failed:', data);
    }
  } catch (err) {
    console.error('Error during listModels fetch:', err.message);
  }
}

listModels();
