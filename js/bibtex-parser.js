/**
 * BibTeX Parser Module
 * Handles parsing BibTeX entries and converting to our JSON format
 */

class BibTeXParser {
  constructor() {
    this.fieldMappings = {
      // Standard BibTeX fields
      'title': 'title',
      'author': 'authors',
      'year': 'year',
      'month': 'month',
      'journal': 'journal',
      'booktitle': 'conference',
      'volume': 'volume',
      'number': 'issue',
      'pages': 'pages',
      'publisher': 'publisher',
      'doi': 'doi',
      'url': 'url',
      'isbn': 'isbn',
      'issn': 'issn',
      'abstract': 'abstract',
      'keywords': 'keywords',
      'note': 'note',
      'series': 'series',
      'edition': 'edition',
      'chapter': 'chapter',
      'school': 'school',
      'institution': 'institution',
      'organization': 'organization',
      'address': 'address',
      'howpublished': 'how_published',
      'type': 'publication_type',

      // Extended fields for academic use
      'venue': 'venue',
      'location': 'location',
      'editor': 'editors',
      'copyright': 'copyright',
      'language': 'language',
      'isbn13': 'isbn13',
      'issn13': 'issn13',
      'pmid': 'pmid',
      'pmcid': 'pmcid',
      'arxiv': 'arxiv_id',
      'code': 'code_url',
      'data': 'data_url',
      'slides': 'slides_url',
      'video': 'video_url',
      'blog': 'blog_url',
      'press': 'press_url',
      'award': 'award',
      'impact_factor': 'impact_factor',
      'citation_count': 'citation_count',
      'altmetric': 'altmetric_score',
      'research_area': 'research_area',
      'research_group': 'research_group',
      'funding': 'funding',
      'acknowledgments': 'acknowledgments',
      'collaborators': 'collaborators',
      'competitions': 'competitions',
      'patents': 'patents',
      'software': 'software',
      'datasets': 'datasets',
      'presentations': 'presentations',
      'media_coverage': 'media_coverage',
      'public_engagement': 'public_engagement',
      'policy_impact': 'policy_impact',
      'industry_collaboration': 'industry_collaboration',
      'international_collaboration': 'international_collaboration',
      'student_authors': 'student_authors',
      'early_career_authors': 'early_career_authors',
      'corresponding_author': 'corresponding_author',
      'equal_contribution': 'equal_contribution',
      'senior_author': 'senior_author'
    };
  }

  /**
   * Parse BibTeX string into array of publication objects
   */
  parseBibTeX(bibtexString) {
    const entries = this.extractEntries(bibtexString);
    return entries.map(entry => this.parseEntry(entry));
  }

  /**
   * Extract individual BibTeX entries from string
   */
  extractEntries(bibtexString) {
    // Remove comments and clean up
    const cleaned = bibtexString
      .replace(/%.*$/gm, '') // Remove comments
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();

    // Split by @entry_type{ pattern
    const entryRegex = /@(\w+)\s*\{\s*([^,]+)\s*,\s*([\s\S]*?)\s*\}/g;
    const entries = [];
    let match;

    while ((match = entryRegex.exec(cleaned)) !== null) {
      entries.push({
        type: match[1],
        key: match[2],
        content: match[3]
      });
    }

    return entries;
  }

  /**
   * Parse individual BibTeX entry
   */
  parseEntry(entry) {
    const publication = {
      id: entry.key,
      type: this.mapEntryType(entry.type),
      raw_bibtex: `@${entry.type}{${entry.key}, ${entry.content}}`
    };

    // Parse fields
    const fields = this.parseFields(entry.content);

    // Map BibTeX fields to our format
    Object.keys(fields).forEach(bibtexField => {
      const ourField = this.fieldMappings[bibtexField.toLowerCase()];
      if (ourField) {
        publication[ourField] = this.processField(ourField, fields[bibtexField], bibtexField);
      } else {
        // Keep unknown fields as-is
        publication[bibtexField] = fields[bibtexField];
      }
    });

    // Process authors specially
    if (fields.author) {
      publication.authors = this.parseAuthors(fields.author);
    }

    // Process keywords
    if (fields.keywords) {
      publication.keywords = this.parseKeywords(fields.keywords);
    }

    // Set default values and computed fields
    this.setComputedFields(publication);

    return publication;
  }

  /**
   * Parse field content from BibTeX entry
   */
  parseFields(content) {
    const fields = {};

    // Handle both comma-separated and semicolon-separated fields
    const fieldRegex = /(\w+)\s*=\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let match;

    while ((match = fieldRegex.exec(content)) !== null) {
      const fieldName = match[1].toLowerCase();
      let fieldValue = match[2];

      // Clean up field value
      fieldValue = fieldValue
        .replace(/\\[`'~^=.\{\}]/g, '') // Remove LaTeX commands
        .replace(/\{\s*\}/g, '') // Remove empty braces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // Remove surrounding braces if present
      if (fieldValue.startsWith('{') && fieldValue.endsWith('}')) {
        fieldValue = fieldValue.slice(1, -1);
      }

      fields[fieldName] = fieldValue;
    }

    return fields;
  }

  /**
   * Process individual fields based on their type
   */
  processField(fieldName, value, originalField) {
    switch (fieldName) {
      case 'authors':
        return this.parseAuthors(value);
      case 'keywords':
        return this.parseKeywords(value);
      case 'year':
        return parseInt(value) || value;
      case 'volume':
      case 'issue':
      case 'pages':
        return value;
      case 'title':
      case 'abstract':
        return this.cleanLatex(value);
      case 'url':
      case 'doi':
      case 'arxiv':
      case 'pmid':
      case 'pmcid':
        return value;
      default:
        return this.cleanLatex(value);
    }
  }

  /**
   * Clean LaTeX commands from text
   */
  cleanLatex(text) {
    return text
      .replace(/\\[a-zA-Z]+\{([^}]+)\}/g, '$1') // Remove commands with arguments
      .replace(/\\[a-zA-Z]/g, '') // Remove commands without arguments
      .replace(/[{}]/g, '') // Remove braces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Parse authors string into array of author objects
   */
  parseAuthors(authorsString) {
    const authorNames = authorsString.split(/\s+and\s+/i);
    return authorNames.map(name => ({
      name: name.trim(),
      is_highlighted: false // Can be overridden in configuration
    }));
  }

  /**
   * Parse keywords into array
   */
  parseKeywords(keywordsString) {
    return keywordsString
      .split(/[,;]\s*/)
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
  }

  /**
   * Map BibTeX entry types to our publication types
   */
  mapEntryType(bibtexType) {
    const typeMapping = {
      'article': 'journal',
      'inproceedings': 'conference',
      'incollection': 'book_chapter',
      'book': 'book',
      'phdthesis': 'thesis',
      'mastersthesis': 'thesis',
      'techreport': 'report',
      'misc': 'other',
      'unpublished': 'preprint',
      'inbook': 'book_chapter',
      'proceedings': 'conference',
      'booklet': 'other',
      'manual': 'other',
      'patent': 'patent',
      'dataset': 'dataset',
      'software': 'software'
    };

    return typeMapping[bibtexType.toLowerCase()] || 'other';
  }

  /**
   * Set computed fields and defaults
   */
  setComputedFields(publication) {
    // Set display title (English first, fallback to other languages)
    if (typeof publication.title === 'object') {
      publication.display_title = publication.title.en || publication.title.zh || Object.values(publication.title)[0];
    } else {
      publication.display_title = publication.title;
    }

    // Set display authors
    if (publication.authors && publication.authors.length > 0) {
      publication.author_string = publication.authors.map(author => author.name).join(', ');
    }

    // Set display venue
    if (publication.journal) {
      publication.display_venue = publication.journal;
    } else if (publication.conference) {
      publication.display_venue = publication.conference;
    } else if (publication.booktitle) {
      publication.display_venue = publication.booktitle;
    }

    // Set year if not present
    if (!publication.year && publication.month) {
      // Try to extract year from month field if it contains year
      const yearMatch = publication.month.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        publication.year = parseInt(yearMatch[0]);
      }
    }

    // Generate URLs if not present
    if (publication.doi && !publication.url) {
      publication.url = `https://doi.org/${publication.doi}`;
    }

    if (publication.arxiv && !publication.url) {
      publication.url = `https://arxiv.org/abs/${publication.arxiv}`;
    }
  }

  /**
   * Convert our JSON format back to BibTeX
   */
  toJSON(publication) {
    const bibtex = {
      entry_type: this.reverseMapType(publication.type),
      citation_key: publication.id,
      fields: {}
    };

    // Map our fields back to BibTeX
    Object.entries(this.fieldMappings).forEach(([bibtexField, ourField]) => {
      if (publication[ourField]) {
        bibtex.fields[bibtexField] = this.formatFieldForBibTeX(ourField, publication[ourField]);
      }
    });

    return bibtex;
  }

  /**
   * Map our types back to BibTeX types
   */
  reverseMapType(ourType) {
    const typeMapping = {
      'journal': 'article',
      'conference': 'inproceedings',
      'book_chapter': 'incollection',
      'book': 'book',
      'thesis': 'phdthesis',
      'report': 'techreport',
      'other': 'misc',
      'preprint': 'unpublished',
      'patent': 'patent',
      'dataset': 'misc',
      'software': 'misc'
    };

    return typeMapping[ourType] || 'misc';
  }

  /**
   * Format field value for BibTeX output
   */
  formatFieldForBibTeX(fieldName, value) {
    if (fieldName === 'authors' && Array.isArray(value)) {
      return value.map(author => author.name).join(' and ');
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'string') {
      // Escape special BibTeX characters
      return value
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/#/g, '\\#');
    }

    return String(value);
  }

  /**
   * Generate BibTeX string from publication object
   */
  generateBibTeX(publication) {
    const bibtex = this.toJSON(publication);

    let result = `@${bibtex.entry_type}{${bibtex.citation_key},\n`;

    Object.entries(bibtex.fields).forEach(([field, value], index) => {
      const comma = index === Object.keys(bibtex.fields).length - 1 ? '' : ',';
      result += `  ${field} = {${value}}${comma}\n`;
    });

    result += '}';

    return result;
  }
}

// Create singleton instance
window.bibtexParser = new BibTeXParser();