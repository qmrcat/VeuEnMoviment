
import { idiomesJSON } from './idiomes.js';
import { AplicacioTraductor } from './traductor.js';
import { omplirSelectsIdiomes } from './utils.js';

// Iniciar l'aplicació
document.addEventListener('DOMContentLoaded', () => {

    omplirSelectsIdiomes(idiomesJSON);

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
