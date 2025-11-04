/**
 * Main Application Controller
 * Coordinates all modules and handles initialization
 */

class ResearchGroupWebsite {
  constructor() {
    this.currentLang = 'en';
    this.config = {};
    this.modules = {};
    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      this.showLoadingState();

      // Load configuration
      await this.loadConfiguration();

      // Initialize modules
      await this.initializeModules();

      // Setup event listeners
      this.setupEventListeners();

      // Apply initial language
      this.applyLanguage(this.currentLang);

      // Hide loading state
      this.hideLoadingState();

      this.initialized = true;
      console.log('Research Group Website initialized successfully');
    } catch (error) {
      console.error('Failed to initialize website:', error);
      this.showErrorMessage('Failed to load website. Please refresh the page.');
    }
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    const loadingHTML = `
      <div id="loading-overlay" class="loading-overlay">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.remove(), 300);
    }
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    this.hideLoadingState();
    const errorHTML = `
      <div class="error-overlay">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Oops! Something went wrong</h2>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', errorHTML);
  }

  /**
   * Load configuration data
   */
  async loadConfiguration() {
    try {
      const [labInfo, researchAreas, members, publications, themeConfig, i18n] = await Promise.all([
        window.dataLoader.loadLabInfo(),
        window.dataLoader.loadResearchAreas(),
        window.dataLoader.loadMembers(),
        window.dataLoader.loadPublications(),
        window.dataLoader.loadThemeConfig(),
        window.dataLoader.loadI18n()
      ]);

      this.config = {
        lab: labInfo,
        research: researchAreas,
        members: members,
        publications: publications,
        theme: themeConfig,
        i18n: i18n
      };

      // Apply theme configuration
      this.applyThemeConfig(themeConfig);

    } catch (error) {
      console.error('Error loading configuration:', error);
      throw error;
    }
  }

  /**
   * Apply theme configuration
   */
  applyThemeConfig(themeConfig) {
    const root = document.documentElement;
    const theme = themeConfig.theme;

    // Apply custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace('_', '-')}`, value);
    });

    // Apply typography
    if (theme.typography) {
      Object.entries(theme.typography.font_size).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
    }
  }

  /**
   * Initialize modules
   */
  async initializeModules() {
    try {
      // Initialize language manager
      this.modules.language = new LanguageManager(this.config.i18n);

      // Initialize renderers
      this.modules.researchRenderer = new ResearchRenderer();
      this.modules.membersRenderer = new MembersRenderer();
      this.modules.publicationsRenderer = window.publicationsRenderer; // Already initialized

      // Initialize all renderers
      await Promise.all([
        this.modules.researchRenderer.init(this.config.research),
        this.modules.membersRenderer.init(this.config.members),
        this.modules.publicationsRenderer.init()
      ]);

      // Update lab information
      this.updateLabInformation();

    } catch (error) {
      console.error('Error initializing modules:', error);
      throw error;
    }
  }

  /**
   * Update lab information
   */
  updateLabInformation() {
    const lab = this.config.lab.lab;

    // Update lab name
    document.querySelectorAll('.lab-name').forEach(element => {
      element.textContent = lab.name[this.currentLang] || lab.name.en;
    });

    // Update stats
    const stats = this.config.lab.stats;
    document.querySelector('[data-i18n="stats.members"]').textContent = stats.members;
    document.querySelector('[data-i18n="stats.publications"]').textContent = stats.publications;
    document.querySelector('[data-i18n="stats.projects"]').textContent = stats.projects;

    // Update contact information
    this.updateContactInformation();

    // Update social links
    this.updateSocialLinks();
  }

  /**
   * Update contact information
   */
  updateContactInformation() {
    const contact = this.config.lab.contact;

    // Update email
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      emailLink.href = `mailto:${contact.email}`;
      emailLink.textContent = contact.email;
    }

    // Update phone
    const phoneElement = document.querySelector('[data-i18n="contact.phone.content"]');
    if (phoneElement) {
      phoneElement.textContent = contact.phone;
    }

    // Update address
    const addressElement = document.querySelector('[data-i18n="contact.address.content"]');
    if (addressElement) {
      addressElement.innerHTML = contact.address[this.currentLang] || contact.address.en;
    }
  }

  /**
   * Update social links
   */
  updateSocialLinks() {
    const social = this.config.lab.social;
    const socialLinks = document.querySelector('.footer-social');

    if (socialLinks) {
      socialLinks.innerHTML = `
        <a href="${social.twitter}" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="${social.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="${social.github}" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i>
        </a>
        <a href="${social.googleScholar}" aria-label="Google Scholar" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-google"></i>
        </a>
      `;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Language switching
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        this.switchLanguage(lang);
      });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
      });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          this.smoothScrollTo(targetElement);

          // Close mobile menu if open
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
          }
        }
      });
    });

    // Header scroll effect
    this.setupHeaderScroll();

    // Intersection Observer for animations
    this.setupScrollAnimations();
  }

  /**
   * Switch language
   */
  switchLanguage(lang) {
    if (lang === this.currentLang) return;

    this.currentLang = lang;

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Apply language to all elements
    this.applyLanguage(lang);

    // Update lab information
    this.updateLabInformation();

    // Re-render modules with new language
    this.rerenderModules();
  }

  /**
   * Apply language to elements
   */
  applyLanguage(lang) {
    const translations = this.config.i18n[lang];

    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getNestedValue(translations, key);

      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Re-render modules with current language
   */
  rerenderModules() {
    if (this.modules.researchRenderer) {
      this.modules.researchRenderer.render();
    }

    if (this.modules.membersRenderer) {
      this.modules.membersRenderer.render();
    }

    if (this.modules.publicationsRenderer) {
      this.modules.publicationsRenderer.processPublications();
      this.modules.publicationsRenderer.renderPublications();
    }
  }

  /**
   * Smooth scroll to element
   */
  smoothScrollTo(targetElement) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Setup header scroll effect
   */
  setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
      }

      lastScrollY = currentScrollY;
    });
  }

  /**
   * Setup scroll animations
   */
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.research-card, .member-card, .publication-item').forEach(el => {
      observer.observe(el);
    });
  }
}

/**
 * Language Manager
 * Handles internationalization
 */
class LanguageManager {
  constructor(translations) {
    this.translations = translations;
    this.currentLang = 'en';
  }

  translate(key, params = {}) {
    const translation = this.getNestedValue(this.translations[this.currentLang], key);
    if (!translation) return key;

    return this.interpolate(translation, params);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  interpolate(template, params) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }
}

/**
 * Research Renderer
 * Handles rendering of research areas
 */
class ResearchRenderer {
  constructor() {
    this.researchAreas = [];
  }

  async init(researchData) {
    this.researchAreas = research.researchAreas || [];
    this.render();
  }

  render() {
    const container = document.getElementById('researchAreas');
    if (!container) return;

    const html = this.researchAreas.map(area => this.renderResearchArea(area)).join('');
    container.innerHTML = html;
  }

  renderResearchArea(area) {
    const lang = document.documentElement.lang || 'en';
    const title = area.title[lang] || area.title.en;
    const description = area.description[lang] || area.description.en;
    const keywords = area[`keywords_${lang}`] || area.keywords || [];

    return `
      <div class="research-card" data-area="${area.id}">
        <div class="research-icon">
          <i class="${area.icon}"></i>
        </div>
        <h3 class="research-title">${title}</h3>
        <p class="research-description">${description}</p>
        <div class="research-keywords">
          ${keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
        </div>
        <a href="#" class="btn btn-outline" onclick="window.app.showResearchDetails('${area.id}')">
          <span data-i18n="research.learnMore">Learn More</span>
        </a>
      </div>
    `;
  }
}

/**
 * Members Renderer
 * Handles rendering of team members
 */
class MembersRenderer {
  constructor() {
    this.members = {};
  }

  async init(membersData) {
    this.members = membersData.members || {};
    this.render();
  }

  render() {
    this.renderMemberSection('faculty', 'facultyMembers');
    this.renderMemberSection('students', 'studentMembers');
    this.renderMemberSection('alumni', 'alumniMembers');
  }

  renderMemberSection(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !this.members[type]) return;

    const html = this.members[type].map(member => this.renderMember(member, type)).join('');
    container.innerHTML = html;
  }

  renderMember(member, type) {
    const lang = document.documentElement.lang || 'en';
    const name = member[`name_${lang}`] || member.name;
    const position = member.position[lang] || member.position.en;
    const bio = member.bio ? (member.bio[lang] || member.bio.en) : '';
    const researchInterests = member.research_interests || [];

    return `
      <div class="member-card">
        <div class="member-avatar">
          ${member.image ?
            `<img src="${member.image}" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <i class="fas fa-user" style="display:none;"></i>` :
            `<i class="fas fa-user"></i>`
          }
        </div>
        <h4 class="member-name">${name}</h4>
        <p class="member-position">${position}</p>
        ${bio ? `<p class="member-bio">${bio}</p>` : ''}
        ${researchInterests.length > 0 ? `
          <div class="member-interests">
            ${researchInterests.map(interest =>
              `<span class="interest-tag">${interest[lang] || interest.en || interest}</span>`
            ).join('')}
          </div>
        ` : ''}
        <div class="member-links">
          ${member.email ? `
            <a href="mailto:${member.email}" class="member-link" aria-label="Email">
              <i class="fas fa-envelope"></i>
            </a>
          ` : ''}
          ${member.website ? `
            <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="member-link" aria-label="Website">
              <i class="fas fa-globe"></i>
            </a>
          ` : ''}
          ${member.social?.google_scholar ? `
            <a href="${member.social.google_scholar}" target="_blank" rel="noopener noreferrer" class="member-link" aria-label="Google Scholar">
              <i class="fab fa-google"></i>
            </a>
          ` : ''}
          ${member.social?.linkedin ? `
            <a href="${member.social.linkedin}" target="_blank" rel="noopener noreferrer" class="member-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  window.app = new ResearchGroupWebsite();
  await window.app.init();
});