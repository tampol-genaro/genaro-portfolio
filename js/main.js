(function () {
  'use strict';

  // ===== Particle Background =====
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor(window.innerWidth / 15), 80);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p, i) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, ' + p.opacity + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    function initParticles() {
      resizeCanvas();
      createParticles();
      cancelAnimationFrame(animationId);
      drawParticles();
    }

    initParticles();
    window.addEventListener('resize', initParticles);
  }

  // ===== Navbar Scroll Effect =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== Mobile Nav Toggle =====
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkElements.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===== Typing Effect =====
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const phrases = [
      'Aspiring IT Professional',
      'Entry-Level IT Candidate',
      'Homelab Builder',
      'IT Support Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // ===== Scroll Reveal =====
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===== Counter Animation =====
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const counterElements = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ===== Skill Bars Animation =====
  const skillBars = document.querySelectorAll('.skill-bar');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const percent = entry.target.getAttribute('data-percent');
            const fill = entry.target.querySelector('.skill-fill');
            if (fill && percent) {
              fill.style.width = percent + '%';
            }
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillBars.forEach(function (bar) {
      skillObserver.observe(bar);
    });
  }

  // ===== Card Tilt Effect =====
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // ===== Contact Form =====
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      formStatus.className = 'form-status';
      formStatus.textContent = '';

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill in all fields.';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please enter a valid email address.';
        return;
      }

      const subject = encodeURIComponent('Portfolio Contact from ' + name.value.trim());
      const body = encodeURIComponent(
        'Name: ' + name.value.trim() + '\nEmail: ' + email.value.trim() + '\n\n' + message.value.trim()
      );

      window.location.href = 'mailto:genarotampol13@gmail.com?subject=' + subject + '&body=' + body;

      formStatus.className = 'form-status success';
      formStatus.textContent = 'Opening your email client...';
      contactForm.reset();
    });
  }
})();
