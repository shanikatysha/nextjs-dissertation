import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    const response = await openai.images.generate({
      model: "dall-e-3", // or "dall-e-3" for higher quality
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return Response.json({ 
      imageUrl: response.data[0].url 
    });
  } catch (error) {
    return Response.json({ 
      error: "Failed to generate image" 
    }, { status: 500 });
  }
}