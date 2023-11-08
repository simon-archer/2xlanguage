import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
    async POST(req: Request, _ctx: HandlerContext) {
      const url = new URL(req.url);
      const imageType = url.searchParams.get("imageType");
  
      const body = new Uint8Array(await req.arrayBuffer());
      const base64Image = btoa(String.fromCharCode(...body));
  
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
                  type: "image",
                  image: {
                    url: `data:image/${imageType};base64,${base64Image}`
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
    try {
    const data = await openaiResponse.json();¨
    console.log(data)
    const description = data.choices[0].message.content;

    // TODO: Translate the description into the two languages using a translation API

    return new Response(JSON.stringify({ lang1: description, lang2: description }), {
      headers: { "Content-Type": "application/json" },
    });
    } catch (error) {
        console.error(error);
        return new Response("An error occurred", { status: 500 });
      }
  },
};