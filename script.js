document.addEventListener('DOMContentLoaded', () => {

    // 1. Ocultar Loader Dinámico
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1200);

    // 2. Lógica de Bienvenida y YouTube Iframe
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const musicControl = document.getElementById('music-control');
    const musicIcon = musicControl.querySelector('i');
    
    const ytPlayerIframe = document.getElementById('youtube-player');
    let isPlaying = false;

    openBtn.addEventListener('click', () => {
        // Deslizar pantalla hacia arriba
        welcomeScreen.classList.add('slide-up');
        mainContent.classList.remove('hidden');
        
        // Reproducir música vibrante
        if (ytPlayerIframe && ytPlayerIframe.contentWindow) {
            ytPlayerIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            isPlaying = true;
            // Cambiar ícono a pausa y agregar animación rotatoria
            musicIcon.classList.replace('fa-music', 'fa-pause');
            musicControl.style.animation = "pulse-ring 2s infinite";
        }

        setTimeout(() => welcomeScreen.style.display = 'none', 1000);
    });

    // Control Play/Pause Manual
    musicControl.addEventListener('click', () => {
        if (!ytPlayerIframe || !ytPlayerIframe.contentWindow) return;

        if (isPlaying) {
            ytPlayerIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            musicIcon.classList.replace('fa-pause', 'fa-music');
            musicControl.style.animation = "none";
        } else {
            ytPlayerIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            musicIcon.classList.replace('fa-music', 'fa-pause');
            musicControl.style.animation = "pulse-ring 2s infinite";
        }
        isPlaying = !isPlaying;
    });

    // 3. Cuenta Regresiva
    const eventDate = new Date('October 15, 2026 17:00:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-container').innerHTML = "<h3 style='color: var(--color-primary); font-family: var(--font-script); font-size: 3rem;'>¡Hoy es la gran fiesta!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    }, 1000);

    // 4. Animaciones al hacer Scroll (Scale In Up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-animate').forEach(section => {
        observer.observe(section);
    });

    // 5. Envío de RSVP por WhatsApp con un tono más divertido
    const rsvpForm = document.getElementById('rsvp-form');
    
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const guests = document.getElementById('guests').value;
        const phoneNumber = "521234567890"; 
        
        let message = "";
        
        if (guests === "0") {
            message = `¡Hola! Soy ${name}. Me duele mucho perderme los XV de Sofía, pero no podré asistir 😢. ¡Pásenla increíble y bailen mucho por mí!`;
        } else {
            message = `¡Hola! Soy ${name} y obvio que no me pierdo los XV de Sofía 🥳. Confirmo mi asistencia para ${guests} persona(s). ¡Ya quiero que sea la fiesta!`;
        }

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    });

    // Bloquear clic derecho
document.addEventListener('contextmenu', event => event.preventDefault());

// Bloquear atajos comunes (F12, Ctrl+Shift+I, Ctrl+U)
document.onkeydown = function(e) {
    if(e.keyCode == 123) return false; // F12
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false; // Ctrl+Shift+I
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false; // Ctrl+Shift+C
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false; // Ctrl+Shift+J
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U
};

});