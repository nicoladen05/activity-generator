import generateWords from "./generate";

export async function GET(request: Request) {
  console.log("GET request received");

  const headers = request.headers;

  const mode = headers.get("mode");
  const apiKey = headers.get("apiKey");
  const recentWordsHeader = headers.get("recentWords");

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

  let recentWords: string[] = [];
  if (recentWordsHeader) {
    try {
      const parsed = JSON.parse(decodeURIComponent(recentWordsHeader));
      if (Array.isArray(parsed)) {
        recentWords = parsed
          .filter((word): word is string => typeof word === "string")
          .slice(-20);
      }
    } catch {
      return new Response("Invalid recent words", { status: 400 });
    }
  }

  console.log("generating words");
  const generatedWords = await generateWords(mode, apiKey, recentWords);
  console.log(generatedWords.error);

  if (generatedWords.error) {
    console.log("Error generating words: ", generatedWords.error);
    return new Response(
      "Error generating words: " + generatedWords.error.message,
      {
        status: 500,
      },
    );
  }

  try {
    const jsonString = JSON.stringify(generatedWords);

    return new Response(jsonString, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error generating words: " + error.message, {
      status: 500,
    });
  }
}
