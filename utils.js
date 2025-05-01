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