const header = document.querySelector('.header');
const menu = document.querySelector('.menu');
const mobileNav = document.querySelector('.mobile-nav');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; menu.innerHTML = `<i data-lucide="${open ? 'menu' : 'x'}"></i>`; window.lucide?.createIcons(); });
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded','false'); mobileNav.hidden = true; }));
window.addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 12), {passive:true});
document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active')); button.classList.add('active'); const filter = button.dataset.filter; document.querySelectorAll('.result-grid article').forEach(card => { card.hidden = filter !== 'all' && card.dataset.type !== filter; }); }));
document.getElementById('year').textContent = new Date().getFullYear();
window.addEventListener('DOMContentLoaded', () => window.lucide?.createIcons());
