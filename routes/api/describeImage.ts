import { HandlerContext, Handlers } from "$fresh/server.ts";
import { Buffer } from "https://deno.land/std@0.107.0/io/buffer.ts";

export const handler: Handlers = {
    async POST(req: Request, _ctx: HandlerContext) {
        let openaiResponse;
        let imageType;
        let base64Image;
        let description;

        try {
            const formData = await req.formData();
            const file = formData.get('image') as File; // Cast formData.get('image') to File
            console.log(file);
            const imageType = file.type.split("/")[1]; // Get the image type (jpeg or png)
            const base64Image = new Buffer(file.value).toString('base64'); // Use file.value to get the file data
            const imageUrl = `data:${imageType};base64,${base64Image}`;

            console.log(imageUrl);
        } catch (error) {
            console.error("Error during request handling:", error);
            return new Response("Error during request handling: " + error.message, { status: 500 });
        }
        
        try {
            const imageUrl = `data:image/${imageType};base64,${base64Image}`;

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
                                    type: "image_url",
                                    image_url: {
                                        url: `data:image/${imageType};base64,${base64Image}`
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 1000
                }),
            });
            if (!openaiResponse.ok) {
                const errorBody = await openaiResponse.text();
                console.error(`OpenAI API request failed with status ${openaiResponse.status} and body ${errorBody}`);
                return new Response(`OpenAI API request failed with status ${openaiResponse.status} and body ${errorBody} with imageType:${imageType} and imageUrl: ${imageUrl}`, { status: 500 });
            }
            console.log(openaiResponse)
        } catch (error) {
            console.error("Error during OpenAI API request:", error);
            return new Response("Error during OpenAI API request", { status: 500 });
        }

        console.log(openaiResponse)
    
        try {
            if (!openaiResponse.ok) {
                const errorBody = await openaiResponse.text();
                console.error(`OpenAI API request failed with status ${openaiResponse.status} and body ${errorBody}`);
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