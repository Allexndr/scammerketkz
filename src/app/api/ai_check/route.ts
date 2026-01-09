import { NextRequest, NextResponse } from 'next/server'

const HF_API_KEY = process.env.HF_API_KEY
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2'

export async function POST(req: NextRequest) {
    if (!HF_API_KEY) {
        return NextResponse.json({
            error: 'AI_KEY_MISSING',
            details: 'HuggingFace API key is not configured.'
        }, { status: 500 })
    }

    try {
        const { text } = await req.json()

        if (!text || text.length < 5) {
            return NextResponse.json({ error: 'Text too short' }, { status: 400 })
        }

        const prompt = `<s>[INST] Ты эксперт по кибербезопасности из Казахстана. Проанализируй сообщение ниже на предмет мошенничества.
        
        Текст: "${text}"
        
        Верни ТОЛЬКО JSON объект (без markdown):
        {
            "score": число_от_0_до_100,
            "verdict": "короткий вердикт на русском",
            "advice": "совет на русском что делать"
        } [/INST]`

        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 500,
                    return_full_text: false,
                    temperature: 0.1 // Делаем его более строгим и предсказуемым
                }
            }),
        });

        const result = await response.json()

        // HuggingFace returns an array: [{ generated_text: "..." }]
        let jsonStr = result[0]?.generated_text || ''

        // Clean up text to extract JSON
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim()

        // Sometimes models chatter before/after JSON. Need to extract { ... }
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            jsonStr = jsonMatch[0]
        }

        const analysis = JSON.parse(jsonStr)
        return NextResponse.json(analysis)

    } catch (error) {
        console.error('AI Check Error:', error)
        return NextResponse.json({
            error: 'Failed to analyze',
            fallback: {
                score: 50,
                verdict: 'Ошибка анализа',
                advice: 'Попробуйте позже или проверьте вручную. AI не смог обработать запрос.'
            }
        }, { status: 500 })
    }
}
