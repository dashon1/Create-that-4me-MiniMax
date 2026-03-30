Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { type, prompt, style } = await req.json();

        if (!type || !prompt) {
            throw new Error('Type and prompt are required');
        }

        // Get API keys from environment
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Supabase configuration missing');
        }

        let result = {
            type,
            prompt,
            status: 'completed',
            result_url: null,
            created_at: new Date().toISOString()
        };

        // Generate content based on type
        if (type === 'image' && openaiApiKey) {
            // Use DALL-E 3 for image generation
            const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024',
                    quality: style === 'high' ? 'hd' : 'standard'
                })
            });

            if (!imageResponse.ok) {
                const error = await imageResponse.json();
                throw new Error(`Image generation failed: ${error.error?.message || 'Unknown error'}`);
            }

            const imageData = await imageResponse.json();
            result.result_url = imageData.data[0].url;

        } else if (type === 'audio' && openaiApiKey) {
            // Use OpenAI TTS for audio generation
            const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    input: prompt,
                    voice: 'alloy'
                })
            });

            if (!audioResponse.ok) {
                throw new Error('Audio generation failed');
            }

            // Get audio as blob and convert to base64
            const audioBlob = await audioResponse.arrayBuffer();
            const timestamp = Date.now();
            const audioPath = `audio/${timestamp}-generated.mp3`;

            // Upload to Supabase Storage using proper API
            const uploadResponse = await fetch(
                `${supabaseUrl}/storage/v1/object/dat4me-assets/${audioPath}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'audio/mpeg',
                        'x-upsert': 'true'
                    },
                    body: audioBlob
                }
            );

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`Audio upload failed: ${errorText}`);
            }

            // Get public URL using proper Supabase method
            const publicUrlResponse = await fetch(
                `${supabaseUrl}/storage/v1/object/public/dat4me-assets/${audioPath}`,
                {
                    method: 'HEAD',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`
                    }
                }
            );

            // Use the constructed public URL
            result.result_url = `${supabaseUrl}/storage/v1/object/public/dat4me-assets/${audioPath}`;

        } else if (type === 'video') {
            // Video generation requires external services (not implemented in this demo)
            // Return placeholder for now
            result.status = 'processing';
            result.result_url = null;
        } else {
            // Mock mode for development - use data URI instead of problematic placeholder
            result.status = 'mock';
            const mockText = prompt.substring(0, 30) || 'Generated content';
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#4f46e5"/>
                  <stop offset="100%" stop-color="#9333ea"/>
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#g)"/>
              <text x="50%" y="50%" font-family="system-ui,Segoe UI,Roboto" font-size="64"
                fill="white" text-anchor="middle" dominant-baseline="middle">${mockText}</text>
            </svg>`;
            result.result_url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        }

        // Save generation to database
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/ai_generations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                type,
                prompt,
                result_url: result.result_url,
                status: result.status
            })
        });

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            console.error('Database insert failed:', errorText);
            // Continue anyway, generation was successful
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI generation error:', error);

        const errorResponse = {
            error: {
                code: 'AI_GENERATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
