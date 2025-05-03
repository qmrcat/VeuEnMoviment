// Funció per ordenar un array d'objectes per una columna (alfabèticament)
export function ordenarIdiomesPerColumna(array, columna) {
    return [...array].sort((a, b) => {
        const valA = (a[columna] || '').toString().toLowerCase();
        const valB = (b[columna] || '').toString().toLowerCase();
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });
}


export function generarOptionsSelect(json, columnaOrdenacio = '') {
    
    let options = '';
    let jsonOrdenat
    if (columnaOrdenacio !== '') {
        jsonOrdenat = ordenarIdiomesPerColumna(json, columnaOrdenacio);
    } else {
        jsonOrdenat = [...json];
    }   

    // Recorrem cada idioma del JSON
    jsonOrdenat.forEach(row => {
        // Construïm cada option amb el format demanat
        options += `<option data-codi="${row.codi}" value="${row.angles}">${row.catala}</option>\n`;
    });
    
    return options;
}

/**
 * Funció que genera i insereix les opcions d'un select HTML a partir d'un JSON d'idiomes
 * @param {string} selectId - ID de l'element select on s'inseriran les opcions
 * @param {Array} options - cadena amb les opcions generades
 * @returns {boolean} Retorna true si s'han inserit correctament, false en cas contrari
 */
export function inserirOptionsSelect(selectId, options) {
    // Obtenim l'element select a partir del seu ID
    const selectElement = document.getElementById(selectId);
    
    // Comprovem que l'element existeixi
    if (!selectElement) {
        console.error(`No s'ha trobat cap element amb l'ID: ${selectId}`);
        return false;
    }
    
    // Inserim les opcions al select
    selectElement.innerHTML = options;
    
    return true;
}

export function omplirSelectsIdiomes(idiomesJSON) {
    // Generem les opcions per al select d'idiomes originals i de traducció
    const optionAutodetectar = '<option data-codi="--" value="autodetection">autodetecció</option>'
    const optionsIdioma = generarOptionsSelect(idiomesJSON, "catala")
    
    //frontend
    inserirOptionsSelect("idioma-original", optionAutodetectar + optionsIdioma)
    inserirOptionsSelect("idioma-traduccio", optionsIdioma)

    //Configuracio
    inserirOptionsSelect("idioma-origen", optionAutodetectar + optionsIdioma)
    inserirOptionsSelect("idioma-desti", optionsIdioma)
}

export function traduirInterficie(idioma) {
    const traduccions = {
        'ca': {
            'config_api': 'Configuració API',
            'config_api_key': 'Clau API d\'OpenAI',
            'mostrar_clau': 'Mostrar clau',
            'desar_config': 'Desar configuració',
            'boto_gravacio': 'Començar gravació',
            'aturar_gravacio': 'Aturar gravació',
            'cancelar': 'Cancel·lar',
            'microfon': 'Micròfon',
            'text': 'Text',
            'imatge': 'Imatge',
            'botonauto': 'Navegador no compatible',
            'subtitol':'Traductor de veu, text i imatges en temps real',
            'idioma_original': 'Idioma original',
            'idioma_traduit': 'Idioma traduït',
            'permis_micro': 'Quan facis clic, el navegador et demanarà permís per accedir al micròfon',
            'traduir_generar_audio': 'Traduir i generar àudio',
            'pujar_imatge_missatge_negreta': 'Fes clic per pujar',
            'pujar_imatge_missatge': 'o arrossega i deixa anar',
            'pujar_imatge_fitxers': 'PNG, JPG o JPEG (MAX. 5MB)',
            'historial_traduccions': 'Historial de traduccions',
            'extreure_traduir_text': 'Extreure i traduir text',
            'temps_audio': 'Temps',
            'processant_traduccio': 'Processant traducció...',
            'resultats_traduccio': 'Resultats de la traducció',
            'text_detectat_original': 'Text detectat (original)',
            'text_traduit': 'Text traduït',
            'escoltar_traduccio': 'Escoltar traducció',
            'descarregar_audio': 'Descarregar àudio',
            'descarregar': 'Descarregar',
            'transcripcio_original': 'Transcripció original',
            'traduccio': 'Traducció',

            'placeholder_entrada_text': 'Escriu el text que vols traduir...',
        },
        'en': {
            'config_api': 'API Configuration',
            'config_api_key': 'OpenAI API Key',
            'mostrar_clau': 'Show key',
            'desar_config': 'Save configuration',
            'boto_gravacio': 'Start recording',
            'aturar_gravacio': 'Stop recording',
            'cancelar': 'Cancel',
            'microfon': 'Microphone',
            'text': 'Text',
            'imatge': 'Image',
            'botonauto': 'Browser not compatible',
            'subtitol': 'Real-time voice, text and image translator',
            'idioma_original': 'Original language',
            'idioma_traduit': 'Translated language',
            'permis_micro': 'When you click, the browser will ask for permission to access the microphone',
            'traduir_generar_audio': 'Translate and generate audio',
            'pujar_imatge_missatge_negreta': 'Click to upload',
            'pujar_imatge_missatge': 'or drag and drop',
            'pujar_imatge_fitxers': 'PNG, JPG or JPEG (MAX. 5MB)',
            'historial_traduccions': 'Translation history',
            'extreure_traduir_text': 'Extract and translate text',
            'temps_audio': 'Time',
            'processant_traduccio': 'Processing translation...',
            'resultats_traduccio': 'Translation results',
            'text_detectat_original': 'Detected text (original)',
            'text_traduit': 'Translated text',
            'escoltar_traduccio': 'Listen to translation',
            'descarregar_audio': 'Download audio',
            'descarregar': 'Download',
            'transcripcio_original': 'Original transcription',
            'traduccio': 'Translation',

            'clau_api': "OpenAI API Key",
            'mostrar_clau_api': 'Show key',
            'missatge_descrip_api_navegador': "The API key will be saved locally in your browser and will never be sent to our server.",
            'missatge_descrip_api': "If you don't have an OpenAI API key, you can get one at",
            'missatge_descrip_api_url': 'platform.openai.com',
            'avis_pagament_api': 'requires payment',
            'missatge_consulta_api': 'If you want to check usage or see your remaining credit, go to',
            'missatge_consulta_api_url': 'platform.openai.com/usage',
            'configuracio_veus': 'Voice configuration',
            'veu_original': 'Original voice',
            'escolta': 'Listen:',
            'veu_traduccio': 'Translation voice',
            'configuració_idiomes': "Language configuration",
            'idioma_a_traduir': 'Language to translate',
            'desar_configuracio': 'Save configuration',

            'placeholder_entrada_text': 'Escriu el text que vols traduir...',
        },
        'fr': {
            'config_api': 'Configuration API',
            'config_api_key': 'Clé API OpenAI',
            'mostrar_clau': 'Afficher la clé',
            'desar_config': 'Enregistrer la configuration',
            'boto_gravacio': 'Commencer l\'enregistrement',
            'aturar_gravacio': 'Arrêter l\'enregistrement',
            'cancelar': 'Annuler',
            'microfon': 'Microphone',
            'text': 'Texte',
            'imatge': 'Image',
            'botonauto': 'Navigateur non compatible',
            'subtitol': 'Traducteur de voix, texte et images en temps réel',
            'idioma_original': 'Langue originale',
            'idioma_traduit': 'Langue traduite',
            'permis_micro': 'Lorsque vous cliquez, le navigateur vous demandera l\'autorisation d\'accéder au microphone',
            'traduir_generar_audio': 'Traduire et générer l\'audio',
            'pujar_imatge_missatge_negreta': 'Cliquez pour télécharger',
            'pujar_imatge_missatge': 'ou faites glisser et déposez',
            'pujar_imatge_fitxers': 'PNG, JPG ou JPEG (MAX. 5Mo)',
            'historial_traduccions': 'Historique des traductions',
            'extreure_traduir_text': 'Extraire et traduire le texte',
            'temps_audio': 'Temps',
            'processant_traduccio': 'Traitement de la traduction...',
            'resultats_traduccio': 'Résultats de la traduction',
            'text_detectat_original': 'Texte détecté (original)',
            'text_traduit': 'Texte traduit',
            'escoltar_traduccio': 'Écouter la traduction',
            'descarregar_audio': 'Télécharger l\'audio',
            'descarregar': 'Télécharger',
            'transcripcio_original': 'Transcription originale',
            'traduccio': 'Traduction',

            'clau_api': "Clé API OpenAI",
            'mostrar_clau_api': 'Afficher la clé',
            'missatge_descrip_api_navegador': "La clé API sera enregistrée localement dans votre navigateur et ne sera jamais envoyée à notre serveur.",
            'missatge_descrip_api': "Si vous n'avez pas de clé API OpenAI, vous pouvez en obtenir une sur",
            'missatge_descrip_api_url': 'platform.openai.com',
            'avis_pagament_api': 'nécessite un paiement',
            'missatge_consulta_api': "Si vous souhaitez consulter la consommation ou savoir le crédit qu'il vous reste, rendez-vous sur",
            'missatge_consulta_api_url': 'platform.openai.com/usage',
            'configuracio_veus': 'Configuration des voix',
            'veu_original': 'Voix originale',
            'escolta': 'Écoute :',
            'veu_traduccio': 'Voix de traduction',
            'configuració_idiomes': "Configuration des langues",
            'idioma_a_traduir': 'Langue à traduire',
            'desar_configuracio': 'Enregistrer la configuration',

            'placeholder_entrada_text': 'Escriu el text que vols traduir...',
        },
        'es': {
            'config_api': 'Configuración API',
            'config_api_key': 'Clave API de OpenAI',
            'mostrar_clau': 'Mostrar clave',
            'desar_config': 'Guardar configuración',
            'boto_gravacio': 'Comenzar grabación',
            'aturar_gravacio': 'Detener grabación',
            'cancelar': 'Cancelar',
            'microfon': 'Micrófono',
            'text': 'Texto',
            'imatge': 'Imagen',
            'botonauto': 'Navegador no compatible',
            'subtitol':'Traductor de voz, texto e imágenes en tiempo real',
            'idioma_original': 'Idioma original',
            'idioma_traduit': 'Idioma traducido',
            'permis_micro': 'Cuando hagas clic, el navegador te pedirá permiso para acceder al micrófono',
            'traduir_generar_audio': 'Traducir y generar audio',
            'pujar_imatge_missatge_negreta': 'Haz clic para subir',
            'pujar_imatge_missatge': 'o arrastra y suelta',
            'pujar_imatge_fitxers': 'PNG, JPG o JPEG (MÁX. 5MB)',
            'historial_traduccions': 'Historial de traducciones',
            'extreure_traduir_text': 'Extraer y traducir texto',
            'temps_audio': 'Tiempo',
            'processant_traduccio': 'Procesando traducción...',
            'resultats_traduccio': 'Resultados de la traducción',
            'text_detectat_original': 'Texto detectado (original)',
            'text_traduit': 'Texto traducido',
            'escoltar_traduccio': 'Escuchar traducción',
            'descarregar_audio': 'Descargar audio',
            'descarregar': 'Descargar',
            'transcripcio_original': 'Transcripción original',
            'traduccio': 'Traducción',

            'clau_api': "Clave API de OpenAI",
            'mostrar_clau_api': 'Mostrar clave',
            'missatge_descrip_api_navegador': "La clave API se guardará localmente en tu navegador y nunca se enviará a nuestro servidor.",
            'missatge_descrip_api': "Si no tienes una clave API de OpenAI, puedes obtener una en",
            'missatge_descrip_api_url': 'platform.openai.com',
            'avis_pagament_api': 'requiere un pago',
            'missatge_consulta_api': 'Si quieres consultar el consumo o saber el crédito que te queda ve a',
            'missatge_consulta_api_url': 'platform.openai.com/usage',
            'configuracio_veus': 'Configuración de voces',
            'veu_original': 'Voz original',
            'escolta': 'Escucha:',
            'veu_traduccio': 'Voz de traducción',
            'configuració_idiomes': "Configuración de idiomas",
            'idioma_a_traduir': 'Idioma a traducir',
            'desar_configuracio': 'Guardar configuración',

            'placeholder_entrada_text': 'Escriu el text que vols traduir...',
        }
    };
    
    // Si l'idioma no existeix, utilitzar català per defecte
    const textos = traduccions[idioma] || traduccions['ca'];
    
    // Actualitzar els textos de la interfície
    document.querySelectorAll('[data-traduccio]').forEach(element => {
        const clau = element.getAttribute('data-traduccio');
        if (textos[clau]) {
            element.textContent = textos[clau];
        }
    });

    // Actualitzar els placeholders
    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const clau = element.getAttribute('data-placeholder');
        if (textos[clau]) {
            element.setAttribute('placeholder', textos[clau]);
        }
    });
    
    // Guardar l'idioma seleccionat
    localStorage.setItem('idioma-interficie', idioma);
    
    return true;
}

// Funció per obtenir l'idioma actual de la interfície
export function obtenirIdiomaInterficie() {
    return localStorage.getItem('idioma-interficie') || 'ca';
}