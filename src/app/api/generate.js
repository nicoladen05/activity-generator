import OpenAI from 'openai';
import { prompts } from './prompts.js';

export default async function generateWords(mode, apiKey) {
  const client = new OpenAI({
    apiKey: apiKey,
  });

  const prompt = prompts[mode] + " The words should be returned as single json string, so that they can be parsed by a program. It is essential that the words are not returned in any other format and the response does not include any other text. The keys for the words should be called word1 and word2 respectively."

  let response; 

  try {
    response = await client.responses.create({
      model: 'gpt-3.5-turbo',
      input: prompt,
    });
  } catch (error) {
    console.log("Error generating words: ", error);
  }

  if (response.error) {
    console.log("Error generating words: ", response.error);
    return { error: response.error };
  }

  console.log("Response: ", response);

  const jsonResponse = JSON.parse(response.output_text);

  return jsonResponse;
}
