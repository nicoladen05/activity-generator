import OpenAI from "openai";
import { prompts } from "./prompts.js";

export default async function generateWords(mode, apiKey) {
  const client = new OpenAI({
    apiKey: apiKey,
  });

  const prompt =
    prompts[mode] +
    " The words should be returned as single json string, so that they can be parsed by a program. The keys for the words should be called word1 and word2 respectively. The points for each word should also be returned with the keys points1 and points2. It is essential that the words are not returned in any other format and the response does not include any other text. It is also essential that the json string is not placed in a markdown code block, it should just be returned as a string.";

  let response;

  try {
    response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 1.5,
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
