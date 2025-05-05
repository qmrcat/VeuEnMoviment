import { GestorAudio } from './audio.js';
import { GestorOpenAI } from './openai.js';


// Classe principal de l'aplicació
export class AplicacioTraductor {
    constructor() {
        this.gestorAudio = new GestorAudio();
        this.gestorOpenAI = new GestorOpenAI();
        
        
        // Variables per emmagatzemar la transcripció i traducció
        this.ultimaTranscripcio = '';
        this.ultimaTraduccio = '';

        // Variables per emmagatzemar els blobs d'àudio (afegit nou)
        this.ultimAudioOriginal = null;
        this.ultimAudioTraduit = null;

        this.ultimTraduccioImatge = null;

        // Comprovar si és la primera visita
        this.primeraVisita = localStorage.getItem('primera-visita') === null;
        if (this.primeraVisita) {
            localStorage.setItem('primera-visita', 'false');
        }
        
        this.inicialitzar();
    }

    
    inicialitzar() {

        // Comprovar si l'API està configurada
        this.comprovarConfiguracio();
        
        // Configurar elements de la UI
        this.configUiElements();

        // Configurar el botó d'intercanvi d'idiomes
        this.configurarBotoIntercanvi();
        
        // Configurar callback d'àudio
        this.gestorAudio.setOnAudioEnregistrat((blob) => {
            this.processarAudio(blob);
        });

        // Configurar el canvi de mode (afegit nou)
        // this.configurarModes();
        // Configurar el canvi de mode (si has afegit aquesta funcionalitat)
        if (typeof this.configurarModes === 'function') {
            this.configurarModes();
        }
        
        // Configurar botons de descàrrega (afegit nou)
        this.configurarBotonsDescarrega();

        // Configurar selector d'idioma
        this.configurarSelectorIdioma();

    }
    
    // Afegir aquest nou mètode a la classe AplicacioTraductor
    configurarSelectorIdioma() {
        const selectorIdioma = document.getElementById('idioma-interficie');
        if (selectorIdioma) {
            // Carregar l'idioma desat o utilitzar català per defecte
            const idiomaActual = localStorage.getItem('idioma-interficie') || 'ca';
            selectorIdioma.value = idiomaActual;
            
            // Aplicar traduccions
            import('./utils.js').then(module => {
                module.traduirInterficie(idiomaActual);
                
                // Afegir listener al selector d'idioma
                selectorIdioma.addEventListener('change', (e) => {
                    const idioma = e.target.value;
                    module.traduirInterficie(idioma);
                });
            });
        }
    }
    
    comprovarConfiguracio() {
        const avisApi = document.getElementById('avis-api');
        
        if (!this.gestorOpenAI.isConfigured()) {
            avisApi.classList.remove('hidden');

            // Actualitzar el contingut del missatge si és la primera visita
            if (this.primeraVisita) {
                const missatgeAvis = document.getElementById('missatge-avis');
                if (missatgeAvis) {
                    missatgeAvis.innerHTML = `
                        <p class="text-sm text-yellow-700 dark:text-yellow-200 mb-2">
                            <strong>Català:</strong> Necessites configurar la teva clau API d'OpenAI per utilitzar l'aplicació.
                            <button id="configura-api-ca" class="font-medium underline ml-1 focus:outline-none cursor-pointer">
                                Configurar ara
                            </button>
                        </p>
                        <p class="text-sm text-yellow-700 dark:text-yellow-200 mb-2">
                            <strong>English:</strong> You need to set up your OpenAI API key to use the application.
                            <button id="configura-api-en" class="font-medium underline ml-1 focus:outline-none cursor-pointer">
                                Configure now
                            </button>
                        </p>
                        <p class="text-sm text-yellow-700 dark:text-yellow-200 mb-2">
                            <strong>Français:</strong> Vous devez configurer votre clé API OpenAI pour utiliser l'application.
                            <button id="configura-api-fr" class="font-medium underline ml-1 focus:outline-none cursor-pointer">
                                Configurer maintenant
                            </button>
                        </p>
                        <p class="text-sm text-yellow-700 dark:text-yellow-200">
                            <strong>Español:</strong> Necesitas configurar tu clave API de OpenAI para utilizar la aplicación.
                            <button id="configura-api-es" class="font-medium underline ml-1 focus:outline-none cursor-pointer">
                                Configurar ahora
                            </button>
                        </p>
                    `;
                    
                    // Afegir event listeners als botons en diferents idiomes
                    document.getElementById('configura-api-ca').addEventListener('click', () => {
                        this.mostrarModalConfiguracio();
                    });
                    document.getElementById('configura-api-en').addEventListener('click', () => {
                        this.mostrarModalConfiguracio();
                    });
                    document.getElementById('configura-api-fr').addEventListener('click', () => {
                        this.mostrarModalConfiguracio();
                    });
                    document.getElementById('configura-api-es').addEventListener('click', () => {
                        this.mostrarModalConfiguracio();
                    });
                }
            }
        } else {
            avisApi.classList.add('hidden');
        }
    }
    
    configUiElements() {
        // Botó de configuració
        const botoConfig = document.getElementById('boto-configuracio');
        const modalConfig = document.getElementById('modal-configuracio');
        const tancaModal = document.getElementById('tanca-modal');
        const tancaConfig = document.getElementById('tanca-configuracio');
        const configuraApi = document.getElementById('configura-api');
        
        botoConfig.addEventListener('click', () => {
            this.gestorOpenAI.getUsApiKeyFacturacio()
            this.mostrarModalConfiguracio();
        });
        
        tancaModal.addEventListener('click', () => {
            modalConfig.classList.add('hidden');
        });
        
        tancaConfig.addEventListener('click', () => {
            modalConfig.classList.add('hidden');
        });
        
        // configuraApi.addEventListener('click', () => {
        //     this.mostrarModalConfiguracio();
        // });
        if (configuraApi) {
            configuraApi.addEventListener('click', () => {
                this.mostrarModalConfiguracio();
            });
        }

        // Formulari API
        const formApi = document.getElementById('form-api');
        const apiKeyInput = document.getElementById('api-key');
        const mostrarApiKey = document.getElementById('mostrar-api-key');
        const veuOriginalSelect = document.getElementById('veu-original');
        const veuTraduida = document.getElementById('veu-traduida');

        const idiomaOriginalDef = document.getElementById('idioma-original');
        const idiomaTraduccioDef = document.getElementById('idioma-traduccio');
        
        // Carregar la clau API si existeix
        apiKeyInput.value = this.gestorOpenAI.getApiKey();

        // Carregar les veus configurades
        veuOriginalSelect.value = this.gestorOpenAI.getVeuOriginal();
        veuTraduida.value = this.gestorOpenAI.getVeuTraduida();

        
        formApi.addEventListener('submit', (e) => {
            e.preventDefault();
            this.gestorOpenAI.setApiKey(apiKeyInput.value);
            this.gestorOpenAI.setVeuOriginal(veuOriginalSelect.value);
            this.gestorOpenAI.setVeuTraduida(veuTraduida.value);
            this.gestorOpenAI.setIdiomaOriginal(idiomaOriginalDef.value);
            this.gestorOpenAI.setIdiomaTraduccio(idiomaTraduccioDef.value);
            modalConfig.classList.add('hidden');
            this.comprovarConfiguracio();
        });
        
        mostrarApiKey.addEventListener('change', (e) => {
            apiKeyInput.type = e.target.checked ? 'text' : 'password';
        });

        // Configurar els botons de prova de veu
        this.configurarBotonsProvaVeu();
        
        // Assegurar-nos que l'indicador d'estat està ocult a l'inici
        const estatTraduccio = document.getElementById('estat-traduccio');
        estatTraduccio.classList.add('hidden');
    }
    
    mostrarModalConfiguracio() {
        const modalConfig = document.getElementById('modal-configuracio');
        modalConfig.classList.remove('hidden');

    }

    configurarBotonsProvaVeu() {
        const botoProvaVeuOriginal = document.getElementById('prova-veu-original');
        const botoProvaVeuTraduida = document.getElementById('prova-veu-traduida');
        const provaVeuContainer = document.getElementById('prova-veu-container');
        const provaVeuReproductor = document.getElementById('prova-veu-reproductor');
        
        // Variable per emmagatzemar l'últim blob d'àudio generat
        let reproduintAudio = false;
        
        const provarVeu = async (selectId, boto) => {
            try {
                // Verificar si hi ha una reproducció en curs
                if (reproduintAudio) {
                    provaVeuReproductor.pause();
                    provaVeuReproductor.currentTime = 0;
                    provaVeuContainer.classList.add('hidden');
                    reproduintAudio = false;
                    return;
                }
                
                // Obtenir la veu seleccionada
                const selectVeu = document.getElementById(selectId);
                const veuSeleccionada = selectVeu.value;
                
                // Mostrar indicador de càrrega
                boto.disabled = true;
                boto.classList.add('opacity-50');
                
                // Reemplaçar icona amb un spinner
                boto.innerHTML = `
                    <svg class="animate-spin h-5 w-5 text-gray-700 dark:text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                `;
                
                // Generar àudio de mostra
                const audioBlob = await this.gestorOpenAI.provarVeu(veuSeleccionada);
                
                // Configurar el reproductor d'àudio
                const audioUrl = URL.createObjectURL(audioBlob);
                provaVeuReproductor.src = audioUrl;
                provaVeuContainer.classList.remove('hidden');
                
                // Reproduir automàticament
                await provaVeuReproductor.play();
                reproduintAudio = true;
                
                // Configurar esdeveniment per netejar quan l'àudio acabi
                provaVeuReproductor.onended = () => {
                    reproduintAudio = false;
                };
                
            } catch (error) {
                console.error('Error en provar veu:', error);
                // alert('Error en generar àudio de prova: ' + error.message);
                alert(traduccionsLabels('error_generar_audio_prova') + error.message);
            } finally {
                // Restaurar l'estat del botó
                boto.disabled = false;
                boto.classList.remove('opacity-50');
                boto.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                `;
            }
        };
        
        // Configurar els botons de prova
        botoProvaVeuOriginal.addEventListener('click', () => {
            provarVeu('veu-original', botoProvaVeuOriginal);
        });
        
        botoProvaVeuTraduida.addEventListener('click', () => {
            provarVeu('veu-traduida', botoProvaVeuTraduida);
        });
    }

    
    async processarAudio(blob) {

        if (!this.gestorOpenAI.isConfigured()) {
            // alert('Cal configurar la clau API d\'OpenAI primer.');
            alert(traduccionsLabels('avis_falta_clau_api'));
            this.mostrarModalConfiguracio();
            return;
        }

        try {
            // Guardar l'àudio original
            const audioOriginal = blob;
            
            // Mostrar el loader de càrrega
            this.mostrarEstatProcessant(traduccionsLabels('transcrivint_audio'));
            
            // 1. Transcriure àudio original a text
            const transcripcio = await this.gestorOpenAI.transcriureAudio(blob);
            console.log('Transcripció:', transcripcio);
            
            // Actualitzar estat
            // this.mostrarEstatProcessant('Traduint text...');
            this.mostrarEstatProcessant(traduccionsLabels('traduint_text'));
            
            // 2. Traduir el text a l'idioma destí
            const idiomaOrigen = document.getElementById('idioma-origen').value;
            const idiomaDesti = document.getElementById('idioma-desti').value;
            const traduccio = await this.gestorOpenAI.traduirText(transcripcio, idiomaOrigen, idiomaDesti);
            console.log('Traducció:', traduccio);
            
            // Mostrar textos
            this.mostrarTextos(transcripcio, traduccio);
            
            // Actualitzar estat
            // this.mostrarEstatProcessant('Generant àudio...');
            this.mostrarEstatProcessant(traduccionsLabels('generant_audio'));
            
            // 3. Convertir la traducció a àudio
            const audioTraduit = await this.gestorOpenAI.textAAudio(traduccio, idiomaDesti);
            
            // Reproduir àudio traduït i original
            this.reproduirAudios(audioOriginal, audioTraduit);
        } catch (error) {
            console.error('Error en el procés de traducció:', error);
            // const missatgeError = error.message || "Error en processar l'àudio";
            const missatgeError = error.message || traduccionsLabels('error_processar_audio');
            
            const estatTraduccio = document.getElementById('estat-traduccio');
            const missatgeEstat = document.getElementById('missatge-estat');
            
            missatgeEstat.textContent = missatgeError;
            
            // Canviar l'estil del loader per indicar error
            const loader = document.getElementById('loader-traduccio');
            loader.classList.remove('border-blue-500', 'animate-spin');
            loader.classList.add('border-red-500');
            
            setTimeout(() => {
                estatTraduccio.classList.add('hidden');
                // Restablir el loader
                loader.classList.remove('border-red-500');
                loader.classList.add('border-blue-500', 'animate-spin');
            }, 5000);
        }
    }
    
    mostrarEstatProcessant(missatge) {
        const estatTraduccio = document.getElementById('estat-traduccio');
        const missatgeEstat = document.getElementById('missatge-estat');
        
        estatTraduccio.classList.remove('hidden');
        missatgeEstat.textContent = missatge;
    }
    
    mostrarTextos(transcripcio, traduccio) {
        this.ultimaTranscripcio = transcripcio;
        this.ultimaTraduccio = traduccio;
        
        const contenidorTextos = document.getElementById('textos-traduccio');
        contenidorTextos.classList.remove('hidden');
        
        const contenidorTranscripcio = document.getElementById('text-transcripcio');
        const contenidorTraduccio = document.getElementById('text-traduccio');
        
        contenidorTranscripcio.textContent = transcripcio;
        contenidorTraduccio.textContent = traduccio;
    }
    
    reproduirAudioTraduit(blob) {
        // Ocultar l'indicador de càrrega
        const estatTraduccio = document.getElementById('estat-traduccio');
        estatTraduccio.classList.add('hidden');
        
        const reproductorAudio = document.getElementById('reproductor-audio');
        const audio = document.getElementById('audio-reproductor');
        
        const url = URL.createObjectURL(blob);
        audio.src = url;
        reproductorAudio.classList.remove('hidden');
        audio.play();
        
        // Afegir a l'historial (utilitza la última transcripció i traducció guardades)
        this.afegirAHistorial(blob, this.ultimaTranscripcio, this.ultimaTraduccio);
        
        // Restablir valors per la següent traducció
        this.ultimaTranscripcio = '';
        this.ultimaTraduccio = '';
    }
    
    
    // Modifica el mètode afegirAHistorial per afegir botons de descàrrega a l'historial
    afegirAHistorial(audioBlobOriginal, audioBlobTraduit, transcripcio, traduccio) {
        const llistaHistorial = document.getElementById('llista-historial');
        const element = document.createElement('div');
        element.className = 'bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4';
        
        const dataActual = new Date().toLocaleString('ca-ES');
        const idiomaOrigen = document.getElementById('idioma-origen').selectedOptions[0].text;
        const idiomaDesti = document.getElementById('idioma-desti').selectedOptions[0].text;
        
        const audioUrlOriginal = URL.createObjectURL(audioBlobOriginal);
        const audioUrlTraduit = URL.createObjectURL(audioBlobTraduit);
        
        // Generar noms d'arxiu únics per a la descàrrega
        const timestamp = new Date().getTime();
        const nomArxiuOriginal = `audio_original_${idiomaOrigen.toLowerCase()}_${timestamp}.mp3`;
        const nomArxiuTraduit = `audio_traduit_${idiomaDesti.toLowerCase()}_${timestamp}.mp3`;

        const labelDescarregar = traduccionsLabels('descarregar');
        const labelAvisNavegadorAudio = traduccionsLabels('avis_navegador_audio');
        
        element.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                <div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">${dataActual}</span>
                    <span class="ml-2 text-sm font-medium text-gray-800 dark:text-white">
                        ${idiomaOrigen} → ${idiomaDesti}
                    </span>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Àudio original:</span>
                        <button class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center descarregar-historial  cursor-pointer" 
                                data-url="${audioUrlOriginal}" 
                                data-nom="${nomArxiuOriginal}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            ${labelDescarregar}
                        </button>
                    </div>
                    <audio controls class="w-full mt-1">
                        <source src="${audioUrlOriginal}" type="audio/mp3">
                        ${labelAvisNavegadorAudio}
                    </audio>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Àudio traduït:</span>
                        <button class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center descarregar-historial  cursor-pointer" 
                                data-url="${audioUrlTraduit}" 
                                data-nom="${nomArxiuTraduit}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            ${labelDescarregar}
                        </button>
                    </div>
                    <audio controls class="w-full mt-1">
                        <source src="${audioUrlTraduit}" type="audio/mp3">
                        ${labelAvisNavegadorAudio}
                    </audio>
                </div>
            </div>
            <div class="text-sm border-t border-gray-200 dark:border-gray-600 pt-2">
                <div class="mb-2">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Transcripció:</span>
                    <p class="text-gray-800 dark:text-gray-200">${transcripcio}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Traducció:</span>
                    <p class="text-gray-800 dark:text-gray-200">${traduccio}</p>
                </div>
            </div>
        `;
        
        llistaHistorial.insertBefore(element, llistaHistorial.firstChild);
        
        // Configurar els botons de descàrrega de l'historial
        const botonsDescarrega = element.querySelectorAll('.descarregar-historial');
        botonsDescarrega.forEach(boto => {
            boto.addEventListener('click', () => {
                const url = boto.getAttribute('data-url');
                const nomArxiu = boto.getAttribute('data-nom');
                
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = nomArxiu;
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                }, 100);
            });
        });
        
        // Netejar URL objects antics per evitar fuites de memòria
        if (llistaHistorial.children.length > 5) {
            for (let i = 5; i < llistaHistorial.children.length; i++) {
                const audioElements = llistaHistorial.children[i].querySelectorAll('audio');
                audioElements.forEach(audioElement => {
                    if (audioElement && audioElement.src) {
                        URL.revokeObjectURL(audioElement.src);
                    }
                });
                llistaHistorial.removeChild(llistaHistorial.children[i]);
            }
        }
    }

    configurarModes() {
        // Elements de la UI
        const botoModeMicrofon = document.getElementById('mode-microfon');
        const botoModeText = document.getElementById('mode-text');
        const botoModeImatge = document.getElementById('mode-imatge'); // Nou
        const contingutMicrofon = document.getElementById('contingut-microfon');
        const contingutText = document.getElementById('contingut-text');
        const contingutImatge = document.getElementById('contingut-imatge'); // Nou
        const botoTraduirText = document.getElementById('boto-traduir-text');
        
        // Esdeveniments per canviar mode
        botoModeMicrofon.addEventListener('click', () => {
            this.canviarMode('microfon');
        });
        
        botoModeText.addEventListener('click', () => {
            this.canviarMode('text');
        });
        
        botoModeImatge.addEventListener('click', () => {
            this.canviarMode('imatge');
        });

        // Configurar event per traduir text
        botoTraduirText.addEventListener('click', () => {
            const text = document.getElementById('entrada-text').value.trim();
            if (text) {
                this.processarTextDirecte(text);
            } else {
                // alert('Si us plau, introdueix algun text per traduir.');
                alert(traduccionsLabels('avis_introduir_text'));
            }
        });

        // Configurar event per traduir text
        botoTraduirText.addEventListener('click', () => {
            const text = document.getElementById('entrada-text').value.trim();
            if (text) {
                this.processarTextDirecte(text);
            } else {
                alert(traduccionsLabels('avis_introduir_text'));
            }
        });
        
        // Configurar gestió d'imatges
        this.configurarGestioImatges();


    }

    canviarMode(mode) {
        const botoModeMicrofon = document.getElementById('mode-microfon');
        const botoModeText = document.getElementById('mode-text');
        const botoModeImatge = document.getElementById('mode-imatge'); // Nou
        const contingutMicrofon = document.getElementById('contingut-microfon');
        const contingutText = document.getElementById('contingut-text');
        const contingutImatge = document.getElementById('contingut-imatge'); // Nou

        
        // if (mode === 'microfon') {
        //     // Activar mode micròfon
        //     botoModeMicrofon.classList.remove('bg-white', 'text-gray-900', 'dark:bg-gray-700');
        //     botoModeMicrofon.classList.add('bg-blue-600', 'text-white');
            
        //     botoModeText.classList.remove('bg-blue-600', 'text-white');
        //     botoModeText.classList.add('bg-white', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white');
            
        //     contingutMicrofon.classList.remove('hidden');
        //     contingutText.classList.add('hidden');
        // } else if (mode === 'text') {
        //     // Activar mode text
        //     botoModeMicrofon.classList.remove('bg-blue-600', 'text-white');
        //     botoModeMicrofon.classList.add('bg-white', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white');
            
        //     botoModeText.classList.remove('bg-white', 'text-gray-900', 'dark:bg-gray-700');
        //     botoModeText.classList.add('bg-blue-600', 'text-white');
            
        //     contingutMicrofon.classList.add('hidden');
        //     contingutText.classList.remove('hidden');
            
        //     // Si estava gravant, aturar la gravació
        //     if (this.gestorAudio.gravant) {
        //         this.gestorAudio.aturarGravacio();
        //     }
        // }
            
        // Resetejem tots els botons
        botoModeMicrofon.classList.remove('bg-blue-600', 'text-white');
        botoModeMicrofon.classList.add('bg-white', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white');
        
        botoModeText.classList.remove('bg-blue-600', 'text-white');
        botoModeText.classList.add('bg-white', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white');
        
        botoModeImatge.classList.remove('bg-blue-600', 'text-white'); // Nou
        botoModeImatge.classList.add('bg-white', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-white'); // Nou
        
        // Activem el mode seleccionat
        if (mode === 'microfon') {
            botoModeMicrofon.classList.remove('bg-white', 'text-gray-900', 'dark:bg-gray-700');
            botoModeMicrofon.classList.add('bg-blue-600', 'text-white');
            contingutMicrofon.classList.remove('hidden');
            contingutText.classList.add('hidden');
            contingutImatge.classList.add('hidden');
        } else if (mode === 'text') {
            botoModeText.classList.remove('bg-white', 'text-gray-900', 'dark:bg-gray-700');
            botoModeText.classList.add('bg-blue-600', 'text-white');
            contingutMicrofon.classList.add('hidden');
            contingutText.classList.remove('hidden');
            contingutImatge.classList.add('hidden');
        } else if (mode === 'imatge') { // Nou
            botoModeImatge.classList.remove('bg-white', 'text-gray-900', 'dark:bg-gray-700');
            botoModeImatge.classList.add('bg-blue-600', 'text-white');
            contingutMicrofon.classList.add('hidden');
            contingutText.classList.add('hidden');
            contingutImatge.classList.remove('hidden');
        }
        
        // Si estava gravant, aturar la gravació
        if (this.gestorAudio.gravant) {
            this.gestorAudio.aturarGravacio();
        }
        
        // Amaguem els resultats de traducció d'imatge
        const resultatsImatge = document.getElementById('resultats-imatge');
        if (resultatsImatge) {
            resultatsImatge.classList.add('hidden');
        }
    }

    async processarTextDirecte(text) {
        if (!this.gestorOpenAI.isConfigured()) {
            // alert('Cal configurar la clau API d\'OpenAI primer.');
            alert(traduccionsLabels('avis_falta_clau_api'));
            this.mostrarModalConfiguracio();
            return;
        }

        try {
            // Mostrar el loader de càrrega
            // this.mostrarEstatProcessant('Generant àudio original...');
            this.mostrarEstatProcessant(traduccionsLabels('generant_audio_original'));
            
            // Guardar la transcripció (en aquest cas, el text introduït)
            this.ultimaTranscripcio = text;
            
            // Generar àudio a partir del text original
            const idiomaOrigen = document.getElementById('idioma-origen').value;
            const audioOriginal = await this.gestorOpenAI.generarAudioOriginal(text, idiomaOrigen);
            
            // Actualitzar estat
            this.mostrarEstatProcessant(traduccionsLabels('traduint_text'));
            
            // Traduir el text a l'idioma destí
            const idiomaDesti = document.getElementById('idioma-desti').value;
            const traduccio = await this.gestorOpenAI.traduirText(text, idiomaOrigen, idiomaDesti);
            console.log('Traducció:', traduccio);
            
            // Guardar la traducció
            this.ultimaTraduccio = traduccio;
            
            // Mostrar textos
            this.mostrarTextos(text, traduccio);
            
            // Actualitzar estat
            this.mostrarEstatProcessant(traduccionsLabels('generant_audio_traduit'));
            
            // Convertir la traducció a àudio
            const audioTraduit = await this.gestorOpenAI.textAAudio(traduccio, idiomaDesti);
            
            // Reproduir àudio traduït i original
            this.reproduirAudios(audioOriginal, audioTraduit);
        } catch (error) {
            console.error('Error en el procés de traducció:', error);
            const missatgeError = error.message || traduccionsLabels('error_processar_text');
            
            const estatTraduccio = document.getElementById('estat-traduccio');
            const missatgeEstat = document.getElementById('missatge-estat');
            
            missatgeEstat.textContent = missatgeError;
            
            // Canviar l'estil del loader per indicar error
            const loader = document.getElementById('loader-traduccio');
            loader.classList.remove('border-blue-500', 'animate-spin');
            loader.classList.add('border-red-500');
            
            setTimeout(() => {
                estatTraduccio.classList.add('hidden');
                // Restablir el loader
                loader.classList.remove('border-red-500');
                loader.classList.add('border-blue-500', 'animate-spin');
            }, 5000);
        }
    }

    // Configurar la gestió d'imatges
    // Mètode configurarGestioImatges revisat per utilitzar la classe zona-imatge i millorar els efectes visuals
    configurarGestioImatges() {
        const entradaImatge = document.getElementById('entrada-imatge');
        const dropZone = document.querySelector('label[for="entrada-imatge"]'); // Zona on arrossegar
        const previsualitzacioImatge = document.getElementById('previsualitzacio-imatge');
        const imatgePujada = document.getElementById('imatge-pujada');
        const eliminarImatge = document.getElementById('eliminar-imatge');
        const botoTraduirImatge = document.getElementById('boto-traduir-imatge');
        const resultatsImatge = document.getElementById('resultats-imatge');

        // Nou: Gestió de la càmera
        const botoCamera = document.getElementById('boto-camera');
        const seccioCamera = document.getElementById('seccio-camera');
        const videoCamera = document.getElementById('video-camera');
        const capturarImatge = document.getElementById('capturar-imatge');
        const tancarCamera = document.getElementById('tancar-camera');
        const canvasCamera = document.getElementById('canvas-camera');
            
        // Variable per emmagatzemar les dades de la imatge
        this.imatgeActual = null;

        // Stream de la càmera
        let streamCamera = null;

    // Nou: Event listener per al botó de càmera
    botoCamera.addEventListener('click', async () => {
        try {
            // Comprovar si el navegador suporta getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('El teu navegador no suporta l\'accés a la càmera. Prova amb Chrome, Firefox o Safari.');
                return;
            }
            
            // Obtenir accés a la càmera
            streamCamera = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: 'environment', // Prefereix la càmera posterior en mòbils
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            
            // Assignar el stream al vídeo
            videoCamera.srcObject = streamCamera;
            
            // Mostrar la secció de la càmera
            seccioCamera.classList.remove('hidden');
            botoCamera.classList.add('hidden');
            dropZone.classList.add('hidden');
            
        } catch (error) {
            console.error('Error en accedir a la càmera:', error);
            
            let missatgeError = 'No s\'ha pogut accedir a la càmera.';
            
            if (error.name === 'NotAllowedError') {
                missatgeError += '\n\nHas denegat el permís a la càmera. Per activar-la:\n' +
                                '1. Fes clic a la icona del cadenat a la barra d\'adreces\n' +
                                '2. Canvia el permís de la càmera a "Permet"\n' +
                                '3. Recarrega la pàgina';
            } else if (error.name === 'NotFoundError') {
                missatgeError += '\n\nNo s\'ha trobat cap càmera. Assegura\'t que en tens una connectada.';
            } else if (error.name === 'NotReadableError') {
                missatgeError += '\n\nLa càmera està sent utilitzada per una altra aplicació.';
            }
            
            alert(missatgeError);
        }
    });   
    
    // Nou: Event listener per capturar la imatge
    capturarImatge.addEventListener('click', () => {
        // Configurar el canvas amb les dimensions del vídeo
        canvasCamera.width = videoCamera.videoWidth;
        canvasCamera.height = videoCamera.videoHeight;
        
        // Dibuixar el frame actual del vídeo al canvas
        const context = canvasCamera.getContext('2d');
        context.drawImage(videoCamera, 0, 0, canvasCamera.width, canvasCamera.height);
        
        // Convertir el canvas a una imatge
        const imatgeDataURL = canvasCamera.toDataURL('image/jpeg');
        
        // Mostrar la imatge capturada
        imatgePujada.src = imatgeDataURL;
        previsualitzacioImatge.classList.remove('hidden');
        botoTraduirImatge.classList.remove('hidden');
        
        // Amagar els resultats si hi havia
        resultatsImatge.classList.add('hidden');
        
        // Tancar la càmera
        this.tancarStreamCamera(streamCamera);
        seccioCamera.classList.add('hidden');
        botoCamera.classList.remove('hidden');
        dropZone.classList.remove('hidden');
        
        // Guardar les dades de la imatge en base64
        this.imatgeActual = imatgeDataURL.split(',')[1];
    });
    
    // Nou: Event listener per tancar la càmera
    tancarCamera.addEventListener('click', () => {
        this.tancarStreamCamera(streamCamera);
        seccioCamera.classList.add('hidden');
        botoCamera.classList.remove('hidden');
        dropZone.classList.remove('hidden');
    });    


        
        // Gestionar quan es puja una imatge a través de l'input file
        entradaImatge.addEventListener('change', (event) => {
            const fitxer = event.target.files[0];
            if (fitxer) {
                this.processarFitxerImatge(fitxer);
            }
        });
        
        // Gestionar arrossegar i deixar anar (drag & drop)
        
        // Prevenir el comportament per defecte de l'arrossegament
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Afegir classes d'estil quan s'arrossega sobre la zona
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.classList.add('drag-active');
        }
        
        function unhighlight() {
            dropZone.classList.remove('drag-active');
        }
        
        // Gestionar quan es deixa anar un fitxer
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const fitxer = dt.files[0];
            if (fitxer) {
                this.processarFitxerImatge(fitxer);
            }
        });
        
        // Gestionar quan es vol eliminar la imatge
        eliminarImatge.addEventListener('click', () => {
            entradaImatge.value = '';
            previsualitzacioImatge.classList.add('hidden');
            botoTraduirImatge.classList.add('hidden');
            resultatsImatge.classList.add('hidden');
            this.imatgeActual = null;
        });
        
        // Gestionar el botó de traduir imatge
        botoTraduirImatge.addEventListener('click', () => {
            if (this.imatgeActual) {
                this.processarImatge(this.imatgeActual);
            } else {
                alert(traduccionsLabels('puja_imatge_primer'));
            }
        });
    }            

    // Afegir aquest nou mètode a la classe AplicacioTraductor
tancarStreamCamera(stream) {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    }
}

    // Nou mètode per processar un fitxer d'imatge (reutilitzat tant per l'input com pel drag & drop)
    processarFitxerImatge(fitxer) {
        const previsualitzacioImatge = document.getElementById('previsualitzacio-imatge');
        const imatgePujada = document.getElementById('imatge-pujada');
        const botoTraduirImatge = document.getElementById('boto-traduir-imatge');
        const resultatsImatge = document.getElementById('resultats-imatge');
        
        // Comprovar mida màxima (5MB)
        if (fitxer.size > 5 * 1024 * 1024) {
            alert(traduccionsLabels('avis_imatge_maxima_5mb'));
            return;
        }
        
        // Comprovar tipus de fitxer
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fitxer.type)) {
            alert(traduccionsLabels(avis_format_imatge));
            return;
        }
        
        // Llegir i mostrar la imatge
        const reader = new FileReader();
        reader.onload = (e) => {
            // Guardar les dades de la imatge en base64
            const base64String = e.target.result.split(',')[1];
            this.imatgeActual = base64String;
            
            // Mostrar la previsualització
            imatgePujada.src = e.target.result;
            previsualitzacioImatge.classList.remove('hidden');
            botoTraduirImatge.classList.remove('hidden');
            
            // Amagar els resultats si hi havia
            resultatsImatge.classList.add('hidden');
        };
        reader.readAsDataURL(fitxer);
    }

    reproduirAudios(blobOriginal, blobTraduit) {
        // Ocultar l'indicador de càrrega
        const estatTraduccio = document.getElementById('estat-traduccio');
        estatTraduccio.classList.add('hidden');
        
        const reproductorAudio = document.getElementById('reproductor-audio');
        const audioOriginal = document.getElementById('audio-original');
        const audioTraduit = document.getElementById('audio-reproductor');

        // Guardar els blobs d'àudio per a la possible descàrrega
        this.ultimAudioOriginal = blobOriginal;
        this.ultimAudioTraduit = blobTraduit;
        
        // Configurar l'àudio original
        const urlOriginal = URL.createObjectURL(blobOriginal);
        audioOriginal.src = urlOriginal;
        
        // Configurar l'àudio traduït
        const urlTraduit = URL.createObjectURL(blobTraduit);
        audioTraduit.src = urlTraduit;
        
        reproductorAudio.classList.remove('hidden');
        audioTraduit.play();
        
        // Afegir a l'historial (utilitza la última transcripció i traducció guardades)
        this.afegirAHistorial(blobOriginal, blobTraduit, this.ultimaTranscripcio, this.ultimaTraduccio);
        
        // Restablir valors per la següent traducció
        this.ultimaTranscripcio = '';
        this.ultimaTraduccio = '';
    }

    configurarBotonsDescarrega() {
        const botoDescarregarOriginal = document.getElementById('descarregar-audio-original');
        const botoDescarregarTraduit = document.getElementById('descarregar-audio-traduit');
        
        botoDescarregarOriginal.addEventListener('click', () => {
            if (this.ultimAudioOriginal) {
                const idiomaOrigen = document.getElementById('idioma-origen').value;
                this.descarregarAudio(this.ultimAudioOriginal, `audio_original_${idiomaOrigen}.mp3`);
            }
        });
        
        botoDescarregarTraduit.addEventListener('click', () => {
            if (this.ultimAudioTraduit) {
                const idiomaDesti = document.getElementById('idioma-desti').value;
                this.descarregarAudio(this.ultimAudioTraduit, `audio_traduit_${idiomaDesti}.mp3`);
            }
        });
    }

    // Afegeix aquest nou mètode a la classe AplicacioTraductor
    descarregarAudio(blob, nomArxiu) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = nomArxiu;
        document.body.appendChild(a);
        a.click();
        
        // Neteja després de la descàrrega
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    configurarBotoIntercanvi() {
        const botoIntercanvi = document.getElementById('intercanviar-idiomes');
        if (botoIntercanvi) {
            botoIntercanvi.addEventListener('click', () => {
                const selectOrigen = document.getElementById('idioma-origen');
                const selectDesti = document.getElementById('idioma-desti');
                
                // Guardem els valors actuals
                const valorOrigen = selectOrigen.value;
                const valorDesti = selectDesti.value;
                
                // Intercanviem els valors
                selectOrigen.value = valorDesti;
                selectDesti.value = valorOrigen;
                
                // Actualitzem la configuració desada
                if (this.gestorOpenAI) {
                    this.gestorOpenAI.setIdiomaOriginal(valorDesti);
                    this.gestorOpenAI.setIdiomaTraduccio(valorOrigen);
                }
            });
        }
    }

    // Mostrar resultats de la traducció d'imatge
    mostrarResultatsImatge(textOriginal, textTraduit) {
        const resultatsImatge = document.getElementById('resultats-imatge');
        const textImatgeOriginal = document.getElementById('text-imatge-original');
        const textImatgeTraduit = document.getElementById('text-imatge-traduit');
        
        textImatgeOriginal.textContent = textOriginal;
        textImatgeTraduit.textContent = textTraduit;
        
        resultatsImatge.classList.remove('hidden');

        // Guardar la traducció per a possibles usos futurs (com generar àudio)
        this.ultimTraduccioImatge = textTraduit;

        // Configurar el botó d'àudio
        this.configurarBotoAudioImatge();
        
        // També podríem afegir això a l'historial si volguéssim
        this.afegirAHistorialImatge(textOriginal, textTraduit);
    }

    
    // 2. Afegeix aquest nou mètode per configurar el botó d'àudio de la imatge
    configurarBotoAudioImatge() {
        const botoAudioImatge = document.getElementById('boto-audio-imatge');
        const descarregarAudioImatge = document.getElementById('descarregar-audio-imatge');
        const audioImatgeContainer = document.getElementById('audio-imatge-container');
        const audioImatgeReproductor = document.getElementById('audio-imatge-reproductor');
        
        // Variable per emmagatzemar el blob d'àudio
        this.blobAudioImatge = null;
        
        botoAudioImatge.addEventListener('click', async () => {
            if (!this.ultimTraduccioImatge) {
                alert(traduccionsLabels('avis_no_text_a_audio'));
                return;
            }
            
            try {
                // Mostrar indicador de càrrega
                botoAudioImatge.disabled = true;
                botoAudioImatge.classList.add('opacity-50');
                botoAudioImatge.querySelector('svg').classList.add('animate-pulse');
                // botoAudioImatge.textContent = "Generant àudio...";
                botoAudioImatge.textContent = traduccionsLabels('generant_audio');
                
                // Obtenir l'idioma destí seleccionat
                const idiomaDestiSelect = document.getElementById('idioma-desti');
                const idiomaDestiCodi = idiomaDestiSelect.options[idiomaDestiSelect.selectedIndex].dataset.codi;
                
                // Generar àudio a partir del text traduït
                this.blobAudioImatge = await this.gestorOpenAI.textAAudio(this.ultimTraduccioImatge, idiomaDestiCodi);
                
                // Configurar el reproductor d'àudio
                const audioUrl = URL.createObjectURL(this.blobAudioImatge);
                audioImatgeReproductor.src = audioUrl;
                audioImatgeContainer.classList.remove('hidden');
                
                // Mostrar el botó de descàrrega
                descarregarAudioImatge.classList.remove('hidden');
                descarregarAudioImatge.classList.add('flex');
                
                // Reproduir automàticament
                audioImatgeReproductor.play();
                
            } catch (error) {
                console.error('Error en generar àudio:', error);
                // alert('Error en generar àudio: ' + error.message);
                alert(traduccionsLabels('erro_generar_audio') + error.message);
            } finally {
                // Restaurar l'estat del botó
                botoAudioImatge.disabled = false;
                botoAudioImatge.classList.remove('opacity-50');
                const escoltarTraduccio = traduccionsLabels('escoltar_traduccio')
                botoAudioImatge.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                    </svg>
                    ${escoltarTraduccio}
                `;
            }
        });
        
        // Configurar el botó de descàrrega d'àudio
        descarregarAudioImatge.addEventListener('click', () => {
            if (this.blobAudioImatge) {
                const idiomaDestiSelect = document.getElementById('idioma-desti');
                const idiomaDestiNom = idiomaDestiSelect.options[idiomaDestiSelect.selectedIndex].text;
                const nomArxiu = `traduccio_imatge_${idiomaDestiNom.toLowerCase()}_${new Date().getTime()}.mp3`;
                
                const url = URL.createObjectURL(this.blobAudioImatge);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = nomArxiu;
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            }
        });
    }


    async processarImatge(imatgeBase64) {
        if (!this.gestorOpenAI.isConfigured()) {
            alert(traduccionsLabels('avis_falta_clau_api'));
            this.mostrarModalConfiguracio();
            return;
        }
        
        try {
            // Mostrar el loader de càrrega
            // this.mostrarEstatProcessant('Extraient text de la imatge...');
            this.mostrarEstatProcessant(traduccionsLabels('extraient_text_imatge'));

            const selectOrigen = document.getElementById('idioma-origen');
            const selectDesti = document.getElementById('idioma-desti');
            
            // 1. Extreure text de la imatge
            const textExtret = await this.gestorOpenAI.extraureTextImatge(imatgeBase64, selectDesti);
                                
            if (!textExtret || textExtret.toLowerCase().includes(traduccionsLabels('no_hi_ha_text')) || textExtret.toLowerCase().includes(traduccionsLabels('no_text'))) {
                this.mostrarResultatsImatge(traduccionsLabels('no_detectat_text'), '');
                const estatTraduccio = document.getElementById('estat-traduccio');
                estatTraduccio.classList.add('hidden');
                return;
            }
            
            console.log('Text extret de la imatge:', textExtret);
            
            // Actualitzar estat
            this.mostrarEstatProcessant(traduccionsLabels('traduint_text'));
            
            // 2. Obtenir els codis d'idioma dels selectors
            const idiomaOrigenSelect = document.getElementById('idioma-origen').value;
            const idiomaDestiSelect = document.getElementById('idioma-desti').value;
            
            // Obtenir els codis d'idioma, no els noms
            // const idiomaOrigenCodi = idiomaOrigenSelect.options[idiomaOrigenSelect.selectedIndex].dataset.codi;
            // const idiomaDestiCodi = idiomaDestiSelect.options[idiomaDestiSelect.selectedIndex].dataset.codi;
            
            // 3. Traduir el text utilitzant els codis d'idioma correctes
            // const traduccio = await this.gestorOpenAI.traduirText(textExtret, idiomaOrigenCodi, idiomaDestiCodi);
            const traduccio = await this.gestorOpenAI.traduirText(textExtret, idiomaOrigenSelect, idiomaDestiSelect);
            
            console.log('Traducció:', traduccio);
            
            // 4. Mostrar els resultats
            this.mostrarResultatsImatge(textExtret, traduccio);
            
            // Ocultar el loader
            const estatTraduccio = document.getElementById('estat-traduccio');
            estatTraduccio.classList.add('hidden');
            
        } catch (error) {
            console.error('Error en processar la imatge:', error);
            const missatgeError = error.message || traduccionsLabels('error_processar_imatge');
            
            const estatTraduccio = document.getElementById('estat-traduccio');
            const missatgeEstat = document.getElementById('missatge-estat');
            
            missatgeEstat.textContent = missatgeError;
            
            // Canviar l'estil del loader per indicar error
            const loader = document.getElementById('loader-traduccio');
            loader.classList.remove('border-blue-500', 'animate-spin');
            loader.classList.add('border-red-500');
            
            setTimeout(() => {
                estatTraduccio.classList.add('hidden');
                // Restablir el loader
                loader.classList.remove('border-red-500');
                loader.classList.add('border-blue-500', 'animate-spin');
            }, 5000);
        }
    }

    // Afegir traduccions d'imatges a l'historial
    afegirAHistorialImatge(textOriginal, textTraduit) {
        const llistaHistorial = document.getElementById('llista-historial');
        const element = document.createElement('div');
        element.className = 'bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4';
        
        const dataActual = new Date().toLocaleString('ca-ES');
        const idiomaOrigen = document.getElementById('idioma-origen').selectedOptions[0].text;
        const idiomaDesti = document.getElementById('idioma-desti').selectedOptions[0].text;
        const labelImatge = traduccionsLabels('label_matge')
        const labelTextOriginal= traduccionsLabels('label_text_original')
        const labelTextTraduit = traduccionsLabels('label_text_traduccio')

        element.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                <div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">${dataActual}</span>
                    <span class="ml-2 text-sm font-medium text-gray-800 dark:text-white">
                        ${idiomaOrigen} → ${idiomaDesti} (${labelImatge})
                    </span>
                </div>
            </div>
            <div class="text-sm border-t border-gray-200 dark:border-gray-600 pt-2">
                <div class="mb-2">
                    <span class="font-medium text-gray-700 dark:text-gray-300">${labelTextOriginal}</span>
                    <p class="text-gray-800 dark:text-gray-200">${textOriginal}</p>
                </div>
                <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">${labelTextTraduit}</span>
                    <p class="text-gray-800 dark:text-gray-200">${textTraduit}</p>
                </div>
            </div>
        `;
        
        llistaHistorial.insertBefore(element, llistaHistorial.firstChild);
    }


}