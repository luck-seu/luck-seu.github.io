# Academic Research Group Homepage

A modern, bilingual academic homepage template designed for research groups and laboratories. Features clean design, easy content management, and comprehensive BibTeX support.

## Features

- 🌍 **Bilingual Support**: English and Chinese with easy language switching
- 📄 **BibTeX Integration**: Full BibTeX parsing with extensive field support
- 🎨 **Modern Design**: Clean, academic style with customizable theme system
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚙️ **Modular Configuration**: JSON-based content management system
- 🔧 **Easy Maintenance**: Decoupled content and presentation
- 📊 **Rich Metadata**: Support for citations, altmetrics, funding, collaborations
- 🎯 **Interactive Features**: Collapsible abstracts, filtering, copy-to-clipboard

## Project Structure

```
├── index.html              # Main HTML file
├── styles/
│   └── styles.css          # Complete styling with design system
├── js/
│   ├── main.js             # Main application controller
│   ├── data-loader.js      # Data loading and caching
│   ├── bibtex-parser.js    # Comprehensive BibTeX parser
│   └── publications-renderer.js  # Publication display logic
├── config/
│   ├── lab-info.json       # Laboratory information
│   ├── research-areas.json # Research areas and topics
│   ├── members.json        # Team members and alumni
│   ├── publications.json   # Publications (can use BibTeX)
│   ├── theme-config.json   # Theme and design configuration
│   └── i18n.json          # Internationalization strings
├── assets/
│   ├── images/             # Images and avatars
│   ├── members/            # Member photos
│   ├── papers/             # Publication PDFs
│   ├── slides/             # Presentation slides
│   └── bibliography/
│       └── publications.bib # BibTeX file (alternative to JSON)
└── README.md
```

## Quick Start

### 1. Basic Setup

1. Clone or download the template
2. Update configuration files in `/config/` with your information
3. Add your assets (images, papers, etc.) to `/assets/`
4. Deploy to any web server or GitHub Pages

### 2. Configuration

#### Laboratory Information (`config/lab-info.json`)
```json
{
  "lab": {
    "name": {
      "en": "Your Research Lab",
      "zh": "您的研究实验室"
    },
    "description": {
      "en": "Your lab description",
      "zh": "实验室描述"
    }
  },
  "contact": {
    "email": "lab@university.edu",
    "phone": "+1 (555) 123-4567"
  }
}
```

#### Team Members (`config/members.json`)
```json
{
  "members": {
    "faculty": [
      {
        "id": "prof-smith",
        "name": "Dr. Jane Smith",
        "name_zh": "简·史密斯博士",
        "position": {
          "en": "Professor & Lab Director",
          "zh": "教授 & 实验室主任"
        },
        "email": "jane.smith@university.edu",
        "image": "assets/images/members/jane-smith.jpg"
      }
    ]
  }
}
```

### 3. Publications Management

You have two options for managing publications:

#### Option A: JSON Configuration
Edit `config/publications.json` directly:

```json
{
  "publications": [
    {
      "id": "pub-2024-001",
      "type": "journal",
      "title": {
        "en": "Your Paper Title",
        "zh": "您的论文标题"
      },
      "authors": [
        {"name": "Author Name", "is_highlighted": true}
      ],
      "journal": "Journal Name",
      "year": 2024,
      "doi": "10.1000/1234"
    }
  ]
}
```

#### Option B: BibTeX Integration
Edit `assets/bibliography/publications.bib`:

```bibtex
@article{author2024paper,
  title={Your Paper Title},
  author={Author Name and Coauthor Name},
  journal={Journal Name},
  year={2024},
  doi={10.1000/1234},
  keywords={keyword1, keyword2}
}
```

The system will automatically parse BibTeX and display it with enhanced features.

## Advanced Features

### BibTeX Field Support

The parser supports comprehensive BibTeX fields including:

**Standard Fields:**
- `title`, `author`, `year`, `journal`, `booktitle`
- `volume`, `number`, `pages`, `doi`, `url`, `isbn`, `issn`
- `abstract`, `keywords`, `publisher`, `address`

**Extended Academic Fields:**
- `arxiv`, `pmid`, `pmcid`, `code`, `data`, `slides`, `video`
- `research_area`, `funding`, `citation_count`, `altmetric_score`
- `collaborators`, `award`, `patents`, `software`, `datasets`
- `corresponding_author`, `equal_contribution`, `student_authors`

### Enhanced Author Information

```json
{
  "authors": [
    {
      "name": "Jane Smith",
      "is_highlighted": true,
      "email": "jane@university.edu",
      "orcid": "0000-0000-0000-0001",
      "student": false
    }
  ]
}
```

### Multiple Language Support

Add translations for any field:

```json
{
  "title": {
    "en": "English Title",
    "zh": "中文标题"
  },
  "abstract": {
    "en": "English abstract",
    "zh": "中文摘要"
  }
}
```

### Customization

#### Theme Customization (`config/theme-config.json`)
```json
{
  "theme": {
    "colors": {
      "primary": "#2563eb",
      "secondary": "#64748b"
    },
    "typography": {
      "font_family": "Inter, sans-serif"
    }
  }
}
```

#### Adding Custom Sections
1. Add HTML section to `index.html`
2. Add translations to `config/i18n.json`
3. Create renderer module in `js/`
4. Initialize in `js/main.js`

## Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select `main` branch as source

### Other Hosting
- Upload files to any web server
- Ensure the server serves static files correctly
- No special requirements or dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## License

This template is provided under the MIT License. Feel free to use and modify for your research group.

## Support

For issues and questions:
1. Check the configuration examples
2. Review the file structure
3. Test with minimal data first
4. Create an issue in the repository

---

**Note**: This template was designed to make academic homepage maintenance as simple as possible. Most updates only require editing JSON configuration files - no coding needed!
