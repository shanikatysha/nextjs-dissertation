import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { story } = await request.json();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      //prompting the AIs job
      messages: [{
        role: "system", // as a system
        content: `You are an expert at analyzing personal narratives for emotional patterns, themes, conflicts, and relationships. Additionally, you are a color expert who can understand the users' emotions, feelings, and tone and translate them to colors. Analyze the story and return ONLY a valid JSON object (no markdown, no code blocks) with these exact keys:
        - emotions: array of 3 keywords of emotional patterns (e.g., "ambivalence", "anxiety")
        - conflicts: array of 3 internal/external conflicts
        - overallTone: a single sentence describing the story's emotional tone
        - colors: array of 4 colors associated with the story's emotional tone using Hex color codes (e.g., "#2596be", "#e28743")
        The JSON object should have these exact structure:
        {
          "emotions": ["emotion1", "emotion2", "emotion3"],
          "colors": ["color1", "color2", "color3", "color4"], 
           "overallTone": "description of overall emotional tone"
        }
        
        Return only valid JSON object, nothing else.`
      }, {
        role: "user", // what the user is asking
        content: story
      }],
      max_tokens: 400,
    });

    const rawContent = response.choices[0].message.content;
    // Clean markdown formatting if present
    const cleanContent = rawContent
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();
    const patterns = JSON.parse(cleanContent); // store json in patterns
    return Response.json({ patterns });
  } 
  
  catch (error) {
    console.error('Pattern analysis error:', error);
    return Response.json({ 
      error: "Failed to analyze patterns" 
    }, { status: 500 });
  }

  // try {
  //   const { message } = await request.json();
    
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [{ role: "user", content: message }],
  //     max_tokens: 150,
  //   });

  //   return Response.json({ 
  //     response: response.choices[0].message.content 
  //   });
  // } catch (error) {
  //   return Response.json({ 
  //     error: "Failed to fetch AI response" 
  //   }, { status: 500 });
  // }
}