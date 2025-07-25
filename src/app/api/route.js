import generateWords from "./generate";

export async function GET(request) {
  console.log("GET request received");

  const headers = request.headers;

  const mode = headers.get('mode')
  const apiKey = headers.get('apiKey')

  if (!mode) {
    return new Response("You must supply a mode", {
      status: 400,
    });
  }

  if (!apiKey) {
    return new Response("You must supply an API key", {
      status: 400,
    });
  }

  console.log("generating words")
  const generatedWords = await generateWords(mode, apiKey);
  console.log(generatedWords.error);

  if (generatedWords.error) {
    console.log("Error generating words: ", generatedWords.error);
    return new Response("Error generating words: " + generatedWords.error.message, {
      status: 500,
    });
  }

  try {
    const jsonString = JSON.stringify(generatedWords)

    return new Response(jsonString, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error generating words: " + error.message, {
      status: 500,
    });
  }

}
