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


export function obtenirTraduccioIdioma(idioma='ca', clau=null) {

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
            'placeholder_api_key': "Introdueix la teva clau API d'OpenAI aquí...",
            'error_generar_audio_prova': 'Error en generar àudio de prova: ',
            'avis_falta_clau_api': 'Cal configurar la clau API d\'OpenAI primer.',
            'transcrivint_audio': 'Transcrivint àudio...',
            'traduint_text': 'Traduint text...',
            'generant_audio': 'Generant àudio...',
            'error_processar_audio': "Error en processar l'àudio",
            'avis_navegador_audio': "El teu navegador no suporta l'element d'àudio.",
            'avis_introduir_text': 'Si us plau, introdueix algun text per traduir.',
            'generant_audio_original': 'Generant àudio original...',
            'generant_audio_traduit': 'Generant àudio traduït...',
            'error_processar_text': "Error en processar el text",
            'puja_imatge_primer': 'Si us plau, puja una imatge primer.',
            'avis_imatge_maxima_5mb': 'La imatge és massa gran. Mida màxima permesa: 5MB',
            'avis_format_imatge': "Format d'imatge no suportat. Si us plau, utilitza PNG, JPG o JPEG.",
            'avis_no_text_a_audio': 'No hi ha text per convertir a àudio.',
            'erro_generar_audio': 'Error en generar àudio: ',
            'escoltar_traduccio': 'Escoltar traducció',
            'extraient_text_imatge': 'Extraient text de la imatge...',
            'no_hi_ha_text': 'no hi ha text',
            'no_text': 'no text',
            'no_detectat_text': "No s'ha detectat text a la imatge.",
            'error_processar_imatge': 'Error en processar la imatge',
            'label_matge': 'Imatge',
            'label_text_original': 'Text original',
            'label_text_traduccio': 'Traducció:',
            'text_de_prova_veu': "Hola, això és una mostra de la veu escollida. Perquè et facis una idea de com sona!",
            'navegador_no_compatible': 'Navegador no compatible',
            'navegador_no_compatible_microfon': "El teu navegador no suporta l'accés al micròfon. Prova amb Chrome, Firefox o Safari.",
            'no_acces_microfon': "No s'ha pogut accedir al micròfon.",
            'avis_us_microfon_1': '\n\nHas denegat el permís al micròfon. Per activar-lo:\n',
            'avis_us_microfon_2': "1. Fes clic a la icona del cadenat a la barra d'adreces\n",
            'avis_us_microfon_3': '2. Canvia el permís del micròfon a "Permet"\n',
            'avis_us_microfon_4': '3. Recarrega la pàgina',
            'avis_us_microfon_5': "\n\nNo s'ha trobat cap micròfon. Assegura't que en tens un connectat.",
            'avis_us_microfon_6': '\n\nEl micròfon està sent utilitzat per una altra aplicació.',
            'aturar_gravacio': 'Aturar gravació',
            'començar_gravacio': 'Començar gravació',   

            'camera': 'Usar càmera',
            'capturar': 'Capturar',
            'extreure_traduir': 'Extreure i traduir text',
            'descarregar_imatge': 'Descarregar imatge',
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

            'placeholder_entrada_text': 'Write the text you want to translate...',
            'placeholder_api_key': 'Enter your OpenAI API key here...',
            'error_generar_audio_prova': 'Error generating test audio: ',
            'avis_falta_clau_api': 'You need to configure the OpenAI API key first.',
            'transcrivint_audio': 'Transcribing audio...',
            'traduint_text': 'Translating text...',
            'generant_audio': 'Generating audio...',
            'error_processar_audio': 'Error processing the audio',
            'avis_navegador_audio': 'Your browser does not support the audio element.',
            'avis_introduir_text': 'Please enter some text to translate.',
            'generant_audio_original': 'Generating original audio...',
            'generant_audio_traduit': 'Generating translated audio...',
            'error_processar_text': 'Error processing the text',
            'puja_imatge_primer': 'Please upload an image first.',
            'avis_imatge_maxima_5mb': 'The image is too large. Maximum allowed size: 5MB',
            'avis_format_imatge': 'Unsupported image format. Please use PNG, JPG or JPEG.',
            'avis_no_text_a_audio': 'There is no text to convert to audio.',
            'erro_generar_audio': 'Error generating audio: ',
            'escoltar_traduccio': 'Listen to translation',
            'extraient_text_imatge': 'Extracting text from image...',
            'no_hi_ha_text': 'there is no text',
            'no_text': 'no text',
            'no_detectat_text': 'No text has been detected in the image.',
            'error_processar_imatge': 'Error processing the image',
            'label_matge': 'Image',
            'label_text_original': 'Original text',
            'label_text_traduccio': 'Translation:',
            'text_de_prova_veu': 'Hello, this is a sample of the chosen voice. Just so you get an idea of how it sounds!',
            'navegador_no_compatible': 'Incompatible browser',
            'navegador_no_compatible_microfon': 'Your browser does not support microphone access. Try with Chrome, Firefox or Safari.',
            'no_acces_microfon': 'Could not access the microphone.',
            'avis_us_microfon_1': '\n\nYou have denied microphone permission. To enable it:\n',
            'avis_us_microfon_2': '1. Click on the padlock icon in the address bar\n',
            'avis_us_microfon_3': '2. Change the microphone permission to "Allow"\n',
            'avis_us_microfon_4': '3. Reload the page',
            'avis_us_microfon_5': '\n\nNo microphone was found. Make sure you have one connected.',
            'avis_us_microfon_6': '\n\nThe microphone is being used by another application.',
            'aturar_gravacio': 'Stop recording',
            'començar_gravacio': 'Start recording',

            'camera': 'Use camera',
            'capturar': 'Capture',
            'extreure_traduir': 'Extract and translate text',
             'descarregar_imatge': 'Download image',
   
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

            'placeholder_entrada_text': "Écrivez le texte que vous souhaitez traduire...",
            'placeholder_api_key': "Saisissez votre clé API d'OpenAI ici...",
            'error_generar_audio_prova': "Erreur lors de la génération de l'audio de test : ",
            'avis_falta_clau_api': "Il faut configurer la clé API d'OpenAI d'abord.",
            'transcrivint_audio': "Transcription audio en cours...",
            'traduint_text': "Traduction du texte en cours...",
            'generant_audio': "Génération audio en cours...",
            'error_processar_audio': "Erreur lors du traitement de l'audio",
            'avis_navegador_audio': "Votre navigateur ne prend pas en charge l'élément audio.",
            'avis_introduir_text': "Veuillez introduire du texte à traduire.",
            'generant_audio_original': "Génération de l'audio original en cours...",
            'generant_audio_traduit': "Génération de l'audio traduit en cours...",
            'error_processar_text': "Erreur lors du traitement du texte",
            'puja_imatge_primer': "Veuillez télécharger une image d'abord.",
            'avis_imatge_maxima_5mb': "L'image est trop grande. Taille maximale autorisée : 5MB",
            'avis_format_imatge': "Format d'image non supporté. Veuillez utiliser PNG, JPG ou JPEG.",
            'avis_no_text_a_audio': "Il n'y a pas de texte à convertir en audio.",
            'erro_generar_audio': "Erreur lors de la génération audio : ",
            'escoltar_traduccio': "Écouter la traduction",
            'extraient_text_imatge': "Extraction du texte de l'image...",
            'no_hi_ha_text': "il n'y a pas de texte",
            'no_text': "pas de texte",
            'no_detectat_text': "Aucun texte n'a été détecté dans l'image.",
            'error_processar_imatge': "Erreur lors du traitement de l'image",
            'label_matge': "Image",
            'label_text_original': "Texte original",
            'label_text_traduccio': "Traduction :",
            'text_de_prova_veu': "Bonjour, ceci est un échantillon de la voix choisie. Pour vous donner une idée de comment elle sonne !",
            'navegador_no_compatible': "Navigateur non compatible",
            'navegador_no_compatible_microfon': "Votre navigateur ne prend pas en charge l'accès au microphone. Essayez avec Chrome, Firefox ou Safari.",
            'no_acces_microfon': "Impossible d'accéder au microphone.",
            'avis_us_microfon_1': "\n\nVous avez refusé l'autorisation du microphone. Pour l'activer :\n",
            'avis_us_microfon_2': "1. Cliquez sur l'icône du cadenas dans la barre d'adresse\n",
            'avis_us_microfon_3': "2. Changez l'autorisation du microphone à \"Autoriser\"\n",
            'avis_us_microfon_4': "3. Rechargez la page",
            'avis_us_microfon_5': "\n\nAucun microphone n'a été trouvé. Assurez-vous que vous en avez un connecté.",
            'avis_us_microfon_6': "\n\nLe microphone est utilisé par une autre application.",
            'aturar_gravacio': "Arrêter l'enregistrement",
            'començar_gravacio': "Commencer l'enregistrement",

            'camera': 'Utiliser la caméra',
            'capturar': 'Capturer',
            'extreure_traduir': 'Extraire et traduire le texte',
            'descarregar_imatge': "Télécharger l'image",
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

            'placeholder_entrada_text': 'Escribe el texto que quieres traducir...',
            'placeholder_api_key': 'Introduce tu clave API de OpenAI aquí...',
            'error_generar_audio_prova': 'Error al generar audio de prueba: ',
            'avis_falta_clau_api': 'Es necesario configurar la clave API de OpenAI primero.',
            'transcrivint_audio': 'Transcribiendo audio...',
            'traduint_text': 'Traduciendo texto...',
            'generant_audio': 'Generando audio...',
            'error_processar_audio': 'Error al procesar el audio',
            'avis_navegador_audio': 'Tu navegador no soporta el elemento de audio.',
            'avis_introduir_text': 'Por favor, introduce algún texto para traducir.',
            'generant_audio_original': 'Generando audio original...',
            'generant_audio_traduit': 'Generando audio traducido...',
            'error_processar_text': 'Error al procesar el texto',
            'puja_imatge_primer': 'Por favor, sube una imagen primero.',
            'avis_imatge_maxima_5mb': 'La imagen es demasiado grande. Tamaño máximo permitido: 5MB',
            'avis_format_imatge': 'Formato de imagen no soportado. Por favor, utiliza PNG, JPG o JPEG.',
            'avis_no_text_a_audio': 'No hay texto para convertir a audio.',
            'erro_generar_audio': 'Error al generar audio: ',
            'escoltar_traduccio': 'Escuchar traducción',
            'extraient_text_imatge': 'Extrayendo texto de la imagen...',
            'no_hi_ha_text': 'no hay texto',
            'no_text': 'sin texto',
            'no_detectat_text': 'No se ha detectado texto en la imagen.',
            'error_processar_imatge': 'Error al procesar la imagen',
            'label_matge': 'Imagen',
            'label_text_original': 'Texto original',
            'label_text_traduccio': 'Traducción:',
            'text_de_prova_veu': '¡Hola, esto es una muestra de la voz elegida. ¡Para que te hagas una idea de cómo suena!',
            'navegador_no_compatible': 'Navegador no compatible',
            'navegador_no_compatible_microfon': 'Tu navegador no soporta el acceso al micrófono. Prueba con Chrome, Firefox o Safari.',
            'no_acces_microfon': 'No se ha podido acceder al micrófono.',
            'avis_us_microfon_1': '\n\nHas denegado el permiso al micrófono. Para activarlo:\n',
            'avis_us_microfon_2': '1. Haz clic en el icono del candado en la barra de direcciones\n',
            'avis_us_microfon_3': '2. Cambia el permiso del micrófono a "Permitir"\n',
            'avis_us_microfon_4': '3. Recarga la página',
            'avis_us_microfon_5': '\n\nNo se ha encontrado ningún micrófono. Asegúrate de que tienes uno conectado.',
            'avis_us_microfon_6': '\n\nEl micrófono está siendo utilizado por otra aplicación.',
            'aturar_gravacio': 'Detener grabación',
            'començar_gravacio': 'Comenzar grabación',

            'camera': 'Usar cámara',
            'capturar': 'Capturar',
            'extreure_traduir': 'Extraer y traducir texto',
            'descarregar_imatge': 'Descargar imagen'
        }
    };

    if(!clau){
        return traduccions[idioma] || traduccions['ca'];
    }

    return traduccions[idioma][clau] || '';
}

export function obtemirIdiomaInterficie() {
    // Obtenim l'idioma seleccionat de l'emmagatzematge local
    const idioma = localStorage.getItem('idioma-interficie') || 'ca'; // català per defecte
    return idioma;
}

export function traduirInterficie(idioma) {
    
    
    // Si l'idioma no existeix, utilitzar català per defecte
    // const textos = traduccions[idioma] || traduccions['ca'];
    const textos = obtenirTraduccioIdioma(idioma)
    
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


export function traduccionsLabels(clau){

    const idioma = obtemirIdiomaInterficie()
    return obtenirTraduccioIdioma(idioma, clau)

}

// Funció per obtenir l'idioma actual de la interfície
export function obtenirIdiomaInterficie() {
    return localStorage.getItem('idioma-interficie') || 'ca';
}