// Classe per gestionar l'API d'OpenAI
export class GestorOpenAI {
    constructor() {
        this.apiKey = localStorage.getItem('openai-api-key') || '';
        this.veuOriginal = localStorage.getItem('veu-original') || 'alloy';
        this.veuTraduida = localStorage.getItem('veu-traduida') || 'nova';
        this.idiomaOriginal = localStorage.getItem('idioma-original') || 'catalan';  // català
        this.idiomaTraduccio = localStorage.getItem('idioma-traduccio') || 'english'; // anglès
    }

    isConfigured() {
        return !!this.apiKey;
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('openai-api-key', apiKey);
    }

    getApiKey() {
        return this.apiKey;
    }
    // Afegeix aquests nous mètodes a la classe GestorOpenAI
    setVeuOriginal(veu) {
        this.veuOriginal = veu;
        localStorage.setItem('veu-original', veu);
    }

    getVeuOriginal() {
        return this.veuOriginal;
    }

    setVeuTraduida(veu) {
        this.veuTraduida = veu;
        localStorage.setItem('veu-traduida', veu);
    }

    getVeuTraduida() {
        return this.veuTraduida;
    }

    ///

    setIdiomaOriginal(idioma) {
        this.idiomaOriginal = idioma;
        localStorage.setItem('idioma-original', idioma);
    }

    getIdiomaOriginal() {
        return this.idiomaOriginal;
    }

    setIdiomaTraduccio(idioma) {
        this.idiomaTraduccio = idioma;
        localStorage.setItem('idioma-traduccio', idioma);
    }

    getIdiomaTraduccio() {
        return this.idiomaTraduccio;
    }
    ///

    getUsApiKeyFacturacio() {
        // no es pot consultar des del navegador, cal fer-ho des del servidor
        return

        // const apiKey = this.getApiKey();
        // if (!apiKey) {
        //     console.error('Clau API no configurada. No es pot consultar l\'ús.');
        //     return;
        // }
        // //fetch(`https://api.openai.com/v1/dashboard/billing/usage?start_date=${start}&end_date=${end}`, {
        // fetch('https://api.openai.com/v1/dashboard/billing/credit_grants', {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${apiKey}`,
        //         'Content-Type': 'application/json'
        //     }
        //     })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log('Crèdit disponible:', data);
        //     const total = data.total_granted;
        //     const usat = data.total_used;
        //     const disponible = data.total_available;

        //     const convert = usd => usd * 0.93; // tipus de canvi aproximat USD → EUR

        //     console.log(`Crèdit total: $${total.toFixed(2)} (~€${convert(total).toFixed(2)})`);
        //     console.log(`Has gastat: $${usat.toFixed(2)} (~€${convert(usat).toFixed(2)})`);
        //     console.log(`Et queda: $${disponible.toFixed(2)} (~€${convert(disponible).toFixed(2)})`);
        //     })
        //     .catch(err => console.error('Error consultant el crèdit:', err));

    }

    async transcriureAudio(audioBlob) {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'text');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error en transcriure àudio: ${error.error?.message || response.statusText}`);
        }

        const text = await response.text();

        
        return text;
    }

    async traduirText(text, idiomaOrigen, idiomaDesti) {

        let content

        if (idiomaOrigen === 'autodetection') {
            content = `Ets un traductor professional. Traduïu el següent text de l'idioma original (autotetecció) a ${idiomaDesti}. Torna només la traducció, res més.`;
        } else {
            content = `Ets un traductor professional. Traduïu el següent text de ${idiomaOrigen} a ${idiomaDesti}. Torna només la traducció, res més.`;
        }

        // content = `You are a professional translator. Translate the following text from ${idiomaOrigen} to ${idiomaDesti}. Only return the translation, nothing else.`
        // const content = `Ets un traductor professional. Traduïu el següent text de ${idiomaOrigenNom} a ${idiomaDestiNom}. Torna només la traducció, res més.`
        
        // Pots utilitzar altres models de OpenAI com: 
        // "gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", etc.
        // Consulta https://platform.openai.com/docs/models/overview per la llista actualitzada.
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o', // Pots canviar per "gpt-4o", "gpt-4-turbo", etc.
                messages: [
                    {
                        role: 'system',
                        content: content
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error en traduir text: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    

    async textAAudio(text, idioma) {
        // Seleccionar la veu segons l'idioma

        const veu = this.veuTraduida;

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                voice: veu,
                input: text
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error en convertir text a àudio: ${error.error?.message || response.statusText}`);
        }

        const audioBlob = await response.blob();
        return audioBlob;
    }

    

    async extraureTextImatge(imatgeBase64, idiomaDesti) {
        // Utilitzem l'API de Vision (gpt-4-vision-preview -> gpt-4o) per extreure text d'una imatge
        const idiomaDestiNom = idiomaDesti.value   // this.getNomIdioma(idiomaDesti);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'Ets un sistema OCR precís. Extreu i retorna tot el text visible en la imatge sense afegir informació addicional. Si no hi ha text visible, indica-ho clarament.'
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Extreu tot el text visible en aquesta imatge. Retorna només el text extret.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${imatgeBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error en extreure text de la imatge: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // getNomIdioma(codi) { // proximament a eliminar 
    //     const mapaCodisIdiomes = {
    //         'ca': 'catalan',
    //         'es': 'spanish',
    //         'en': 'english',
    //         'fr': 'french',
    //         'de': 'german',
    //         'it': 'italian',
    //         'pt': 'portuguese',
    //         'nl': 'dutch',
    //         'ru': 'russian',
    //         'ja': 'japanese',
    //         'zh': 'chinese'
    //     };
    //     return mapaCodisIdiomes[codi] || codi;
    // }

    async generarAudioOriginal(text, idioma) {
        // Seleccionar la veu segons l'idioma (igual que al mètode textAAudio)
        // let veu = 'alloy'; // veu per defecte
        const veu = this.veuOriginal;

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                voice: veu,
                input: text
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error en convertir text a àudio original: ${error.error?.message || response.statusText}`);
        }

        const audioBlob = await response.blob();
        return audioBlob;
    }
    
    async provarVeu(veu) {
        // Text de mostra per escoltar la veu
        const textProva = "Hola, això és una mostra de la veu escollida. Perquè et facis una idea de com sona!";
        
        try {
            // Verifica que hi ha una clau API configurada
            if (!this.apiKey) {
                throw new Error('Cal configurar la clau API d\'OpenAI primer.');
            }
            
            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    voice: veu,
                    input: textProva
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error en generar àudio de prova: ${error.error?.message || response.statusText}`);
            }

            const audioBlob = await response.blob();
            return audioBlob;
        } catch (error) {
            console.error('Error provant la veu:', error);
            throw error;
        }
    }
}
