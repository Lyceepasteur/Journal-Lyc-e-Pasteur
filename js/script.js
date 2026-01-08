/**
 * L'Ânnexe - Journal du Lycée
 * Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
  initLogin();
  initDate();
  initTheme();
  initI18n();
  initStats();
  initContactForm();
});

/* ==================== COOKIE CONSENT ==================== */
function initCookieConsent() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  
  if (!cookieBanner) return;

  const consentGiven = localStorage.getItem('cookie-consent');
  
  if (consentGiven) {
    cookieBanner.style.display = 'none';
    if (consentGiven === 'accepted') {
      enableAnalytics();
    }
  } else {
    cookieBanner.style.display = 'flex';
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    enableAnalytics();
    cookieBanner.style.display = 'none';
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
    cookieBanner.style.display = 'none';
  });
}

function enableAnalytics() {
}

/* ==================== LOGIN ==================== */
function initLogin() {
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.getElementById('login-close');
  const loginForm = document.getElementById('login-form');
  
  if (!loginBtn || !loginModal) return;

  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
  });

  loginClose.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const rememberMe = document.getElementById('remember-me').checked;

    localStorage.setItem('user-email', email);
    localStorage.setItem('user-session', 'active');
    if (rememberMe) {
      localStorage.setItem('remember-email', email);
    }
    
    alert(document.documentElement.lang === 'fr' ? 'Connexion réussie!' : 'Login successful!');
    loginForm.reset();
    loginModal.style.display = 'none';
    
    updateLoginButton();
  });

  updateLoginButton();
}

function updateLoginButton() {
  const loginBtn = document.getElementById('login-btn');
  const userSession = localStorage.getItem('user-session');
  const userEmail = localStorage.getItem('user-email');
  
  if (userSession === 'active') {
    loginBtn.textContent = userEmail ? userEmail.split('@')[0] : (document.documentElement.lang === 'fr' ? 'Déconnexion' : 'Logout');
    loginBtn.classList.add('logged-in');
    
    loginBtn.onclick = () => {
      localStorage.removeItem('user-email');
      localStorage.removeItem('user-session');
      alert(document.documentElement.lang === 'fr' ? 'Déconnecté' : 'Logged out');
      updateLoginButton();
    };
  } else {
    loginBtn.textContent = document.documentElement.lang === 'fr' ? 'Connexion' : 'Login';
    loginBtn.classList.remove('logged-in');
    loginBtn.onclick = () => {
      document.getElementById('login-modal').style.display = 'flex';
    };
  }
}

/* ==================== DATE ==================== */
function initDate() {
  const dateEl = document.getElementById('current-date');
  if (!dateEl) return;
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const lang = document.documentElement.lang || 'fr';
  dateEl.textContent = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', options);
}

/* ==================== THEME ==================== */
function initTheme() {
  const toggleBtn = document.getElementById('toggle-dark');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==================== I18N ==================== */
const translations = {
  fr: {
    edition_vol: "Volume 1 • N° 1",
    location: "Avignon, France",
    nav_home: "Accueil",
    nav_journal: "Le Journal",
    nav_articles: "Rubriques",
    nav_team: "L'Équipe",
    nav_contact: "Contact",
    cat_edito: "ÉDITO",
    hero_title: "Bienvenue dans la nouvelle ère de L'Ânnexe",
    hero_excerpt: "Votre journal étudiant fait peau neuve. Plus moderne, plus engagé, plus proche de vous. Découvrez notre vision pour ce nouveau chapitre de la vie lycéenne.",
    read_more_btn: "Lire l'édition complète",
    trending_now: "À LA UNE",
    cat_culture: "CULTURE",
    side1_title: "Sélection culturelle de l'hiver",
    cat_sport: "SPORT",
    side2_title: "Nos équipes brillent en championnat",
    cat_vie: "VIE LYCÉENNE",
    side3_title: "Les nouveaux projets du CVL",
    journal_title: "Édition Interactive",
    journal_subtitle: "Feuilletez le dernier numéro comme si vous y étiez",
    stat_edition: "Édition",
    stat_articles: "Articles",
    stat_team: "Membres",
    stat_pages: "Pages",
    rubrics_title: "Dernières Rubriques",
    filter_all: "Toutes",
    cat_actu: "ACTUALITÉS",
    art1_title: "Interview du Proviseur",
    art1_excerpt: "Découvrez les projets et la vision de notre chef d'établissement pour cette nouvelle année scolaire...",
    art2_title: "Retour sur la Fête de la Science",
    art2_excerpt: "Expériences, découvertes et passion : retour sur les moments forts de cet événement scientifique...",
    art3_title: "Le Club de Théâtre en répétition",
    art3_excerpt: "Plongée au cœur des coulisses de la future pièce de théâtre montée par nos talentueux élèves...",
    art4_title: "Conseils pour réussir ses examens",
    art4_excerpt: "Nos meilleures astuces pour réviser efficacement et aborder les épreuves avec sérénité...",
    team_title: "Le Comité de Rédaction",
    role_chief: "RÉDACTEUR EN CHEF",
    role_chief_desc: "Vision éditoriale et coordination",
    role_journalists: "JOURNALISTES",
    role_journalists_desc: "Investigation et rédaction",
    role_design: "GRAPHISME",
    role_design_desc: "Mise en page et identité visuelle",
    role_photo: "PHOTOGRAPHIE",
    role_photo_desc: "Reportages visuels",
    contact_title: "Nous Écrire",
    label_name: "Nom",
    label_email: "Email",
    label_subject: "Sujet",
    opt_select: "Choisir...",
    opt_article: "Proposer un article",
    opt_suggestion: "Suggestion",
    opt_team: "Rejoindre l'équipe",
    label_message: "Message",
    btn_send: "Envoyer le message",
    find_us: "Où nous trouver",
    label_office: "Rédaction",
    label_mail: "Contact Direct",
    all_rights: "Tous droits réservés.",
    legal: "Mentions Légales",
    privacy: "Confidentialité",
    cookie_message: "Ce site utilise des cookies pour améliorer votre expérience. Nous respectons votre vie privée.",
    cookie_accept: "Accepter",
    cookie_reject: "Refuser",
    cookie_policy: "Plus d'infos",
    login_button: "Connexion",
    login_title: "Connexion",
    login_password: "Mot de passe",
    login_submit: "Se connecter",
    remember_me: "Se souvenir de moi",
    forgot_password: "Mot de passe oublié?"
  },
  en: {
    edition_vol: "Volume 1 • No. 1",
    location: "Avignon, France",
    nav_home: "Home",
    nav_journal: "The Journal",
    nav_articles: "Sections",
    nav_team: "The Team",
    nav_contact: "Contact",
    cat_edito: "EDITORIAL",
    hero_title: "Welcome to the new era of L'Ânnexe",
    hero_excerpt: "Your student newspaper has a new look. More modern, more engaged, closer to you. Discover our vision for this new chapter of high school life.",
    read_more_btn: "Read the full edition",
    trending_now: "TRENDING",
    cat_culture: "CULTURE",
    side1_title: "Winter cultural selection",
    cat_sport: "SPORT",
    side2_title: "Our teams shine in the championship",
    cat_vie: "STUDENT LIFE",
    side3_title: "New CVL projects",
    journal_title: "Interactive Edition",
    journal_subtitle: "Flip through the latest issue as if you were there",
    stat_edition: "Edition",
    stat_articles: "Articles",
    stat_team: "Members",
    stat_pages: "Pages",
    rubrics_title: "Latest Sections",
    filter_all: "All",
    cat_actu: "NEWS",
    art1_title: "Interview with the Principal",
    art1_excerpt: "Discover the projects and vision of our head of school for this new school year...",
    art2_title: "Science Fair Highlights",
    art2_excerpt: "Experiments, discoveries, and passion: a look back at the highlights of this scientific event...",
    art3_title: "Drama Club in Rehearsal",
    art3_excerpt: "A dive into the backstage of the future play staged by our talented students...",
    art4_title: "Tips for Exam Success",
    art4_excerpt: "Our best tips for revising effectively and approaching exams with confidence...",
    team_title: "Editorial Board",
    role_chief: "EDITOR-IN-CHIEF",
    role_chief_desc: "Editorial vision and coordination",
    role_journalists: "JOURNALISTS",
    role_journalists_desc: "Investigation and writing",
    role_design: "GRAPHIC DESIGN",
    role_design_desc: "Layout and visual identity",
    role_photo: "PHOTOGRAPHY",
    role_photo_desc: "Visual reporting",
    contact_title: "Write to Us",
    label_name: "Name",
    label_email: "Email",
    label_subject: "Subject",
    opt_select: "Choose...",
    opt_article: "Suggest an article",
    opt_suggestion: "Suggestion",
    opt_team: "Join the team",
    label_message: "Message",
    btn_send: "Send message",
    find_us: "Find Us",
    label_office: "Editorial Office",
    label_mail: "Direct Contact",
    all_rights: "All rights reserved.",
    legal: "Legal Notice",
    privacy: "Privacy Policy",
    cookie_message: "This site uses cookies to enhance your experience. We respect your privacy.",
    cookie_accept: "Accept",
    cookie_reject: "Reject",
    cookie_policy: "Learn more",
    login_button: "Login",
    login_title: "Login",
    login_password: "Password",
    login_submit: "Sign in",
    remember_me: "Remember me",
    forgot_password: "Forgot password?"
  }
};

function initI18n() {
  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('lang') || 'fr';
  
  updateLanguage(savedLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      updateLanguage(lang);
      localStorage.setItem('lang', lang);
      
      // Update UI active state
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function updateLanguage(lang) {
  document.documentElement.lang = lang;
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  initDate(); // Refresh date format
}

/* ==================== STATS COUNTER ==================== */
function initStats() {
  const stats = document.querySelectorAll('.stat-value');
  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

function animateStat(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000; // 2s
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(progress * target);
    
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ==================== CONTACT FORM ==================== */
function initContactForm() {
  const form = document.getElementById('newspaper-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = document.documentElement.lang === 'fr' ? 'Envoi en cours...' : 'Sending...';
  });
}
