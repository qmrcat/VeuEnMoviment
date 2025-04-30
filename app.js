// import { GestorAudio } from './audio.js';
// import { GestorOpenAI } from './openai.js';
import { idiomesJSON } from './idiomes.js';
import { AplicacioTraductor } from './traductor.js';




// Funció per ordenar un array d'objectes per una columna (alfabèticament)
function ordenarIdiomesPerColumna(array, columna) {
    return [...array].sort((a, b) => {
        const valA = (a[columna] || '').toString().toLowerCase();
        const valB = (b[columna] || '').toString().toLowerCase();
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    });
}


function generarOptionsSelect(json, columnaOrdenacio = '') {
    
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
function inserirOptionsSelect(selectId, options) {
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








// Iniciar l'aplicació
document.addEventListener('DOMContentLoaded', () => {

    const optionAutodetectar = '<option data-codi="--" value="autodetection">autodetecció</option>'
    const optionsIdioma = generarOptionsSelect(idiomesJSON, "catala")

    
    //frontend
    inserirOptionsSelect("idioma-original", optionAutodetectar + optionsIdioma)
    inserirOptionsSelect("idioma-traduccio", optionsIdioma)

    //Configuracio
    inserirOptionsSelect("idioma-origen", optionAutodetectar + optionsIdioma)
    inserirOptionsSelect("idioma-desti", optionsIdioma)



    const themeToggle = document.getElementById('tema-toggle');
    const themeIcon = document.getElementById('tema-icon');

    const idiomaOrigen = document.getElementById('idioma-origen');
    const idiomaDesti = document.getElementById('idioma-desti');

    idiomaOrigen.value = localStorage.getItem('idioma-original') || 'Catalan';  // català
    idiomaDesti.value  = localStorage.getItem('idioma-traduccio') || 'English'; // anglès


    // Aplicar tema inicial
    const savedTheme = localStorage.getItem('tema') || 'clar';
                
    if (savedTheme === 'fosc') {
        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀️';
    }
    
    // Configurar el toggle
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('tema', 'clar');
            themeIcon.textContent = '🌙';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('tema', 'fosc');
            themeIcon.textContent = '☀️';
        }
    });



    window.app = new AplicacioTraductor();
});