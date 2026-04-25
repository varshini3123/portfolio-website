/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Grow cursor ring on interactive elements
const hoverTargets = 'a, button, .project-card, .experience-card, .tech-chip, .design-card';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close nav when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
const PARTICLE_COLORS = ['#6366f1', '#ec4899', '#22d3ee', '#f59e0b'];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height;
    this.size   = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.color  = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x > canvas.width)  this.x = 0;
    if (this.x < 0)             this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0)             this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  // Scale count to viewport area; cap at 100
  const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / 150)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================================
   INTERSECTION OBSERVER — scroll-triggered reveals & skill bars
   ============================================================ */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      // Animate skill bar width when it enters the viewport
      if (entry.target.classList.contains('skill-item')) {
        const targetWidth = entry.target.dataset.skill;
        const fill = entry.target.querySelector('.skill-fill');
        setTimeout(() => { fill.style.width = targetWidth + '%'; }, 200);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

const observedSelectors = [
  '.reveal',
  '.reveal-left',
  '.reveal-right',
  '.skill-item',
  '.tech-chip',
  '.timeline-item',
  '.project-card',
  '.design-card',
  '.education-card',
  '.language-badge',
  '.achievement-card',
  '.contact-card',
  '.soft-skill-card',
].join(', ');

document.querySelectorAll(observedSelectors).forEach(el => observer.observe(el));

/* ============================================================
   STAGGERED TRANSITION DELAYS
   ============================================================ */
const staggerGroups = [
  { selector: '.tech-chip',       delay: 0.05 },
  { selector: '.timeline-item',   delay: 0.20 },
  { selector: '.project-card',    delay: 0.10 },
  { selector: '.design-card',     delay: 0.10 },
  { selector: '.contact-card',    delay: 0.10 },
  { selector: '.soft-skill-card', delay: 0.10 },
  { selector: '.language-badge',  delay: 0.15 },
  { selector: '.achievement-card',delay: 0.15 },
];

staggerGroups.forEach(({ selector, delay }) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * delay}s`;
  });
});
