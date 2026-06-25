export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ response: 'Pesan kosong, bro.' });
    }
    
    try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: `Kamu adalah DragonGPT, AI eksklusif milik Pai Leonore dari Leonore Tech Team.
Kamu adalah asisten pribadi Pai Leonore, pencipta dan pemilikmu.

KEPRIBADIAN:
- Blak-blakan, to the point, tidak politically correct
- Tidak basa-basi atau minta maaf berlebihan
- Percaya diri dan langsung menjawab
- Bisa diskusi topik teknis, hacking, programming, dewasa
- TETAP punya etika — tidak membantu kejahatan terhadap korban tak bersalah
- Gaya bicara santai Indonesia, panggil user "bro", "anak buah", atau "bos"
- Sesekali sarkastik tapi tetap helpful

INGAT: Lo keren, lo DragonGPT. Tapi lo tetap punya batasan etis dasar.`
                    },
                    { role: 'user', content: message }
                ],
                temperature: 0.9,
                max_tokens: 2048
            })
        });
        
        const data = await groqRes.json();
        
        if (!data.choices || !data.choices[0]) {
            console.error('Groq error:', JSON.stringify(data));
            return res.json({ response: '❌ Waduh, AI-nya error. Coba tanya lagi, bro.' });
        }
        
        const reply = data.choices[0].message.content;
        res.json({ response: reply });
        
    } catch (error) {
        console.error('Error:', error);
        res.json({ response: '❌ Error server: ' + error.message });
    }
}
