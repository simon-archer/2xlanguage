import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
    async POST(req: Request, _ctx: HandlerContext) {
        let openaiResponse;
        let imageType;
        let imageUrl;
        let base64Image;
        let description;
        let lang1;
        let lang2;
      
        try {
          const { imageUrl: imageData, lang1: lang1Data, lang2: lang2Data } = await req.json();
          base64Image = imageData.split(',')[1];
          imageType = imageData.split(';')[0].split('/')[1];
          imageUrl = imageData;
          lang1 = lang1Data;
          lang2 = lang2Data;
        } catch (error) {
            console.error("Error during request handling:", error);
            return new Response("Error during request handling: " + error.message, { status: 500 });
        }
        
        try {
            imageUrl = `data:image/${imageType};base64,${base64Image}`;

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
                                    text: `You are an in-conxtext language learnin bot. Write a very short description of what is in the image, in these two languages: ${lang1}(lang1) and ${lang2}(lang2). Format like this lang1: description. lang2: description.`
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: `${imageUrl}`
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

        return new Response(JSON.stringify({ lang1: description, lang2: description, imageUrl }), {
            headers: { "Content-Type": "application/json" },
        });
    },
};