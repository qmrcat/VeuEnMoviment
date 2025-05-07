
import { idiomesJSON } from './idiomes.js';
import { AplicacioTraductor } from './traductor.js';
import { omplirSelectsIdiomes, traduirInterficie } from './utils.js';


// Iniciar l'aplicació
document.addEventListener('DOMContentLoaded', () => {

    omplirSelectsIdiomes(idiomesJSON);

    const themeToggle = document.getElementById('tema-toggle');
    const themeIcon = document.getElementById('tema-icon');

    const idiomaOrigen = document.getElementById('idioma-origen');
    const idiomaDesti = document.getElementById('idioma-desti');

    idiomaOrigen.value = localStorage.getItem('idioma-original') || 'Catalan';  // català
    idiomaDesti.value  = localStorage.getItem('idioma-traduccio') || 'English'; // anglès

    // Selector d'idiomes com a icona amb desplegable 
    const botoIdiomes = document.getElementById("boto-idiomes");
    const menuIdiomes = document.getElementById("menu-idiomes");
  

    // Aplicar tema inicial
    const savedTheme = localStorage.getItem('tema') || 'clar';

    // Gravació d'ordre de veu (estil WhatsApp)
    let mediaRecorder;
    let chunks = [];

    const botoVeu = document.getElementById("boto-veu-control");
                
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

    // Selector d'idiomes com a icona amb desplegable 
    botoIdiomes.addEventListener("click", () => {
        menuIdiomes.classList.toggle("hidden");
    });
    
    menuIdiomes.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            //document.getElementById("idioma-interficie").value = btn.dataset.lang;
            traduirInterficie(btn.dataset.lang)
            menuIdiomes.classList.add("hidden");
        });
    });


    window.app = new AplicacioTraductor();
});
