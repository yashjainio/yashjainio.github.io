// ===== PARTICLE NETWORK =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.r  = Math.random() * 1.2 + 0.3;
        this.a  = Math.random() * 0.35 + 0.05;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,53,${this.a})`;
        ctx.fill();
    }
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 130) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255,107,53,${(1 - d / 130) * 0.12})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animParticles);
}

function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: 55 }, () => new Particle());
    animParticles();
}

window.addEventListener('resize', resizeCanvas);
initParticles();

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
    { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    revealObs.observe(el);
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ===== HAMBURGER =====
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link, .mobile-resume').forEach(link =>
    link.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

// ===== TYPEWRITER =====
const phrases = [
    'AI | LLMs | Agents | ML',
    'Python | FastAPI | Flask | Django',
    'Making Complex Things Simple 💻',
    'LangChain | LangGraph | RAG Systems',
    'Always Curious. Always Shipping. 🚀',
];
const typeEl = document.getElementById('typewriter');
let pi = 0, ci = 0, del = false;

function type() {
    const cur = phrases[pi];
    if (!del) {
        typeEl.textContent = cur.slice(0, ci + 1);
        ci++;
        if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
        setTimeout(type, 68);
    } else {
        typeEl.textContent = cur.slice(0, ci - 1);
        ci--;
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 400); return; }
        setTimeout(type, 34);
    }
}
setTimeout(type, 1000);

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('nav a');
const secObs    = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const a = document.querySelector(`nav a[href="#${e.target.id}"]`);
            if (a) a.classList.add('active');
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

// ===== 3D CARD TILT =====
function addTilt(sel) {
    document.querySelectorAll(sel).forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, border-color 0.3s, background 0.3s, box-shadow 0.3s';
        });
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform =
                `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-6px) scale(1.01)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition =
                'transform 0.6s cubic-bezier(.16,1,.3,1), border-color 0.3s, background 0.3s, box-shadow 0.3s';
            card.style.transform = '';
        });
    });
}
addTilt('.project-card');
addTilt('.timeline-content');
addTilt('.skill-group');
addTilt('.edu-card');
addTilt('.awards-card');

// ===== METRIC COUNTER =====
function animCount(el) {
    const raw    = el.textContent;
    const m      = raw.match(/(\d+)/);
    if (!m) return;
    const target = parseInt(m[1]);
    const pre    = raw.slice(0, m.index);
    const suf    = raw.slice(m.index + m[0].length);
    const t0     = performance.now();
    const dur    = 1200;

    function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(e * target) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.classList.add('counted');
    }
    requestAnimationFrame(tick);
}

const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { animCount(e.target); cntObs.unobserve(e.target); }
    });
}, { threshold: 0.6 });
document.querySelectorAll('.metric').forEach(el => cntObs.observe(el));

// ===== MOUSE PARALLAX (HERO IMAGE) =====
const imgFrame = document.querySelector('.image-frame');
if (imgFrame) {
    document.addEventListener('mousemove', e => {
        const dx = e.clientX / window.innerWidth  - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        imgFrame.style.transform = `translate(${dx * 15}px, ${dy * 15}px)`;
    });
}
