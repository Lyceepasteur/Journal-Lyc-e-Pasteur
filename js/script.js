/* ==================== VARIABLES & THEMES ==================== */
:root {
  /* Newspaper Palette */
  --ink: #1a1a1a;
  --paper: #fdfaf6;
  --sepia: #704214;
  --accent: #028A0F; /* Keeping a touch of the original green as secondary accent */
  --gray-light: #e0e0e0;
  --gray-medium: #757575;
  
  /* Dark Mode Palette */
  --ink-dark: #e8e8e8;
  --paper-dark: #121212;
  
  /* Fonts */
  --font-title: 'Playfair Display', serif;
  --font-body: 'Lora', serif;
  --font-sans: 'Montserrat', sans-serif;
  
  /* Spacing & Misc */
  --container-width: 1200px;
  --transition: all 0.3s ease;
  --border-style: 1px solid var(--ink);
}

[data-theme="dark"] {
  --ink: var(--ink-dark);
  --paper: var(--paper-dark);
  --gray-light: #333;
  --border-style: 1px solid var(--ink-dark);
}

/* ==================== RESET & BASE ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.6;
  transition: var(--transition);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 20px;
}

a {
  color: inherit;
  text-decoration: none;
  transition: var(--transition);
}

/* ==================== COOKIE CONSENT ==================== */
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--paper);
  border-top: 2px solid var(--ink);
  padding: 20px;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  font-family: var(--font-sans);
}

.cookie-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.cookie-content p {
  margin: 0;
  font-size: 0.95rem;
  flex: 1;
}

.cookie-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
  white-space: nowrap;
}

.cookie-btn {
  padding: 8px 16px;
  border: 1px solid var(--ink);
  background-color: transparent;
  color: var(--ink);
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: var(--transition);
}

.cookie-btn.accept {
  background-color: var(--accent);
  color: white;
  border-color: var(--accent);
}

.cookie-btn.accept:hover {
  opacity: 0.9;
}

.cookie-btn.reject:hover {
  background-color: var(--ink);
  color: var(--paper);
}

.cookie-link {
  color: var(--sepia);
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: underline;
}

.cookie-link:hover {
  color: var(--ink);
}

@media (max-width: 768px) {
  .cookie-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .cookie-content p {
    margin-bottom: 10px;
  }

  .cookie-buttons {
    width: 100%;
    justify-content: flex-start;
  }
}

/* ==================== LOGIN MODAL ==================== */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.login-content {
  background-color: var(--paper);
  padding: 40px;
  border: 2px solid var(--ink);
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--ink);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-close:hover {
  color: var(--sepia);
}

.login-content h2 {
  font-family: var(--font-title);
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.login-content .form-group {
  margin-bottom: 20px;
}

.login-content .form-group label {
  display: block;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.login-content .form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--gray-light);
  font-family: var(--font-body);
  font-size: 1rem;
  box-sizing: border-box;
}

.login-content .form-group input:focus {
  outline: none;
  border-color: var(--sepia);
}

.login-content .btn-newspaper {
  width: 100%;
  text-align: center;
  display: block;
  margin-top: 10px;
}

.login-btn {
  background: none;
  border: none;
  color: var(--gray-medium);
  cursor: pointer;
  font-weight: 700;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  text-transform: uppercase;
  padding: 2px 8px;
  transition: var(--transition);
}

.login-btn:hover {
  color: var(--sepia);
}

.login-btn.logged-in {
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 5px 10px;
}

@media (max-width: 768px) {
  .login-content {
    padding: 30px 20px;
  }

  .login-content h2 {
    font-size: 1.5rem;
  }
}

/* ==================== TOP BAR = { Utility } ==================== */
.top-bar {
  border-bottom: 3px double var(--ink);
  padding: 10px 0;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.language-selector {
  display: flex;
  gap: 5px;
  align-items: center;
}

.lang-btn {
  background: none;
  border: none;
  color: var(--gray-medium);
  cursor: pointer;
  font-weight: 700;
  padding: 2px 5px;
}

.lang-btn.active {
  color: var(--ink);
  border-bottom: 2px solid var(--sepia);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

.sun-icon { display: none; }
[data-theme="dark"] .sun-icon { display: inline; }
[data-theme="dark"] .moon-icon { display: none; }

/* ==================== MASTHEAD ==================== */
.masthead {
  padding: 40px 0 20px;
  text-align: center;
  border-bottom: 1px solid var(--ink);
}

.masthead-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-logo {
  font-family: var(--font-title);
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1;
}

.edition-info {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  width: 150px;
}

.edition-info.left { text-align: left; }
.edition-info.right { text-align: right; }

.main-nav {
  margin-top: 20px;
  border-top: 1px solid var(--ink);
  padding-top: 15px;
}

.nav-links {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 40px;
  font-family: var(--font-sans);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-link:hover, .nav-link.active {
  color: var(--sepia);
}

/* ==================== HERO FRONTPAGE ==================== */
.hero-frontpage {
  padding: 40px 0;
  border-bottom: 2px solid var(--ink);
}

.hero-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.main-feature {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid var(--gray-light);
  padding-right: 40px;
}

.featured-article .category-tag {
  background-color: var(--ink);
  color: var(--paper);
  padding: 4px 12px;
  display: inline-block;
  font-family: var(--font-sans);
  font-weight: 700;
  margin-bottom: 15px;
}

.article-title.large {
  font-family: var(--font-title);
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 15px;
}

.article-meta {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--gray-medium);
  margin-bottom: 20px;
}

.article-excerpt {
  font-size: 1.2rem;
  margin-bottom: 25px;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  filter: grayscale(0.2) contrast(1.1);
  border: 1px solid var(--ink);
}

.side-features .side-title {
  font-family: var(--font-sans);
  border-bottom: 2px solid var(--ink);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.side-article {
  padding: 20px 0;
  border-bottom: 1px solid var(--gray-light);
}

.side-article:last-child { border-bottom: none; }

.side-article h4 {
  font-family: var(--font-title);
  font-size: 1.4rem;
  margin-top: 10px;
}

.btn-newspaper {
  display: inline-block;
  padding: 12px 30px;
  border: 2px solid var(--ink);
  font-family: var(--font-sans);
  font-weight: 700;
  text-transform: uppercase;
  background-color: transparent;
  color: var(--ink);
}

.btn-newspaper:hover {
  background-color: var(--ink);
  color: var(--paper);
}

/* ==================== SECTIONS GENERAL ==================== */
.section-header-newspaper {
  text-align: center;
  margin-bottom: 50px;
}

.section-header-newspaper h2 {
  font-family: var(--font-title);
  font-size: 3rem;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.section-header-newspaper h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background: var(--ink);
}

.section-subtitle {
  margin-top: 15px;
  color: var(--gray-medium);
  font-style: italic;
}

/* ==================== JOURNAL SECTION ==================== */
.journal-section {
  padding: 80px 0;
  background-color: rgba(112, 66, 20, 0.03);
  border-bottom: 1px solid var(--ink);
}

.flipbook-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.flipbook-container {
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
  border: 5px solid white;
  margin-bottom: 40px;
}

.flipbook-iframe {
  width: 100%;
  height: 600px;
  border: none;
}

.journal-stats-newspaper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  padding: 20px;
  border: 1px solid var(--gray-light);
  background: var(--paper);
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-family: var(--font-title);
  font-weight: 900;
  color: var(--sepia);
}

.stat-label {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
}

/* ==================== ARTICLES GRID ==================== */
.articles-grid-section {
  padding: 80px 0;
  border-bottom: 1px solid var(--ink);
}

.filter-controls {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-btn {
  background: none;
  border: 1px solid var(--gray-light);
  padding: 8px 20px;
  font-family: var(--font-sans);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
}

.filter-btn.active, .filter-btn:hover {
  background-color: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.newspaper-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.news-card {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--gray-light);
}

.card-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border: 1px solid var(--gray-light);
}

.card-content h3 {
  font-family: var(--font-title);
  font-size: 1.8rem;
  margin: 10px 0;
}

/* ==================== TEAM SECTION ==================== */
.team-newspaper {
  padding: 80px 0;
  border-bottom: 1px solid var(--ink);
}

.team-grid-newspaper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.team-member-card {
  padding: 30px;
  border: 1px solid var(--ink);
  text-align: center;
}

.member-role {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 900;
  color: var(--paper);
  background: var(--ink);
  padding: 2px 10px;
  display: inline-block;
  margin-bottom: 15px;
}

.team-member-card h3 {
  font-family: var(--font-title);
  margin-bottom: 10px;
}

.team-member-card p {
  font-size: 0.9rem;
  color: var(--gray-medium);
}

/* ==================== CONTACT SECTION ==================== */
.contact-newspaper {
  padding: 80px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--gray-light);
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
}

.btn-newspaper-submit {
  width: 100%;
  padding: 15px;
  background: var(--ink);
  color: var(--paper);
  border: none;
  font-family: var(--font-sans);
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}

.contact-info-newspaper h2 {
  margin-bottom: 30px;
}

.info-block {
  margin-bottom: 25px;
}

.info-block h4 {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.social-links-newspaper {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.social-links-newspaper a {
  font-family: var(--font-sans);
  font-weight: 700;
  text-decoration: underline;
}

/* ==================== FOOTER ==================== */
.footer-newspaper {
  background: var(--ink);
  color: var(--paper);
  padding: 40px 0;
  font-family: var(--font-sans);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.footer-links {
  display: flex;
  gap: 20px;
}

/* ==================== ANIMATIONS ==================== */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes mastheadFade {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.featured-article, .news-card, .team-member-card {
  animation: fadeIn 0.8s ease forwards;
}

.masthead {
  animation: mastheadFade 1.2s ease-out forwards;
}

/* ==================== LEGAL PAGES ==================== */
.legal-page .masthead {
  padding: 20px 0;
}

.legal-content {
  max-width: 800px;
  margin: 60px auto;
  padding: 40px;
  background: var(--paper);
  border: 1px solid var(--ink);
  box-shadow: 10px 10px 0 var(--ink);
}

.legal-section-text h2 {
  font-family: var(--font-title);
  font-size: 2.5rem;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 10px;
}

.legal-section-text h3 {
  font-family: var(--font-sans);
  text-transform: uppercase;
  font-size: 1rem;
  margin: 25px 0 10px;
  color: var(--sepia);
}

.legal-section-text p {
  margin-bottom: 15px;
}

.back-link {
  margin-top: 40px;
  text-align: center;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 992px) {
  .hero-grid, .contact-grid { grid-template-columns: 1fr; }
  .main-feature { border-right: none; padding-right: 0; }
  .newspaper-grid { grid-template-columns: repeat(2, 1fr); }
  .team-grid-newspaper { grid-template-columns: repeat(2, 1fr); }
  .main-logo { font-size: 3.5rem; }
}

@media (max-width: 600px) {
  .nav-links { gap: 15px; font-size: 0.7rem; flex-wrap: wrap; }
  .newspaper-grid, .team-grid-newspaper, .journal-stats-newspaper { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .main-logo { font-size: 2.5rem; }
  .article-title.large { font-size: 2rem; }
}
