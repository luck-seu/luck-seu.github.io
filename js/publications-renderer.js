/**
 * Publications Renderer Module
 * Handles rendering publications with support for enhanced BibTeX fields
 */

class PublicationsRenderer {
  constructor() {
    this.currentFilter = 'all';
    this.sortBy = 'year';
    this.sortOrder = 'desc';
    this.publications = [];
    this.filteredPublications = [];
  }

  /**
   * Initialize publications section
   */
  async init() {
    try {
      await this.loadPublications();
      this.setupEventListeners();
      this.renderPublications();
    } catch (error) {
      console.error('Error initializing publications:', error);
      this.showError();
    }
  }

  /**
   * Load publications data
   */
  async loadPublications() {
    // Try to load from JSON config first
    try {
      const config = await window.dataLoader.loadPublications();
      this.publications = config.publications || [];
    } catch (error) {
      console.warn('Could not load publications from JSON, trying BibTeX...');

      // Fallback to BibTeX parsing
      try {
        const bibtexResponse = await fetch('assets/bibliography/publications.bib');
        const bibtexText = await bibtexResponse.text();
        this.publications = window.bibtexParser.parseBibTeX(bibtexText);
      } catch (bibtexError) {
        console.error('Could not load publications from BibTeX:', bibtexError);
        throw new Error('Failed to load publications from any source');
      }
    }

    // Process and enhance publications
    this.processPublications();
    this.filteredPublications = [...this.publications];
  }

  /**
   * Process and enhance publication data
   */
  processPublications() {
    this.publications.forEach(pub => {
      // Ensure required fields exist
      pub.id = pub.id || `pub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      pub.type = pub.type || 'other';
      pub.year = parseInt(pub.year) || new Date().getFullYear();

      // Process authors
      if (pub.authors && Array.isArray(pub.authors)) {
        pub.author_string = pub.authors.map(author => {
          let name = author.name || author;
          if (author.is_highlighted) {
            name = `<span class="author-highlighted">${name}</span>`;
          }
          return name;
        }).join(', ');
      }

      // Set display venue
      pub.display_venue = this.getDisplayVenue(pub);

      // Generate BibTeX if not present
      if (!pub.bibtex) {
        pub.bibtex = window.bibtexParser.generateBibTeX(pub);
      }

      // Set language-appropriate content
      const lang = document.documentElement.lang || 'en';
      this.setLanguageContent(pub, lang);
    });

    // Sort publications by year (newest first)
    this.publications.sort((a, b) => b.year - a.year);
  }

  /**
   * Get display venue based on publication type
   */
  getDisplayVenue(pub) {
    if (pub.journal) {
      return typeof pub.journal === 'object' ? pub.journal.en || pub.journal.zh : pub.journal;
    }
    if (pub.conference || pub.booktitle) {
      const venue = pub.conference || pub.booktitle;
      return typeof venue === 'object' ? venue.en || venue.zh : venue;
    }
    if (pub.school) {
      return `PhD Thesis, ${pub.school}`;
    }
    if (pub.howpublished) {
      return pub.howpublished;
    }
    return 'Unknown Venue';
  }

  /**
   * Set language-appropriate content
   */
  setLanguageContent(pub, lang) {
    // Set title
    if (typeof pub.title === 'object') {
      pub.display_title = pub.title[lang] || pub.title.en || pub.title.zh || Object.values(pub.title)[0];
    } else {
      pub.display_title = pub.title;
    }

    // Set abstract
    if (typeof pub.abstract === 'object') {
      pub.display_abstract = pub.abstract[lang] || pub.abstract.en || pub.abstract.zh || '';
    } else {
      pub.display_abstract = pub.abstract || '';
    }

    // Set keywords
    pub.display_keywords = pub[`keywords_${lang}`] || pub.keywords || [];
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Sort controls (if added)
    const sortSelect = document.getElementById('sortPublications');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.setSorting(e.target.value);
      });
    }
  }

  /**
   * Set publication filter
   */
  setFilter(filter) {
    this.currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Apply filter
    this.applyFilter();
    this.renderPublications();
  }

  /**
   * Apply current filter
   */
  applyFilter() {
    if (this.currentFilter === 'all') {
      this.filteredPublications = [...this.publications];
    } else {
      this.filteredPublications = this.publications.filter(pub =>
        pub.type === this.currentFilter
      );
    }
  }

  /**
   * Set sorting
   */
  setSorting(sortBy) {
    this.sortBy = sortBy;
    this.sortPublications();
    this.renderPublications();
  }

  /**
   * Sort publications
   */
  sortPublications() {
    this.filteredPublications.sort((a, b) => {
      let aValue = a[this.sortBy];
      let bValue = b[this.sortBy];

      if (this.sortBy === 'year') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
        return this.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }

      if (this.sortBy === 'title') {
        aValue = (a.display_title || a.title || '').toLowerCase();
        bValue = (b.display_title || b.title || '').toLowerCase();
        return aValue.localeCompare(bValue);
      }

      return 0;
    });
  }

  /**
   * Render publications list
   */
  renderPublications() {
    const container = document.getElementById('publicationsList');
    if (!container) return;

    if (this.filteredPublications.length === 0) {
      container.innerHTML = this.getNoPublicationsHTML();
      return;
    }

    const html = this.filteredPublications.map(pub => this.renderPublication(pub)).join('');
    container.innerHTML = html;

    // Add event listeners for interactive elements
    this.addPublicationInteractivity();
  }

  /**
   * Render single publication
   */
  renderPublication(pub) {
    const isHighlighted = pub.highlighted || false;
    const hasAward = pub.award || false;
    const hasMultipleLinks = this.getPublicationLinks(pub).length > 1;

    return `
      <div class="publication-item ${isHighlighted ? 'highlighted' : ''}" data-id="${pub.id}">
        <div class="publication-header">
          <div class="publication-title-section">
            <h3 class="publication-title">
              ${this.renderTitle(pub)}
              ${hasAward ? `<span class="publication-award">${pub.award}</span>` : ''}
            </h3>
            ${this.renderCitationMetrics(pub)}
          </div>
        </div>

        <div class="publication-authors">
          ${pub.author_string || 'Unknown Authors'}
        </div>

        <div class="publication-venue">
          <em>${this.renderVenue(pub)}</em>
          ${pub.year ? `, ${pub.year}` : ''}
          ${pub.volume ? `, Vol. ${pub.volume}` : ''}
          ${pub.issue ? `, No. ${pub.issue}` : ''}
          ${pub.pages ? `, pp. ${pub.pages}` : ''}
          ${pub.doi ? this.renderDOI(pub.doi) : ''}
        </div>

        ${this.renderAdditionalInfo(pub)}

        ${this.renderAbstract(pub)}

        <div class="publication-links">
          ${this.renderPublicationLinks(pub)}
        </div>

        ${this.renderKeywords(pub)}

        ${this.renderResearchInfo(pub)}

        ${this.renderCollaborationInfo(pub)}

        <div class="publication-actions">
          <button class="btn-bibtex" onclick="window.publicationsRenderer.copyBibTeX('${pub.id}')">
            <i class="fas fa-copy"></i> Copy BibTeX
          </button>
          <button class="btn-cite" onclick="window.publicationsRenderer.showCitationOptions('${pub.id}')">
            <i class="fas fa-quote-right"></i> Cite
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render publication title with language support
   */
  renderTitle(pub) {
    const title = pub.display_title || pub.title || 'Untitled';
    if (pub.url) {
      return `<a href="${pub.url}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    }
    return title;
  }

  /**
   * Render citation metrics
   */
  renderCitationMetrics(pub) {
    const metrics = [];

    if (pub.citation_count) {
      metrics.push(`<span class="citation-count"><i class="fas fa-quote-right"></i> ${pub.citation_count}</span>`);
    }

    if (pub.altmetric_score) {
      metrics.push(`<span class="altmetric-score"><i class="fas fa-chart-bar"></i> ${pub.altmetric_score}</span>`);
    }

    if (pub.impact_factor) {
      metrics.push(`<span class="impact-factor"><i class="fas fa-chart-line"></i> IF: ${pub.impact_factor}</span>`);
    }

    return metrics.length > 0 ? `<div class="publication-metrics">${metrics.join(' • ')}</div>` : '';
  }

  /**
   * Render venue information
   */
  renderVenue(pub) {
    let venue = pub.display_venue;

    if (pub.publisher) {
      venue += ` (${pub.publisher})`;
    }

    if (pub.location) {
      venue += `, ${pub.location}`;
    }

    return venue;
  }

  /**
   * Render DOI link
   */
  renderDOI(doi) {
    return `<br><a href="https://doi.org/${doi}" target="_blank" rel="noopener noreferrer">DOI: ${doi}</a>`;
  }

  /**
   * Render additional publication information
   */
  renderAdditionalInfo(pub) {
    const info = [];

    if (pub.issn) {
      info.push(`ISSN: ${pub.issn}`);
    }

    if (pub.isbn) {
      info.push(`ISBN: ${pub.isbn}`);
    }

    if (pub.arxiv) {
      info.push(`arXiv: <a href="https://arxiv.org/abs/${pub.arxiv}" target="_blank">${pub.arxiv}</a>`);
    }

    if (pub.language && pub.language !== 'en') {
      info.push(`Language: ${pub.language.toUpperCase()}`);
    }

    return info.length > 0 ? `<div class="publication-info">${info.join(' • ')}</div>` : '';
  }

  /**
   * Render abstract (collapsible)
   */
  renderAbstract(pub) {
    if (!pub.display_abstract) return '';

    return `
      <div class="publication-abstract">
        <button class="abstract-toggle" onclick="window.publicationsRenderer.toggleAbstract('${pub.id}')">
          <i class="fas fa-chevron-down"></i> Abstract
        </button>
        <div class="abstract-content" id="abstract-${pub.id}" style="display: none;">
          ${pub.display_abstract}
        </div>
      </div>
    `;
  }

  /**
   * Get publication links
   */
  getPublicationLinks(pub) {
    const links = [];

    if (pub.pdf_url) {
      links.push({ type: 'pdf', url: pub.pdf_url, label: 'PDF' });
    }

    if (pub.code_url || pub.code) {
      links.push({ type: 'code', url: pub.code_url || pub.code, label: 'Code' });
    }

    if (pub.data_url || pub.data) {
      links.push({ type: 'data', url: pub.data_url || pub.data, label: 'Data' });
    }

    if (pub.slides_url || pub.slides) {
      links.push({ type: 'slides', url: pub.slides_url || pub.slides, label: 'Slides' });
    }

    if (pub.video_url || pub.video) {
      links.push({ type: 'video', url: pub.video_url || pub.video, label: 'Video' });
    }

    if (pub.blog_url || pub.blog) {
      links.push({ type: 'blog', url: pub.blog_url || pub.blog, label: 'Blog' });
    }

    if (pub.url && !links.some(link => link.url === pub.url)) {
      links.push({ type: 'link', url: pub.url, label: 'Link' });
    }

    return links;
  }

  /**
   * Render publication links
   */
  renderPublicationLinks(pub) {
    const links = this.getPublicationLinks(pub);

    return links.map(link => `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="publication-link ${link.type}">
        <i class="fas fa-${this.getLinkIcon(link.type)}"></i>
        ${link.label}
      </a>
    `).join('');
  }

  /**
   * Get icon for link type
   */
  getLinkIcon(type) {
    const icons = {
      pdf: 'file-pdf',
      code: 'code',
      data: 'database',
      slides: 'presentation',
      video: 'video',
      blog: 'blog',
      link: 'external-link-alt'
    };
    return icons[type] || 'link';
  }

  /**
   * Render keywords
   */
  renderKeywords(pub) {
    const keywords = pub.display_keywords;
    if (!keywords || keywords.length === 0) return '';

    const keywordTags = keywords.map(keyword =>
      `<span class="keyword-tag">${keyword}</span>`
    ).join(' ');

    return `<div class="publication-keywords">${keywordTags}</div>`;
  }

  /**
   * Render research information
   */
  renderResearchInfo(pub) {
    const info = [];

    if (pub.research_area) {
      info.push(`<span class="research-area">Area: ${pub.research_area}</span>`);
    }

    if (pub.funding && pub.funding.length > 0) {
      info.push(`<span class="funding">Funding: ${pub.funding.join(', ')}</span>`);
    }

    return info.length > 0 ? `<div class="publication-research-info">${info.join(' • ')}</div>` : '';
  }

  /**
   * Render collaboration information
   */
  renderCollaborationInfo(pub) {
    const info = [];

    if (pub.collaborators && pub.collaborators.length > 0) {
      info.push(`<span class="collaborators">With: ${pub.collaborators.join(', ')}</span>`);
    }

    if (pub.student_authors && pub.student_authors.length > 0) {
      info.push(`<span class="student-authors">Student authors: ${pub.student_authors.join(', ')}</span>`);
    }

    return info.length > 0 ? `<div class="publication-collaboration-info">${info.join(' • ')}</div>` : '';
  }

  /**
   * Get no publications HTML
   */
  getNoPublicationsHTML() {
    return `
      <div class="no-publications">
        <i class="fas fa-file-alt"></i>
        <h3>No publications found</h3>
        <p>Check back later for updates to our research output.</p>
      </div>
    `;
  }

  /**
   * Add interactivity to publication elements
   */
  addPublicationInteractivity() {
    // Add hover effects and other interactions
    document.querySelectorAll('.publication-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('hovered');
      });

      item.addEventListener('mouseleave', () => {
        item.classList.remove('hovered');
      });
    });
  }

  /**
   * Toggle abstract visibility
   */
  toggleAbstract(pubId) {
    const abstractContent = document.getElementById(`abstract-${pubId}`);
    const toggle = abstractContent.previousElementSibling;
    const icon = toggle.querySelector('i');

    if (abstractContent.style.display === 'none') {
      abstractContent.style.display = 'block';
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-up');
    } else {
      abstractContent.style.display = 'none';
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down');
    }
  }

  /**
   * Copy BibTeX to clipboard
   */
  async copyBibTeX(pubId) {
    const publication = this.publications.find(pub => pub.id === pubId);
    if (!publication) return;

    try {
      await navigator.clipboard.writeText(publication.bibtex);
      this.showToast('BibTeX copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy BibTeX:', error);
      this.showToast('Failed to copy BibTeX', 'error');
    }
  }

  /**
   * Show citation options
   */
  showCitationOptions(pubId) {
    const publication = this.publications.find(pub => pub.id === pubId);
    if (!publication) return;

    // Create citation modal (implementation would go here)
    console.log('Show citation options for:', publication);
    this.showToast('Citation options coming soon!');
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
      <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /**
   * Show error message
   */
  showError() {
    const container = document.getElementById('publicationsList');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Unable to load publications</h3>
          <p>Please try again later or contact us if the problem persists.</p>
        </div>
      `;
    }
  }
}

// Create singleton instance
window.publicationsRenderer = new PublicationsRenderer();