// ==================== DARK MODE TOGGLE ====================
const toggleDark = document.getElementById('toggle-dark');
const body = document.body;

// Charger le thème sauvegardé
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
}

toggleDark.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  // Sauvegarder la préférence
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// ==================== EASTER EGG - TITRE ====================
const titleA = document.getElementById('title-a');
if (titleA) {
  titleA.addEventListener('click', () => {
    alert("🎉 Le campus, ou.. L'annexe, ou.... peut-être bien le parking...? 🚗");
  });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== NAVIGATION ACTIVE LINK ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==================== CAROUSEL ====================
const track = document.querySelector('.carousel-track');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;

// Créer les dots
items.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('carousel-dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(document.querySelectorAll('.carousel-dot'));

function updateCarousel() {
  const width = items[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentIndex * width}px)`;
  
  // Mettre à jour les dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto-scroll du carousel (toutes les 5 secondes)
let autoSlide = setInterval(nextSlide, 5000);

// Pause au hover
track.addEventListener('mouseenter', () => {
  clearInterval(autoSlide);
});

track.addEventListener('mouseleave', () => {
  autoSlide = setInterval(nextSlide, 5000);
});

// Responsive carousel
window.addEventListener('resize', updateCarousel);

// ==================== FILTER ARTICLES ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const articles = document.querySelectorAll('.article-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Retirer active de tous les boutons
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    
    articles.forEach(article => {
      const category = article.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        article.style.display = 'block';
        article.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        article.style.display = 'none';
      }
    });
  });
});

// ==================== ANIMATED COUNTERS ====================
const counters = document.querySelectorAll('.stat-number');

const animateCounter = (counter) => {
  const target = parseInt(counter.getAttribute('data-target'));
  const duration = 2000; // 2 secondes
  const increment = target / (duration / 16); // 60 FPS
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counter.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  };
  
  updateCounter();
};

// Observer pour détecter quand les stats sont visibles
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      animateCounter(counter);
      statsObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => statsObserver.observe(counter));

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Appliquer l'animation à tous les éléments qui doivent apparaître
const elementsToAnimate = document.querySelectorAll('.article-card, .team-card, .glass-card');
elementsToAnimate.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(50px)';
  el.style.transition = 'all 0.6s ease';
  fadeInObserver.observe(el);
});

// ==================== FORM SUBMISSION ====================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validation simple
    if (name && email && subject && message) {
      // Animation de succès
      const submitBtn = contactForm.querySelector('.btn-submit');
      submitBtn.textContent = '✓ Message envoyé !';
      submitBtn.style.background = '#28a745';
      
      // Reset après 3 secondes
      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = 'Envoyer le message';
        submitBtn.style.background = '';
      }, 3000);
      
      // Ici tu pourrais ajouter l'envoi réel du formulaire
      console.log('Formulaire soumis:', { name, email, subject, message });
    } else {
      alert('Veuillez remplir tous les champs !');
    }
  });
}

// ==================== NAVBAR SCROLL EFFECT ====================
const nav = document.querySelector('.glass-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Ajouter une ombre quand on scroll
  if (currentScroll > 100) {
    nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
  } else {
    nav.style.boxShadow = 'none';
  }
  
  // Cacher/afficher la nav au scroll (optionnel)
  /*
  if (currentScroll > lastScroll && currentScroll > 500) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  */
  
  lastScroll = currentScroll;
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero-background');
  
  parallaxElements.forEach(el => {
    el.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
});

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
  // Flèches gauche/droite pour le carousel
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
});

// ==================== HOVER EFFECTS ENHANCED ====================
const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
  card.addEventListener('mouseenter', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🎉 Bienvenue sur L\'Ânnexe ! 🎉', 'font-size: 20px; font-weight: bold; color: #028A0F;');
console.log('%cSite web développé avec ❤️ pour le journal du lycée', 'font-size: 14px; color: #666;');
console.log('%c💡 Easter egg: Clique sur le "Â" du titre !', 'font-size: 12px; color: #028A0F; font-style: italic;');

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy loading pour les images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================== EASTER EGG - KONAMI CODE ====================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join('') === konamiSequence.join('')) {
    document.body.style.animation = 'rainbow 2s infinite';
    alert('🎮 Konami Code activé ! Mode arc-en-ciel ! 🌈');
    
    // Ajouter l'animation rainbow
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});
