/**
 * L'Ânnexe - Journal du Lycée
 * Main Script
 */

/* ==================== SUPABASE AUTH CONFIGURATION ==================== */ 
const SUPABASE_CONFIG = {
  url: 'https://eyyolesztcnxlvyxcywq.supabase.co',
  anonKey: 'sb_publishable_pxAaMNjZC5M5ss3eAjj9Wg_cbavpmSd'
};

let supabaseClient = null;
let currentAuthSession = null;
let activeAuthView = 'signin';

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

/* ==================== LOGIN (SUPABASE AUTH) ==================== */
function isSupabaseConfigured() {
  const { url, anonKey } = SUPABASE_CONFIG;
  if (!url || !anonKey) return false;
  if (url === 'VOTRE_URL_SUPABASE' || anonKey === 'VOTRE_CLE_ANON_PUBLIQUE_SUPABASE') return false;
  return url.startsWith('https://') && url.includes('.supabase.co');
}

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (!isSupabaseConfigured()) return null;
  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
    return null;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return supabaseClient;
}

function getAuthRedirectUrl() {
  if (!window.location.protocol.startsWith('http')) return undefined;
  return window.location.origin + window.location.pathname;
}

function tAuth(key, fallback) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  return (translations[lang] && translations[lang][key]) || fallback;
}

function setAuthFeedback(message, type = 'info') {
  const feedbackEl = document.getElementById('auth-feedback');
  if (!feedbackEl) return;

  if (!message) {
    feedbackEl.textContent = '';
    feedbackEl.hidden = true;
    feedbackEl.className = 'auth-feedback';
    return;
  }

  feedbackEl.textContent = message;
  feedbackEl.className = `auth-feedback ${type}`;
  feedbackEl.hidden = false;
}

function translateAuthError(error) {
  const msg = (error && error.message ? error.message : '').toLowerCase();

  if (msg.includes('invalid login credentials')) {
    return tAuth('err_invalid_credentials', 'Email ou mot de passe incorrect.');
  }
  if (msg.includes('email not confirmed')) {
    return tAuth('err_email_not_confirmed', 'Veuillez confirmer votre email avant de vous connecter.');
  }
  if (msg.includes('signups not allowed')) {
    return tAuth('err_signup_disabled', 'Les inscriptions publiques sont désactivées. Contactez la rédaction.');
  }
  if (msg.includes('user already registered')) {
    return tAuth('err_user_exists', 'Un compte existe déjà avec cet email.');
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return tAuth('err_weak_password', 'Le mot de passe doit contenir au moins 8 caractères.');
  }
  if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('security purposes')) {
    return tAuth('err_rate_limit', 'Trop de tentatives. Patientez quelques instants avant de réessayer.');
  }
  return tAuth('err_generic', 'Une erreur est survenue. Veuillez réessayer.');
}

function showAuthView(view) {
  activeAuthView = view;
  const views = {
    signin: document.getElementById('login-form'),
    signup: document.getElementById('signup-form'),
    forgot: document.getElementById('forgot-form'),
    recovery: document.getElementById('recovery-form'),
    account: document.getElementById('account-view')
  };
  const tabsEl = document.getElementById('auth-tabs');
  const titleEl = document.getElementById('auth-modal-title');
  const tabBtns = document.querySelectorAll('.auth-tab');

  Object.entries(views).forEach(([name, el]) => {
    if (el) el.hidden = name !== view;
  });

  if (tabsEl) {
    tabsEl.hidden = view !== 'signin' && view !== 'signup';
  }

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-auth-tab') === view);
  });

  const titleKeys = {
    signin: 'login_title',
    signup: 'signup_title',
    forgot: 'forgot_title',
    recovery: 'recovery_title',
    account: 'account_title'
  };
  if (titleEl) {
    const key = titleKeys[view] || 'login_title';
    titleEl.setAttribute('data-i18n', key);
    titleEl.textContent = tAuth(key, 'Connexion');
  }
}

function updateLoginButton() {
  const loginBtn = document.getElementById('login-btn');
  const accountEmailEl = document.getElementById('account-email');
  const accountRoleEl = document.getElementById('account-role');
  if (!loginBtn) return;

  const user = currentAuthSession && currentAuthSession.user ? currentAuthSession.user : null;

  if (user) {
    const displayName = user.email ? user.email.split('@')[0] : tAuth('account_title', 'Mon compte');
    loginBtn.textContent = displayName;
    loginBtn.classList.add('logged-in');
    loginBtn.dataset.loggedIn = 'true';

    if (accountEmailEl) {
      accountEmailEl.textContent = user.email || '';
    }
    if (accountRoleEl) {
      const role = user.app_metadata && user.app_metadata.role ? String(user.app_metadata.role) : '';
      accountRoleEl.textContent = role;
      accountRoleEl.hidden = !role;
    }
  } else {
    loginBtn.textContent = tAuth('login_button', 'Connexion');
    loginBtn.classList.remove('logged-in');
    loginBtn.dataset.loggedIn = 'false';

    if (accountEmailEl) accountEmailEl.textContent = '';
    if (accountRoleEl) {
      accountRoleEl.textContent = '';
      accountRoleEl.hidden = true;
    }
  }
}

function setFormBusy(form, busy) {
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = busy;
}

async function initLogin() {
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.getElementById('login-close');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');
  const recoveryForm = document.getElementById('recovery-form');
  const changePasswordForm = document.getElementById('change-password-form');
  const toggleChangePasswordBtn = document.getElementById('toggle-change-password-btn');
  const forgotPasswordBtn = document.getElementById('forgot-password-btn');
  const backToSigninBtn = document.getElementById('back-to-signin-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const emailInput = document.getElementById('login-email');
  const rememberCheckbox = document.getElementById('remember-me');
  const tabBtns = document.querySelectorAll('.auth-tab');

  // Nettoyage d'eventuelles anciennes sessions factices
  localStorage.removeItem('user-session');
  localStorage.removeItem('user-email');

  if (!loginBtn || !loginModal) return;

  const populateRememberedEmail = () => {
    const savedEmail = localStorage.getItem('remember-email');
    if (savedEmail && emailInput) {
      emailInput.value = savedEmail;
      if (rememberCheckbox) rememberCheckbox.checked = true;
    }
  };

  const openAuthModal = (preferredView) => {
    setAuthFeedback('');
    if (changePasswordForm) changePasswordForm.hidden = true;

    const targetView = preferredView || (currentAuthSession && currentAuthSession.user ? 'account' : 'signin');
    if (targetView === 'signin') {
      populateRememberedEmail();
    }
    showAuthView(targetView);

    if (!isSupabaseConfigured()) {
      setAuthFeedback(
        tAuth('err_not_configured', 'Authentification non configurée : ajoutez votre URL et clé publique Supabase dans script.js.'),
        'info'
      );
    } else if (typeof window.supabase === 'undefined') {
      setAuthFeedback(
        tAuth('err_sdk_missing', 'Service d’authentification indisponible. Vérifiez votre connexion.'),
        'error'
      );
    }

    loginModal.style.display = 'flex';
  };

  const closeAuthModal = () => {
    loginModal.style.display = 'none';
    setAuthFeedback('');
  };

  loginBtn.addEventListener('click', () => openAuthModal());
  if (loginClose) loginClose.addEventListener('click', closeAuthModal);

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) closeAuthModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal.style.display === 'flex') {
      closeAuthModal();
    }
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setAuthFeedback('');
      const tab = btn.getAttribute('data-auth-tab');
      if (tab === 'signin') populateRememberedEmail();
      showAuthView(tab);
    });
  });

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
      setAuthFeedback('');
      const forgotEmailInput = document.getElementById('forgot-email');
      if (forgotEmailInput && emailInput && emailInput.value) {
        forgotEmailInput.value = emailInput.value;
      }
      showAuthView('forgot');
    });
  }

  if (backToSigninBtn) {
    backToSigninBtn.addEventListener('click', () => {
      setAuthFeedback('');
      showAuthView('signin');
    });
  }

  if (toggleChangePasswordBtn && changePasswordForm) {
    toggleChangePasswordBtn.addEventListener('click', () => {
      setAuthFeedback('');
      changePasswordForm.hidden = !changePasswordForm.hidden;
    });
  }

  const client = getSupabaseClient();

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setAuthFeedback('');
      if (!client) {
        setAuthFeedback(tAuth('err_not_configured', 'Authentification Supabase non configurée.'), 'error');
        return;
      }

      const email = emailInput.value.trim();
      const password = document.getElementById('login-password').value;
      const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

      setFormBusy(loginForm, true);
      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
          setAuthFeedback(translateAuthError(error), 'error');
          return;
        }

        if (rememberMe) {
          localStorage.setItem('remember-email', email);
        } else {
          localStorage.removeItem('remember-email');
        }

        currentAuthSession = data.session;
        loginForm.reset();
        updateLoginButton();
        closeAuthModal();
      } catch {
        setAuthFeedback(tAuth('err_generic', 'Une erreur est survenue. Veuillez réessayer.'), 'error');
      } finally {
        setFormBusy(loginForm, false);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setAuthFeedback('');
      if (!client) {
        setAuthFeedback(tAuth('err_not_configured', 'Authentification Supabase non configurée.'), 'error');
        return;
      }

      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const passwordConfirm = document.getElementById('signup-password-confirm').value;

      if (password.length < 8) {
        setAuthFeedback(tAuth('err_weak_password', 'Le mot de passe doit contenir au moins 8 caractères.'), 'error');
        return;
      }
      if (password !== passwordConfirm) {
        setAuthFeedback(tAuth('err_password_mismatch', 'Les mots de passe ne correspondent pas.'), 'error');
        return;
      }

      setFormBusy(signupForm, true);
      try {
        const redirectTo = getAuthRedirectUrl();
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: redirectTo ? { emailRedirectTo: redirectTo } : undefined
        });

        if (error) {
          setAuthFeedback(translateAuthError(error), 'error');
          return;
        }

        signupForm.reset();
        if (data.session) {
          currentAuthSession = data.session;
          updateLoginButton();
          closeAuthModal();
        } else {
          setAuthFeedback(
            tAuth('signup_check_email', 'Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse.'),
            'success'
          );
        }
      } catch {
        setAuthFeedback(tAuth('err_generic', 'Une erreur est survenue. Veuillez réessayer.'), 'error');
      } finally {
        setFormBusy(signupForm, false);
      }
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setAuthFeedback('');
      if (!client) {
        setAuthFeedback(tAuth('err_not_configured', 'Authentification Supabase non configurée.'), 'error');
        return;
      }

      const email = document.getElementById('forgot-email').value.trim();
      setFormBusy(forgotForm, true);
      try {
        const redirectTo = getAuthRedirectUrl();
        const { error } = await client.auth.resetPasswordForEmail(
          email,
          redirectTo ? { redirectTo } : undefined
        );

        if (error) {
          setAuthFeedback(translateAuthError(error), 'error');
          return;
        }

        forgotForm.reset();
        setAuthFeedback(
          tAuth('forgot_sent', 'Si un compte existe pour cet email, un lien de réinitialisation vient d’être envoyé.'),
          'success'
        );
      } catch {
        setAuthFeedback(tAuth('err_generic', 'Une erreur est survenue. Veuillez réessayer.'), 'error');
      } finally {
        setFormBusy(forgotForm, false);
      }
    });
  }

  const handlePasswordUpdate = async (form, passId, confirmId) => {
    setAuthFeedback('');
    if (!client) return;

    const newPassword = document.getElementById(passId).value;
    const confirmPassword = document.getElementById(confirmId).value;

    if (newPassword.length < 8) {
      setAuthFeedback(tAuth('err_weak_password', 'Le mot de passe doit contenir au moins 8 caractères.'), 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthFeedback(tAuth('err_password_mismatch', 'Les mots de passe ne correspondent pas.'), 'error');
      return;
    }

    setFormBusy(form, true);
    try {
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) {
        setAuthFeedback(translateAuthError(error), 'error');
        return;
      }

      form.reset();
      if (form === changePasswordForm) changePasswordForm.hidden = true;
      showAuthView('account');
      setAuthFeedback(tAuth('password_updated', 'Mot de passe mis à jour avec succès.'), 'success');
    } catch {
      setAuthFeedback(tAuth('err_generic', 'Une erreur est survenue. Veuillez réessayer.'), 'error');
    } finally {
      setFormBusy(form, false);
    }
  };

  if (recoveryForm) {
    recoveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handlePasswordUpdate(recoveryForm, 'new-password', 'new-password-confirm');
    });
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handlePasswordUpdate(changePasswordForm, 'account-new-password', 'account-new-password-confirm');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (!client) return;
      logoutBtn.disabled = true;
      try {
        await client.auth.signOut();
      } finally {
        currentAuthSession = null;
        logoutBtn.disabled = false;
        updateLoginButton();
        closeAuthModal();
      }
    });
  }

  if (client) {
    client.auth.onAuthStateChange((event, session) => {
      currentAuthSession = session;
      updateLoginButton();

      if (event === 'PASSWORD_RECOVERY') {
        openAuthModal('recovery');
        setAuthFeedback(
          tAuth('recovery_prompt', 'Lien validé. Définissez votre nouveau mot de passe ci-dessous.'),
          'info'
        );
      }
    });

    try {
      const { data } = await client.auth.getSession();
      currentAuthSession = data ? data.session : null;
    } catch {
      currentAuthSession = null;
    }
  }

  if (window.location.hash && window.location.hash.includes('error_description=')) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const errDesc = hashParams.get('error_description');
    if (errDesc) {
      openAuthModal('signin');
      setAuthFeedback(tAuth('err_link_expired', 'Ce lien est invalide ou expiré. Veuillez recommencer.'), 'error');
    }
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  updateLoginButton();
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
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.getElementById('toggle-dark');
  if (!toggleBtn) return;

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
	nav_archives: "Archives",
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
    side3_title: "Les nouveaux projets du Lycée",
    archive_title: "Archives",
    archive_subtitle: "Retrouvez ici toutes les éditions du journal.",
    archive_ed2_title: "Édition N°2",
    archive_ed2_desc: "Volume 1 • N° 2 — Deuxième édition de L'Ânnexe",
    archive_ed1_title: "Édition N°1",
    archive_ed1_desc: "Volume 1 • N° 1 — Première édition de L'Ânnexe",
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
    insta_btn: "Instagram du Lycée (@annexe_pasteur) ↗",
    all_rights: "Tous droits réservés.",
    legal: "Mentions Légales",
    privacy: "Confidentialité",
    cookie_message: "Ce site utilise des cookies pour améliorer votre expérience. Nous respectons votre vie privée.",
    cookie_accept: "Accepter",
    cookie_reject: "Refuser",
    cookie_policy: "Plus d'infos",
    login_button: "Connexion",
    login_title: "Connexion",
    signup_title: "Inscription",
    forgot_title: "Mot de passe oublié",
    recovery_title: "Nouveau mot de passe",
    account_title: "Mon compte",
    tab_signin: "Connexion",
    tab_signup: "Inscription",
    login_password: "Mot de passe",
    confirm_password: "Confirmer le mot de passe",
    new_password: "Nouveau mot de passe",
    password_hint: "Minimum 8 caractères.",
    login_submit: "Se connecter",
    signup_submit: "Créer un compte",
    forgot_desc: "Entrez votre email pour recevoir un lien de réinitialisation sécurisé.",
    forgot_submit: "Envoyer le lien",
    back_to_signin: "← Retour à la connexion",
    recovery_desc: "Choisissez votre nouveau mot de passe.",
    recovery_submit: "Enregistrer le mot de passe",
    account_connected_as: "Connecté en tant que",
    change_password_btn: "Changer mon mot de passe",
    logout_btn: "Se déconnecter",
    remember_me: "Se souvenir de moi",
    forgot_password: "Mot de passe oublié?",
    signup_check_email: "Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse.",
    forgot_sent: "Si un compte existe pour cet email, un lien de réinitialisation vient d’être envoyé.",
    password_updated: "Mot de passe mis à jour avec succès.",
    recovery_prompt: "Lien validé. Définissez votre nouveau mot de passe ci-dessous.",
    err_not_configured: "Authentification non configurée : ajoutez votre URL et clé publique Supabase dans script.js.",
    err_sdk_missing: "Service d’authentification indisponible. Vérifiez votre connexion.",
    err_invalid_credentials: "Email ou mot de passe incorrect.",
    err_email_not_confirmed: "Veuillez confirmer votre email avant de vous connecter.",
    err_signup_disabled: "Les inscriptions publiques sont désactivées. Contactez la rédaction.",
    err_user_exists: "Un compte existe déjà avec cet email.",
    err_weak_password: "Le mot de passe doit contenir au moins 8 caractères.",
    err_password_mismatch: "Les mots de passe ne correspondent pas.",
    err_rate_limit: "Trop de tentatives. Patientez quelques instants avant de réessayer.",
    err_link_expired: "Ce lien est invalide ou expiré. Veuillez recommencer.",
    err_generic: "Une erreur est survenue. Veuillez réessayer."
  },
  en: {
    edition_vol: "Volume 1 • No. 1",
    location: "Avignon, France",
    nav_home: "Home",
    nav_journal: "The Journal",
	nav_archives: "Archives",
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
    side3_title: "New High School projects",
    archive_title: "Archives",
    archive_subtitle: "Find all editions of the newspaper here.",
    archive_ed2_title: "Edition No. 2",
    archive_ed2_desc: "Volume 1 • No. 2 — Second edition of L'Ânnexe",
    archive_ed1_title: "Edition No. 1",
    archive_ed1_desc: "Volume 1 • No. 1 — First edition of L'Ânnexe",
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
    insta_btn: "High School Instagram (@annexe_pasteur) ↗",
    all_rights: "All rights reserved.",
    legal: "Legal Notice",
    privacy: "Privacy Policy",
    cookie_message: "This site uses cookies to enhance your experience. We respect your privacy.",
    cookie_accept: "Accept",
    cookie_reject: "Reject",
    cookie_policy: "Learn more",
    login_button: "Login",
    login_title: "Login",
    signup_title: "Sign Up",
    forgot_title: "Forgot Password",
    recovery_title: "New Password",
    account_title: "My Account",
    tab_signin: "Sign In",
    tab_signup: "Sign Up",
    login_password: "Password",
    confirm_password: "Confirm password",
    new_password: "New password",
    password_hint: "Minimum 8 characters.",
    login_submit: "Sign in",
    signup_submit: "Create account",
    forgot_desc: "Enter your email to receive a secure password reset link.",
    forgot_submit: "Send reset link",
    back_to_signin: "← Back to sign in",
    recovery_desc: "Choose your new password.",
    recovery_submit: "Save password",
    account_connected_as: "Signed in as",
    change_password_btn: "Change password",
    logout_btn: "Sign out",
    remember_me: "Remember me",
    forgot_password: "Forgot password?",
    signup_check_email: "Account created! Check your inbox to confirm your email address.",
    forgot_sent: "If an account exists for this email, a reset link has been sent.",
    password_updated: "Password updated successfully.",
    recovery_prompt: "Link verified. Set your new password below.",
    err_not_configured: "Authentication not configured: add your Supabase URL and public key in script.js.",
    err_sdk_missing: "Authentication service unavailable. Please check your connection.",
    err_invalid_credentials: "Incorrect email or password.",
    err_email_not_confirmed: "Please confirm your email address before signing in.",
    err_signup_disabled: "Public sign-ups are disabled. Please contact the editorial office.",
    err_user_exists: "An account already exists with this email.",
    err_weak_password: "Password must be at least 8 characters long.",
    err_password_mismatch: "Passwords do not match.",
    err_rate_limit: "Too many attempts. Please wait a moment before trying again.",
    err_link_expired: "This link is invalid or expired. Please request a new one.",
    err_generic: "An error occurred. Please try again."
  }
};

function initI18n() {
  const langBtns = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('lang') || 'fr';

  langBtns.forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === savedLang);
  });

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
    if (el.id === 'login-btn' && el.dataset.loggedIn === 'true') return;
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  updateLoginButton();
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
