document.addEventListener('DOMContentLoaded', () => {

    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');
    const interactiveEnvelope = document.getElementById('interactive-envelope');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    let isMusicPlaying = false;

    // 1. APERTURA CINEMÁTICA Y REPRODUCCIÓN DE AUDIO (DropBox)
    interactiveEnvelope.addEventListener('click', () => {
        // Detenemos el latido para que el sobre se abra sin brincos
        envelopeWrapper.classList.remove('pulse-animation');
        interactiveEnvelope.classList.add('open');

        // Forzar reproducción al momento del clic
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.remove('paused');
        }).catch(err => {
            console.warn("Autoplay bloqueado por el navegador:", err);
            musicToggle.classList.add('paused');
        });

        // Transición directa y fluida hacia la invitación
        setTimeout(() => {
            welcomeScreen.classList.add('fade-out');
            mainContent.classList.remove('hidden');
            musicToggle.classList.remove('hidden'); // Aparece botón de control
            
            // Forzar renderizado de animaciones de scroll
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 150);
        }, 1200);
    });

    // Control Manual del Audio
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.add('paused');
        } else {
            bgMusic.play();
            musicToggle.classList.remove('paused');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // 2. TEMPORIZADOR (Meta: 19 Julio 2026)
    const eventDate = new Date('July 19, 2026 17:00:00').getTime();
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-container').innerHTML = "<p style='font-weight:600; color:#748BAA;'>¡El gran día de gala ha comenzado!</p>";
            return;
        }
        document.getElementById('days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById('minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById('seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);

    // 3. CANVAS DE PARTÍCULAS DORADAS
    const canvas = document.getElementById('sparkles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * -0.4 - 0.1; 
            this.opacity = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(243, 229, 171, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 45; i++) particlesArray.push(new Particle());
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // 4. OBSERVADOR DE ANIMACIONES ON-SCROLL
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-animate').forEach(section => {
        observer.observe(section);
    });

    // 5. GESTIÓN DEL FORMULARIO RSVP INTELIGENTE
    const rsvpForm = document.getElementById('rsvp-form');
    const attendanceStatus = document.getElementById('attendance-status');
    const guestsContainer = document.getElementById('guests-container');
    const guestCount = document.getElementById('guest-count');

    attendanceStatus.addEventListener('change', (e) => {
        if (e.target.value === 'yes') {
            guestsContainer.classList.remove('hidden-field');
            guestCount.setAttribute('required', 'required');
            guestsContainer.style.display = 'block';
            setTimeout(() => guestsContainer.style.opacity = '1', 10);
        } else {
            guestsContainer.style.opacity = '0';
            setTimeout(() => {
                guestsContainer.classList.add('hidden-field');
                guestsContainer.style.display = 'none';
            }, 300);
            guestCount.removeAttribute('required');
            guestCount.value = ""; 
        }
    });

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('guest-name').value.trim();
        const status = attendanceStatus.value;
        const count = guestCount.value;
        const targetPhone = "528113699406"; 
        
        let message = "";

        if (status === 'yes') {
            message = `¡Hola! Confirmo mi asistencia a los XV años de Linetth Alejandra (Lynne) ✨. Mi nombre es ${name} y asistiremos ${count} persona(s). ¡Qué emoción acompañarlos!`;
        } else {
            message = `¡Hola! Soy ${name}. Agradezco mucho la invitación a los XV años de Linetth Alejandra (Lynne), pero lamentablemente no podré asistir. ¡Les deseo una noche mágica de cuento de hadas! ✨`;
        }

        window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // 6. PROTECCIÓN ANTICOPIADO ACTIVA
    document.addEventListener('contextmenu', event => event.preventDefault()); 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });
});