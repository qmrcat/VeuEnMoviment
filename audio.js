

// Classe per gestionar l'àudio
export class GestorAudio {
    constructor() {
        this.gravant = false;
        this.cancelar = false;
        this.botoGravacio = document.getElementById('boto-gravacio');
        this.estatGravacio = document.getElementById('estat-gravacio');
        this.indicadorGravacio = document.getElementById('indicador-gravacio');
        this.botoCancelar = document.getElementById('boto-cancelar'); // Nou
        this.mediaRecorder = null;
        this.chunksAudio = [];

        // Propietats per al temporitzador (afegit nou)
        this.tempsTotalGravacio = 0;
        this.intervalTemporitzador = null;
        this.elementTempsGravacio = document.getElementById('temps-gravacio');
        this.contenidorTemporitzador = document.getElementById('temporitzador-gravacio');
                    
        this.comprovarSuportMicrofon();
        this.botoGravacio.addEventListener('click', () => this.alternarGravacio());
        this.botoCancelar.addEventListener('click', () => this.cancelarGravacio()); // Nou
    }
    
    comprovarSuportMicrofon() {
        // Comprovar si el navegador suporta getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.botoGravacio.disabled = true;
            this.estatGravacio.textContent = 'Navegador no compatible';
            alert('El teu navegador no suporta l\'accés al micròfon. Prova amb Chrome, Firefox o Safari.');
        }
    }

    // Afegeix aquests nous mètodes a la classe GestorAudio
    iniciarTemporitzador() {
        this.tempsTotalGravacio = 0;
        this.actualitzarVisualitzacioTemps();
        this.contenidorTemporitzador.classList.remove('hidden');
        
        this.intervalTemporitzador = setInterval(() => {
            this.tempsTotalGravacio += 1;
            this.actualitzarVisualitzacioTemps();
        }, 1000);
    }

    aturarTemporitzador() {
        if (this.intervalTemporitzador) {
            clearInterval(this.intervalTemporitzador);
            this.intervalTemporitzador = null;
        }
        this.contenidorTemporitzador.classList.add('hidden');
    }

    actualitzarVisualitzacioTemps() {
        const minuts = Math.floor(this.tempsTotalGravacio / 60);
        const segons = this.tempsTotalGravacio % 60;
        this.elementTempsGravacio.textContent = `${minuts.toString().padStart(2, '0')}:${segons.toString().padStart(2, '0')}`;
    }
    
    async alternarGravacio() {
        if (!this.gravant) {
            await this.iniciarGravacio();
        } else {
            this.aturarGravacio();
        }
    }

    cancelarGravacio() {
        if (this.mediaRecorder && this.gravant) {
            // Aturar el mediaRecorder sense processar l'àudio
            this.mediaRecorder.stop();
            
            // Netejar els chunks d'àudio perquè no es processin
            this.chunksAudio = [];
            
            // Actualitzar l'estat i la UI
            this.gravant = false;
            this.cancelar = true; // Afegit per indicar que la gravació ha estat cancel·lada
            this.actualitzarUI(false);
            
            // Aturar el temporitzador (si l'has implementat)
            if (typeof this.aturarTemporitzador === 'function') {
                this.aturarTemporitzador();
            }
            
            console.log('Gravació cancel·lada per l\'usuari');
        }
    }
    
    async iniciarGravacio() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            this.chunksAudio = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.chunksAudio.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.chunksAudio, { type: 'audio/webm' });
                console.log('Blob d\'àudio creat, mida:', blob.size, 'tipus:', blob.type);
                this.enviarAudio(blob);
                stream.getTracks().forEach(track => track.stop());
            };
            
            this.mediaRecorder.start();
            this.gravant = true;
            this.cancelar = false;
            this.actualitzarUI(true);
            
            // Iniciar el temporitzador (afegit nou)
            this.iniciarTemporitzador();
        } catch (error) {
            console.error("Error en accedir al micròfon o no s'ha detectat");
            console.error(error);
            
            let missatgeError = 'No s\'ha pogut accedir al micròfon.';
            
            if (error.name === 'NotAllowedError') {
                missatgeError += '\n\nHas denegat el permís al micròfon. Per activar-lo:\n' +
                                '1. Fes clic a la icona del cadenat a la barra d\'adreces\n' +
                                '2. Canvia el permís del micròfon a "Permet"\n' +
                                '3. Recarrega la pàgina';
            } else if (error.name === 'NotFoundError') {
                missatgeError += '\n\nNo s\'ha trobat cap micròfon. Assegura\'t que en tens un connectat.';
            } else if (error.name === 'NotReadableError') {
                missatgeError += '\n\nEl micròfon està sent utilitzat per una altra aplicació.';
            }
            
            alert(missatgeError);
        }
    }
    
    aturarGravacio() {
        if (this.mediaRecorder && this.gravant) {
            this.mediaRecorder.stop();
            this.gravant = false;
            this.actualitzarUI(false);

            // Aturar el temporitzador (afegit nou)
            this.aturarTemporitzador();
        }
    }
    
    actualitzarUI(gravant) {
        if (gravant) {
            this.estatGravacio.textContent = 'Aturar gravació';
            this.botoGravacio.classList.remove('bg-red-500', 'hover:bg-red-600');
            this.botoGravacio.classList.add('bg-blue-500', 'hover:bg-blue-600');
            this.indicadorGravacio.classList.remove('hidden');
            this.botoCancelar.classList.remove('hidden'); // Mostrem el botó de cancel·lació
        } else {
            this.estatGravacio.textContent = 'Començar gravació';
            this.botoGravacio.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            this.botoGravacio.classList.add('bg-red-500', 'hover:bg-red-600');
            this.indicadorGravacio.classList.add('hidden');
            this.botoCancelar.classList.add('hidden'); // Ocultem el botó de cancel·lació
        }
    }
    
    enviarAudio(blob) {
        // Aquest mètode serà cridat des de l'aplicació principal
        // Si hi ha chunks d'àudio, cridem el callback
        if (!this.cancelar){
            if (this.chunksAudio.length > 0 && blob.size > 0) {
                this.onAudioEnregistrat?.(blob);
            } else {
                console.log('Gravació buida, no s\'envia');
            }
        } else {
            console.log('Gravació cancel·lada o buida, no s\'envia');
        }
        this.cancelar = false; // Reiniciem la variable de cancel·lació
    }
    
    setOnAudioEnregistrat(callback) {
        this.onAudioEnregistrat = callback;
    }
}
