/* ============================================
   LUCK Research Group — Scripts
   多页面切换 · 导航交互 · 成果筛选 · CN/EN i18n
   ============================================ */

// ---------- i18n dictionary (EN) ----------
// 中文以 index.html 为源；切换到 EN 时用下面的值替换 [data-i18n] 元素内容，
// 原中文存入 data-i18n-orig，切回 CN 时完整还原。
// 新增页面条目若带中文标签（如 rs-tag），请同步在此补充键值。
const I18N = {
  en: {
    'doc.title': 'LUCK Research Group | Southeast University',
    'nav.home': 'Home',
    'nav.directions': 'Research',
    'nav.results': 'Achievements',
    'nav.members': 'Members',
    'nav.join': 'Join Us',
    'home.heroTitle': 'Ubiquitous Knowledge Intelligence Research Group',
    'home.heroSub': 'Linking Ubiquities with Connected Knowledge (LUCK)',
    'home.heroDesc': 'The Ubiquitous Knowledge Intelligence Research Group (Linking Ubiquities with Connected Knowledge, <strong>LUCK</strong>) is affiliated with the School of Computer Science and Engineering at Southeast University. Advised by <strong><a href="https://jujuhoo.github.io/" target="_blank" rel="noreferrer">Prof. Jiahui Jin</a></strong>, we study data agents, big data processing, urban computing and related directions, advancing intelligent data applications and knowledge intelligence.',
    'home.dirsTitle': 'Research Directions',
    'home.dir1.title': 'Data Agents',
    'home.dir1.sub1': 'Retrieval-Augmented Generation (RAG)',
    'home.dir1.sub2': 'LLM routing & pricing',
    'home.dir1.sub3': 'Tool use & memory management',
    'home.dir1.sub4': 'Multi-source knowledge conflict resolution',
    'home.dir2.title': 'Big Data Processing',
    'home.dir2.sub1': 'Large-scale graph data cleaning',
    'home.dir2.sub2': 'CPU-GPU heterogeneous acceleration',
    'home.dir2.sub3': 'Distributed computing & storage optimization',
    'home.dir2.sub4': 'Efficient traffic data generation',
    'home.dir3.title': 'Urban Computing',
    'home.dir3.sub1': 'Spatio-temporal forecasting & trajectory modeling',
    'home.dir3.sub2': 'Urban region representation learning',
    'home.dir3.sub3': 'Social network cascade prediction',
    'home.dir3.sub4': 'Knowledge graphs & multimodal fusion',
    'home.dir3.sub5': 'POI recommendation & semantic understanding',
    'home.learnMore': 'Learn more',
    'tag.paper': 'Paper',
    'tag.award': 'Award',
    'dirs.title': 'Research Directions',
    'dirs.desc': 'Three research directions work closely together to advance ubiquitous knowledge intelligence',
    'dirs.dir1.title': 'Data Agents',
    'dirs.dir1.desc': 'We research retrieval-augmented generation (RAG), LLM routing and pricing, and tool-use and memory-management techniques, building Data Agents that work reliably in real knowledge environments — an intelligent bridge from natural language to structured insights.',
    'dirs.dir2.title': 'Big Data Processing',
    'dirs.dir2.desc': 'Computing, storage and scheduling optimization for PB-scale data. We study large-scale graph processing, CPU-GPU heterogeneous acceleration and distributed cleaning systems, making complex data workloads faster, steadier and easier to use.',
    'dirs.dir3.title': 'Urban Computing',
    'dirs.dir3.desc': 'Understanding how cities run with spatio-temporal data and knowledge graphs. We study region representation learning, traffic forecasting, trajectory modeling, urban event prediction, knowledge extraction and alignment, and multimodal semantic fusion — so data and knowledge together keep cities running more efficiently.',
    'dir.papers': 'Related Publications',
    'results.title': 'Research Achievements',
    'filter.paper': '📄 Papers',
    'filter.project': '🔬 Projects',
    'filter.award': '🏆 Awards',
    'tag.stForecast': 'ST Forecasting',
    'tag.cascade': 'Cascade Prediction',
    'tag.llmPricing': 'LLM Pricing',
    'tag.regionPretrain': 'Region Pre-training',
    'tag.mmRec': 'Multimodal Recommendation',
    'tag.traffic': 'Traffic Forecasting',
    'tag.graphClean': 'Graph Cleaning',
    'tag.graphCleanSys': 'Graph Cleaning System',
    'tag.geoER': 'Geospatial Entity Resolution',
    'tag.textAgg': 'Text Aggregation Queries',
    'tag.toolUse': 'Tool-Use Optimization',
    'tag.conflict': 'Knowledge Conflict Detection',
    'venue.nsfcGeneral': 'NSFC General Program',
    'venue.mostKeyRd': 'MOST Key R&D Program',
    'venue.nsfcKey': 'NSFC Key Program',
    'venue.sti2030': 'S&T Innovation 2030',
    'venue.nsfcYoung': 'NSFC Young Scientists Fund',
    'venue.provNsf': 'Provincial NSF',
    'status.ongoing': 'Ongoing',
    'status.closed': 'Completed',
    'proj.graphfm': 'PI · No. 62572119 · ¥500K · 2026.01–2029.12',
    'proj.dualcarbon': 'Participant · No. 2023YFC3804100 · 2023.12–2026.12',
    'proj.iot': 'Participant · No. 62232004 · ¥2.94M · 2023.01–2027.12',
    'proj.crowdsensing': 'PI · No. 62072099 · ¥570K · 2021.01–2024.12',
    'proj.swarm': 'Sub-project Leader · No. 2018AAA0101200 · ¥620K · 2019.12–2022.12',
    'proj.subgraph': 'PI · No. 61702096 · ¥250K · 2018.01–2020.12',
    'proj.provKg': 'PI · No. BK20170689 · ¥200K · 2017.07–2020.06',
    'award.challengeCup': '🏆 Challenge Cup',
    'award.tz2025': '2025 Challenge Cup “Jiebang Guashuai”',
    'award.grandPrize': 'Grand Prize',
    'award.tz2024': '2024 Challenge Cup “Jiebang Guashuai”',
    'award.firstPrize': 'First Prize',
    'award.bescTitle': 'Efficient Urban-Scale Traffic Data Generation',
    'award.bescNote': 'Haojia Zhu · BESC 2024 Best Student Paper Award',
    'members.title': 'Members',
    'members.desc': 'We respect each person’s own pace of growth, and treasure the satisfaction of getting things done well together.',
    'members.full': 'View Full Member List',
    'group.advisor': 'Advisor',
    'group.phd': 'PhD Students',
    'group.master': 'Master Students',
    'group.alumni': 'Alumni',
    'advisor.role': 'Associate Professor · Vice Dean · PhD Supervisor',
    'advisor.homepage': 'Homepage',
    'common.affil': 'School of Computer Science and Engineering, Southeast University',
    'alumni.note': 'Our alumni work at Huawei, Tencent, ByteDance, Alibaba, DiDi, Meituan, Microsoft and other companies, and some have gone on to research institutes in Shenzhen, Hong Kong and beyond for further study.',
    'photo.title': 'Team Moments'
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // ---------- DOM refs ----------
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavAnchors = document.querySelectorAll('[data-nav]');
  const pages = document.querySelectorAll('.page');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const resultStrips = document.querySelectorAll('.result-strip');

  // ---------- Page Switching ----------
  function switchPage(pageName, scrollTarget) {
    // Hide all pages, show target
    pages.forEach(p => p.classList.remove('active'));
    const target = document.querySelector(`.page[data-page="${pageName}"]`);
    if (target) target.classList.add('active');

    // Update nav active state
    allNavAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-nav') === pageName);
    });

    // Hide CN/EN switch on the Join page (content stays untranslated)
    document.body.classList.toggle('page-join', pageName === 'join');

    // Scroll to top or specific target
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({behavior:'smooth',block:'center'});
      }, 150);
    } else {
      window.scrollTo({top:0,behavior:'smooth'});
    }

    // Close mobile nav
    navLinks?.classList.remove('mobile-open');
    if (navToggle) navToggle.innerHTML = '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  }

  // Nav click handlers
  allNavAnchors.forEach(a => {
    a.addEventListener('click', e => {
      const pageName = a.getAttribute('data-nav');
      if (!pageName) return;
      e.preventDefault();
      switchPage(pageName);
    });
  });

  // Direction summary box clicks (home → directions page with scroll target)
  document.querySelectorAll('.ds-card[data-goto]').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-goto');
      switchPage('directions', targetId);
    });
  });

  // ---------- Mobile Nav Toggle ----------
  navToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    navToggle.innerHTML = open
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  });

  // ---------- Navbar scroll effect ----------
  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // ---------- Result Filter ----------
  // Init: show papers by default
  resultStrips.forEach(strip => {
    strip.hidden = strip.dataset.type !== 'paper';
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      resultStrips.forEach(strip => {
        strip.hidden = strip.dataset.type !== filter;
      });
    });
  });

  // ---------- Footer Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- i18n (CN / EN) ----------
  const langSwitch = document.getElementById('langSwitch');
  const langBtns = langSwitch ? langSwitch.querySelectorAll('[data-lang-opt]') : [];
  const ZH_TITLE = document.title;

  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (lang === 'en') {
        const val = I18N.en[el.getAttribute('data-i18n')];
        if (val === undefined) return; // no translation yet: keep Chinese
        if (!el.hasAttribute('data-i18n-orig')) el.setAttribute('data-i18n-orig', el.innerHTML);
        el.innerHTML = val;
      } else if (el.hasAttribute('data-i18n-orig')) {
        el.innerHTML = el.getAttribute('data-i18n-orig');
      }
    });
    document.title = lang === 'en' ? (I18N.en['doc.title'] || ZH_TITLE) : ZH_TITLE;
    langBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-lang-opt') === lang));
    document.documentElement.classList.remove('i18n-boot');
  }

  langBtns.forEach(b => b.addEventListener('click', () => {
    const lang = b.getAttribute('data-lang-opt');
    try { localStorage.setItem('luck-lang', lang); } catch (e) {}
    applyLang(lang);
  }));

  // Default EN; early choice was set by the inline script in <head>
  applyLang(document.documentElement.getAttribute('data-lang') || 'en');

  // ---------- Init Icons ----------
  window.lucide?.createIcons();

});
