/**
 * Academic Research Group Website Application
 * Clean, professional JavaScript for interactions
 */

class ResearchWebsite {
    constructor() {
        this.currentLang = 'en';
        this.config = null;
        this.isMobileMenuOpen = false;

        this.init();
    }

    async init() {
        try {
            // Load configuration
            await this.loadConfiguration();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize components
            this.initializeComponents();

            // Apply initial language
            this.applyLanguage(this.currentLang);

            console.log('Research website initialized successfully');
        } catch (error) {
            console.error('Failed to initialize website:', error);
        }
    }

    async loadConfiguration() {
        try {
            const [labInfo, researchAreas, members, publications, i18n] = await Promise.all([
                window.dataLoader.loadLabInfo(),
                window.dataLoader.loadResearchAreas(),
                window.dataLoader.loadMembers(),
                window.dataLoader.loadPublications(),
                window.dataLoader.loadI18n()
            ]);

            this.config = {
                lab: labInfo,
                research: researchAreas,
                members: members,
                publications: publications,
                i18n: i18n
            };

            this.updateUIWithConfig();
        } catch (error) {
            console.error('Error loading configuration:', error);
            throw error;
        }
    }

    updateUIWithConfig() {
        // Update site title
        const lab = this.config.lab.lab;
        const siteTitle = document.querySelector('.site-subtitle');
        if (siteTitle) {
            siteTitle.textContent = lab.name[this.currentLang] || lab.name.en;
        }

        // Update contact information
        this.updateContactInfo();

        // Render dynamic content
        this.renderResearchAreas();
        this.renderMembers();
        this.renderPublications();
    }

    updateContactInfo() {
        const contact = this.config.lab.contact;

        // Update email links
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.href = `mailto:${contact.email}`;
        });

        // Update phone
        const phoneElements = document.querySelectorAll('.contact-details p');
        phoneElements.forEach(element => {
            if (element.textContent.includes('Phone') || element.textContent.includes('+1')) {
                element.textContent = contact.phone;
            }
        });
    }

    setupEventListeners() {
        // Language toggle
        document.querySelectorAll('.lang-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
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
                    this.closeMobileMenu();
                }
            });
        });

        // Tab functionality
        this.setupTabs();

        // Publication filters
        this.setupPublicationFilters();

        // Search functionality
        this.setupSearch();

        // Contact form
        this.setupContactForm();

        // Header scroll effect
        this.setupHeaderScroll();

        // Counter animations
        this.setupCounters();
    }

    toggleMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        this.isMobileMenuOpen = !this.isMobileMenuOpen;

        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    smoothScrollTo(targetElement) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;

                // Update active button
                tabButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Update active pane
                tabPanes.forEach(pane => pane.classList.remove('active'));
                const activePane = document.getElementById(tabName);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });
    }

    setupPublicationFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const publications = document.querySelectorAll('.publication-item');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;

                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filter publications
                publications.forEach(pub => {
                    if (filter === 'all' || pub.dataset.type === filter || pub.dataset.year === filter) {
                        pub.style.display = 'block';
                    } else {
                        pub.style.display = 'none';
                    }
                });
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('pub-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const publications = document.querySelectorAll('.publication-item');

            publications.forEach(pub => {
                const title = pub.querySelector('.publication-title')?.textContent.toLowerCase() || '';
                const authors = pub.querySelector('.publication-authors')?.textContent.toLowerCase() || '';
                const content = pub.querySelector('.publication-content')?.textContent.toLowerCase() || '';

                if (title.includes(query) || authors.includes(query) || content.includes(query)) {
                    pub.style.display = 'block';
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    }

    setupContactForm() {
        const form = document.querySelector('.form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple form validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                this.showNotification('Please fill in all required fields.', 'error');
            }
        });
    }

    setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    initializeComponents() {
        // Initialize any additional components
        this.initializeTooltips();
        this.initializeScrollAnimations();
    }

    initializeTooltips() {
        // Simple tooltip implementation
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-gray-900);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

        setTimeout(() => tooltip.style.opacity = '1', 10);

        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.style.opacity = '0';
            setTimeout(() => {
                if (this.currentTooltip) {
                    this.currentTooltip.remove();
                    this.currentTooltip = null;
                }
            }, 200);
        }
    }

    initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.news-item, .person-card, .publication-item');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => observer.observe(element));
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;

        this.currentLang = lang;
        document.documentElement.lang = lang;

        // Update language buttons
        document.querySelectorAll('.lang-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update UI with new language
        this.updateUIWithConfig();
        this.applyLanguage(lang);
    }

    applyLanguage(lang) {
        const translations = this.config.i18n[lang];
        if (!translations) return;

        // Update elements with data-i18n attribute
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

        // Update page title
        const lab = this.config.lab.lab;
        document.title = `${lab.name[lang] || lab.name.en}`;
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    renderResearchAreas() {
        const container = document.getElementById('research-grid');
        if (!container || !this.config.research?.researchAreas) return;

        const researchAreas = this.config.research.researchAreas;
        const html = researchAreas.map(area => this.createResearchCard(area)).join('');
        container.innerHTML = html;
    }

    createResearchCard(area) {
        const lang = this.currentLang;
        const title = area.title?.[lang] || area.title?.en || 'Research Area';
        const description = area.description?.[lang] || area.description?.en || '';
        const keywords = lang === 'zh' ? (area.keywords_zh || area.keywords || []) : (area.keywords || []);

        return `
            <div class="research-card">
                <div class="research-icon">
                    <i class="${area.icon || 'fas fa-flask'}"></i>
                </div>
                <h3 class="research-title">${title}</h3>
                <p class="research-description">${description}</p>
                <div class="research-keywords">
                    ${keywords.map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                </div>
                <a href="#" class="btn btn-outline" onclick="window.website.showResearchDetails('${area.id}')">
                    Learn More
                </a>
            </div>
        `;
    }

    renderMembers() {
        const members = this.config.members?.members;
        if (!members) return;

        this.renderMemberSection('faculty', members.faculty, 'faculty-grid');
        this.renderMemberSection('students', members.students, 'students-grid');
        this.renderMemberSection('alumni', members.alumni, 'alumni-grid');
    }

    renderMemberSection(type, memberList, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !memberList) return;

        const html = memberList.map(member => this.createMemberCard(member, type)).join('');
        container.innerHTML = html;
    }

    createMemberCard(member, type) {
        const lang = this.currentLang;
        const name = member[`name_${lang}`] || member.name_zh || member.name || 'Unknown';
        const position = member.position?.[lang] || member.position?.en || member.position || '';
        const bio = member.bio?.[lang] || member.bio?.en || member.bio || '';
        const researchInterests = member.research_interests || [];

        return `
            <div class="person-card">
                <div class="person-image">
                    ${member.image ?
                        `<img src="${member.image}" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="person-placeholder"><i class="fas fa-user"></i></div>` :
                        `<div class="person-placeholder"><i class="fas fa-user"></i></div>`
                    }
                </div>
                <div class="person-info">
                    <h3 class="person-name">${name}</h3>
                    <p class="person-position">${position}</p>
                    ${bio ? `<p class="person-bio">${bio}</p>` : ''}
                    <div class="person-links">
                        ${member.email ? `<a href="mailto:${member.email}" class="person-link"><i class="fas fa-envelope"></i></a>` : ''}
                        ${member.website ? `<a href="${member.website}" target="_blank" class="person-link"><i class="fas fa-globe"></i></a>` : ''}
                        ${member.social?.google_scholar ? `<a href="${member.social.google_scholar}" target="_blank" class="person-link"><i class="fab fa-google"></i></a>` : ''}
                        ${member.social?.linkedin ? `<a href="${member.social.linkedin}" target="_blank" class="person-link"><i class="fab fa-linkedin"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderPublications() {
        const container = document.getElementById('publications-list');
        if (!container || !this.config.publications?.publications) return;

        const publications = this.config.publications.publications;
        const html = publications.slice(0, 6).map(pub => this.createPublicationCard(pub)).join('');
        container.innerHTML = html;
    }

    createPublicationCard(pub) {
        const lang = this.currentLang;
        const title = pub.title?.[lang] || pub.title?.en || 'Untitled';
        const authors = pub.authors?.map(author => author.name || author).join(', ') || 'Unknown Authors';
        const venue = pub.journal?.[lang] || pub.journal?.en || pub.conference?.[lang] || pub.conference?.en || '';

        return `
            <div class="publication-item" data-type="${pub.type}" data-year="${pub.year}">
                <div class="publication-content">
                    <h3 class="publication-title">${title}</h3>
                    <p class="publication-authors">${authors}</p>
                    <p class="publication-venue">${venue} • ${pub.year}</p>
                    ${pub.abstract?.[lang] || pub.abstract?.en ?
                        `<p class="publication-abstract">${(pub.abstract[lang] || pub.abstract.en).substring(0, 200)}...</p>` :
                        ''
                    }
                    <div class="publication-links">
                        ${pub.pdf_url ? `<a href="${pub.pdf_url}" class="publication-link">PDF</a>` : ''}
                        ${pub.code_url ? `<a href="${pub.code_url}" class="publication-link">Code</a>` : ''}
                        ${pub.doi ? `<a href="https://doi.org/${pub.doi}" class="publication-link">DOI</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    showResearchDetails(areaId) {
        const area = this.config.research.researchAreas.find(a => a.id === areaId);
        if (!area) return;

        // Create modal for research details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${area.title[this.currentLang] || area.title.en}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${area.description[this.currentLang] || area.description.en}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
            color: white;
            padding: 16px 20px;
            border-radius: 4px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(100%);
        }
    }

    .research-card, .person-card, .publication-item {
        background: var(--bg-primary);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-lg);
        padding: var(--space-xl);
        transition: all var(--transition-normal);
        opacity: 0;
    }

    .research-card:hover, .person-card:hover, .publication-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-accent);
    }

    .research-icon, .person-image {
        width: 60px;
        height: 60px;
        background: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: var(--text-xl);
        margin: 0 auto var(--space-lg);
    }

    .person-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .person-placeholder {
        width: 100%;
        height: 100%;
        display: none;
        align-items: center;
        justify-content: center;
        background: var(--color-gray-100);
        color: var(--color-gray-400);
        border-radius: 50%;
    }

    .research-title, .person-name, .publication-title {
        color: var(--text-primary);
        margin-bottom: var(--space-sm);
        font-size: var(--text-xl);
    }

    .person-position {
        color: var(--color-accent);
        font-weight: var(--font-medium);
        margin-bottom: var(--space-sm);
    }

    .research-description, .person-bio, .publication-venue {
        color: var(--text-secondary);
        margin-bottom: var(--space-md);
        line-height: var(--leading-normal);
    }

    .research-keywords {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs);
        margin-bottom: var(--space-lg);
    }

    .keyword {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        border: 1px solid var(--border-primary);
    }

    .person-links {
        display: flex;
        gap: var(--space-sm);
        margin-top: var(--space-md);
    }

    .person-link {
        width: 36px;
        height: 36px;
        background: var(--bg-secondary);
        color: var(--text-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: all var(--transition-fast);
    }

    .person-link:hover {
        background: var(--color-accent);
        color: white;
    }

    .publication-authors {
        color: var(--text-secondary);
        font-size: var(--text-sm);
        margin-bottom: var(--space-xs);
    }

    .publication-links {
        display: flex;
        gap: var(--space-sm);
        margin-top: var(--space-md);
    }

    .publication-link {
        font-size: var(--text-sm);
        color: var(--color-accent);
        text-decoration: none;
        padding: var(--space-xs) var(--space-sm);
        border: 1px solid var(--color-accent);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }

    .publication-link:hover {
        background: var(--color-accent);
        color: white;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--z-modal);
    }

    .modal-content {
        background: var(--bg-primary);
        border-radius: var(--radius-lg);
        padding: var(--space-2xl);
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-lg);
    }

    .modal-close {
        background: none;
        border: none;
        font-size: var(--text-xl);
        cursor: pointer;
        color: var(--text-secondary);
        padding: var(--space-sm);
    }

    .form-input.error {
        border-color: var(--color-error);
    }

    .header.scrolled {
        box-shadow: var(--shadow-md);
    }
`;

document.head.appendChild(style);

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.website = new ResearchWebsite();
});