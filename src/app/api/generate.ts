import OpenAI from "openai";
import { prompts } from "./prompts";

const generalCategories = [
  "Alltag",
  "Berufe",
  "Essen und Küche",
  "Natur",
  "Reisen",
  "Sport",
  "Technik",
  "Tiere",
  "Fantasie",
  "Geschichte",
];

const actingCategories = [
  "Alltagstätigkeiten",
  "Berufe mit typischen Bewegungen",
  "Sport und Bewegung",
  "Tiere mit typischen Bewegungen",
  "Kochen und Haushalt",
  "Reisen und Fortbewegung",
  "Gefühle mit deutlicher Mimik",
];

export default async function generateWords(
  mode: string,
  apiKey: string,
  recentWords: string[] = [],
) {
  const client = new OpenAI({
    apiKey: apiKey,
  });

  const categories =
    mode === "acting" ? actingCategories : generalCategories;
  const category = categories[Math.floor(Math.random() * categories.length)];
  const exclusions = recentWords.length
    ? ` Verwende keines dieser kürzlich ausgegebenen Wörter erneut: ${recentWords.join(", ")}.`
    : "";

  const prompt =
    prompts[mode] +
    ` Nutze für einen der beiden Begriffe vorrangig den Themenbereich ${category}; der zweite Begriff muss aus einem anderen Themenbereich stammen.` +
    exclusions +
    " The words should be returned as single json string, so that they can be parsed by a program. The keys for the words should be called word1 and word2 respectively. The points for each word should also be returned with the keys points1 and points2. It is essential that the words are not returned in any other format and the response does not include any other text. It is also essential that the json string is not placed in a markdown code block, it should just be returned as a string.";

  let response: any;

  try {
    response = await client.responses.create({
      model: "gpt-5-nano",
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
