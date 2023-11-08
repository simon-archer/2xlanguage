import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
    async POST(req: Request, _ctx: HandlerContext) {
        let openaiResponse;
        let imageType;
        let base64Image;
        let description;

        try {
            const url = new URL(req.url);
            imageType = url.searchParams.get("imageType");
        
            const body = new Uint8Array(await req.arrayBuffer());
            let binary = '';
            const bytes = new Uint8Array(body);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            base64Image = btoa(binary);
        } catch (error) {
            console.error("Error during request handling:", error);
            return new Response("Error during request handling: " + error.message, { status: 500 });
        }
        
        try {
            openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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
                    max_tokens: 1000
                }),
            });
            console.log(openaiResponse)
        } catch (error) {
            console.error("Error during OpenAI API request:", error);
            return new Response("Error during OpenAI API request", { status: 500 });
        }

        console.log(openaiResponse)
    
        try {
            if (!openaiResponse.ok) {
                return new Response("OpenAI API request failed", { status: 500 });
            }
            const data = await openaiResponse.json();
            console.log(data)
            description = data.choices[0].message.content;
        } catch (error) {
            console.error("Error during OpenAI API response handling:", error);
            return new Response("Error during OpenAI API response handling", { status: 500 });
        }

        // TODO: Translate the description into the two languages using a translation API

        return new Response(JSON.stringify({ lang1: description, lang2: description }), {
            headers: { "Content-Type": "application/json" },
        });
    },
};