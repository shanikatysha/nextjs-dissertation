import { NextResponse } from "next/server";
import Replicate from "replicate";
import fs from "node:fs";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const generateEmotionalPrompt = (emotions, colors, overallTone) => {
    // Much simpler prompt since your LoRA model already knows your style
    const prompt = `Create an abstract RORA artwork in a grainy cosmic motion style, radiating aura forms and futuristic patterns that depicts these emotions: ${emotions.join(', ')}. Use these colors: ${colors.join(', ')} make sure they are VIBRANT AND/OR PASTEL colors that create contrast with each other but still look harmonious. The background color should ALWAYS be deep black (#111111). Futuristic patterns color should ALWAYS be true white (#FFFFFF) to create contrast with the background and radiating auroras. AVOID rigid geometric patterns or grid-like radiating lines: aim for abstract particles, atom shapes, deformed line contours, spirals, and radials. Apply a soft outer glow and fading edges to create a sense of energy dissipation, but NEVER cover the futuristic pattern underneath. Play around with the opacity for the auroras for smooth color blending. Include slight asymmetry or dynamic imbalance to give a sense of natural energy rather than a mechanical, evenly spaced design. AVOID clean concentric symmetry and rigid geometric patterns; aim for overlapping waves, warped ellipses, and swirling halos. Incorporate light wireframe arcs or motion trails but keep the focus on textured radiating lines. Aim for a style that evokes celestial storms, cosmic bursts, or quantum energy halos.`;
    return prompt;
};

// In production and preview deployments (on Vercel), the VERCEL_URL environment variable is set.
// In development (on your local machine), the NGROK_HOST environment variable is set.
// const WEBHOOK_HOST = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : process.env.NGROK_HOST;

export async function POST(request) {
    try {
        const { emotions, colors, overallTone } = await request.json();

        // Validate inputs
        if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
        return Response.json({ error: 'Emotions not found' }, {status : 400});
        }

        if (!colors || !Array.isArray(colors) || colors.length === 0) {
        return Response.json({ error: 'Colors not found' }, {status : 400});
        }

        if (!overallTone || overallTone.trim().length === 0) {
        return Response.json({ error: 'Overall tone not found' }, {status : 400});
        }

        // Generate the simplified prompt
        const emotionalPrompt = generateEmotionalPrompt(emotions, colors, overallTone);
        console.log('Generated emotional prompt:', emotionalPrompt);

        // Call Replicate with your fine-tuned model
        const output = await replicate.run(
        "shanikatysha/aurora:cb9dd1c9407513be78ccd35628b5af731a7453f07adbac9aea18145bbe5ad591", 
        {
            input: {
            "prompt": emotionalPrompt,
            "model": "dev",
            "go_fast": false,
            "lora_scale": 1.75,
            "megapixels": "1",
            "num_outputs": 1,
            "aspect_ratio": "16:9",
            "output_format": "png",
            "guidance_scale": 3,
            "output_quality": 80,
            "prompt_strength": 0.8,
            "extra_lora_scale": 1,
            "num_inference_steps": 28
            }
        });

        // Replicate returns an array of image URLs
        const imageUrl = output[0].toString();
        // To access the file URL:
        console.log('check image here --> ' + imageUrl); //=> "http://example.com"

        console.log('Artwork generated with Replicate:', {
        emotions,
        colors,
        overallTone: overallTone.substring(0, 50) + '...',
        });

        return Response.json({
            imageUrl,
            emotions,
            colors,
            overallTone,
            promptPreview: emotionalPrompt
        }, {status : 200});

    } catch (error) {
        console.error('Error generating artwork with Replicate:', error);
        
        if (error.message.includes('rate limit')) {
            return Response.json({
                error: 'Rate limit exceeded. Please try again in a moment.' 
            }, {status : 429});
        }

        Response.json({ 
        error: 'Failed to generate artwork',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
        } , {status : 500});
    }
}