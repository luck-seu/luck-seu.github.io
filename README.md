# Advanced Research Laboratory Website

A professional, modern academic research group website inspired by the clean design philosophy of top university research groups like CMU Database Group.

## 🎨 Design Philosophy

This website embodies the principles of professional academic web design:

- **Clean Typography**: Using Crimson Text serif for headings and Source Sans Pro for body text
- **Minimalist Layout**: Focus on content with generous white space
- **Professional Color Palette**: Sophisticated black/white with blue accent
- **Card-Based Organization**: Clear content hierarchy with subtle shadows
- **Mobile-First Design**: Responsive across all devices

## ✨ Features

### Core Functionality
- **Dynamic Content Management**: JSON-based configuration system
- **Internationalization**: Full English/Chinese language support
- **Smart Navigation**: Smooth scrolling with active state indicators
- **Interactive Components**: Tabs, filters, search, and animations

### Academic Features
- **Research Areas**: Organized showcase of research interests
- **Team Members**: Faculty, students, and alumni profiles
- **Publications**: Filterable publication database with search
- **News & Updates**: Latest achievements and announcements
- **Contact Forms**: Professional inquiry management

### User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Fast loading with optimized assets
- **SEO Friendly**: Semantic HTML5 structure

## 📁 Project Structure

```
├── index.html              # Main HTML structure
├── styles/
│   ├── main.css            # Professional academic styling
│   └── responsive.css      # Mobile-first responsive design
├── js/
│   ├── data-loader.js      # Configuration data loading
│   └── app.js              # Main application logic
├── config/                 # Content configuration
│   ├── lab-info.json       # Laboratory information
│   ├── members.json        # Team members data
│   ├── publications.json   # Publications database
│   ├── research-areas.json # Research areas
│   ├── theme-config.json   # Design customization
│   └── i18n.json          # Internationalization
└── assets/                 # Media files
    ├── images/
    │   ├── members/        # Member photos
    │   ├── research/       # Research area images
    │   └── logos/          # Lab logos
    ├── papers/             # Publication PDFs
    └── slides/             # Presentation slides
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Local web server (recommended)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd research-lab-website
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

## ⚙️ Configuration

### Laboratory Information
Edit `config/lab-info.json` to update:
- Lab name and descriptions
- Contact information
- Social media links
- Statistics

### Team Members
Edit `config/members.json` to:
- Add/remove faculty, students, alumni
- Update profiles and research interests
- Manage social links

### Publications
Edit `config/publications.json` to:
- Add new publications
- Update existing entries
- Manage metadata and links

### Theme Customization
Edit `config/theme-config.json` to:
- Change colors and typography
- Adjust spacing and layout
- Customize component styles

## 🌍 Adding Languages

1. **Add translations to i18n.json**
   ```json
   {
     "en": { /* English */ },
     "zh": { /* Chinese */ },
     "es": { /* Add Spanish */ }
   }
   ```

2. **Update language selector**
   ```html
   <button class="lang-toggle" data-lang="es">ES</button>
   ```

3. **Add content translations**
   Update all JSON files with language-specific content

## 🎨 Design Customization

### Typography
The site uses a professional font pairing:
- **Headings**: Crimson Text (serif)
- **Body**: Source Sans Pro (sans-serif)

### Color Scheme
Professional academic palette:
- **Primary**: Black (#000000)
- **Accent**: Blue (#0066cc)
- **Text**: Grayscale hierarchy
- **Background**: White with subtle grays

### Layout Principles
- **Content width**: Max 800px for readability
- **Spacing**: 16px base unit system
- **Borders**: Subtle 1px lines
- **Shadows**: Professional and minimal

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 641px - 768px
- **Desktop**: 769px - 1024px
- **Large**: 1025px - 1280px
- **Ultra Wide**: > 1280px

### Mobile Features
- Hamburger menu for navigation
- Touch-optimized tap targets
- Simplified layouts
- Optimized typography

## 🔧 Development

### JavaScript Architecture
- **Modular ES6 Classes**: Clean separation of concerns
- **Component-Based**: Reusable UI components
- **Event-Driven**: Efficient event handling
- **Async/Await**: Modern asynchronous patterns

### CSS Architecture
- **CSS Custom Properties**: Dynamic theming
- **Mobile-First**: Progressive enhancement
- **Component Styles**: Organized, maintainable code
- **Performance**: Optimized for fast loading

## 🌐 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Features**: ES6+, CSS Grid, Flexbox, Custom Properties

## 📈 SEO Optimization

- **Semantic HTML5**: Proper structure for search engines
- **Meta Tags**: Optimized titles and descriptions
- **Open Graph**: Social media sharing
- **Structured Data**: JSON-LD for rich snippets
- **Performance**: Fast Core Web Vitals

## 🔒 Security

- **No Dependencies**: Self-contained implementation
- **HTTPS Ready**: Production-ready security
- **XSS Protected**: Safe HTML generation
- **Input Validation**: Form security measures

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **CMU Database Group**: Design inspiration
- **Google Fonts**: Professional typography
- **Font Awesome**: Icon library
- **MDN Web Docs**: Technical references

---

**Built with ❤️ for the academic research community**