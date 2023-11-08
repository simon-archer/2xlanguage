import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req: Request, _ctx: HandlerContext) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("imageUrl");
    const lang1 = url.searchParams.get("lang1");
    const lang2 = url.searchParams.get("lang2");

    if (!imageUrl || !lang1 || !lang2) {
      return new Response("Missing parameters", { status: 400 });
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What’s in this image?"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300
      }),
    });

    if (!openaiResponse.ok) {
      return new Response("OpenAI API request failed", { status: 500 });
    }

    const data = await openaiResponse.json();
    const description = data.choices[0].message.content;

    // TODO: Translate the description into the two languages using a translation API

    return new Response(JSON.stringify({ lang1: description, lang2: description }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};