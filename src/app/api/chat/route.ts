import { createOllama } from "ollama-ai-provider";

import { streamText } from "ai";

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASEURL,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama("llama3.2"),
    messages,
  });

  return result.toDataStreamResponse();
}
