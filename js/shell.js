/* ============================================================
   ESPECTRE — shell.js
   Injecta la barra superior, la navegació inferior i el menú lateral
   S'executa en totes les pàgines autenticades
   ============================================================ */

function renderShell(currentPageId) {
  const app = document.getElementById('app');
  if (!app) return;

  const authPages = [
    'home','progress','assessment','results',
    'reminders','reminder-add','info',
    'report-gen','report-done','professionals',
    'professional-detail','community','community-search',
    'community-chat','community-publish',
    'settings','profile-edit','profile-view',
    'profile-note','profile-skill',
  ];

  const isAuth = authPages.includes(currentPageId);
  if (!isAuth) return;

  const navMap = {
    'home': 'home',
    'progress': 'progress', 'assessment': 'progress', 'results': 'progress',
    'community': 'community', 'community-search': 'community',
    'community-chat': 'community', 'community-publish': 'community',
    'reminders': 'reminders', 'reminder-add': 'reminders',
    'info': 'info',
    'professionals': 'professionals', 'professional-detail': 'professionals',
    'profile-view': 'profile-view', 'profile-edit': 'profile-view',
    'profile-note': 'profile-view', 'profile-skill': 'profile-view',
    'report-gen': 'report-gen', 'report-done': 'report-gen',
    'settings': 'settings',
  };
  const activeNav = navMap[currentPageId] || '';

  // ── TOP BAR ──────────────────────────────────────────────
  const topBar = document.createElement('header');
  topBar.className = 'top-bar visible';
  topBar.id = 'top-bar';
  topBar.innerHTML = `
    <button class="hamburger" id="btn-menu" aria-label="Obrir menú">
      <span></span><span></span><span></span>
    </button>
    <div class="top-bar__title" role="heading" aria-level="1"></div>
    <button class="avatar-btn" id="btn-avatar" aria-label="Perfil">AM</button>
  `;
  app.appendChild(topBar);

  // función auxiliar: obtiene el título que debe mostrarse en la top-bar
  function getPageTitle(pageId) {
    // 1) body[data-top-title]
    const bodyTitle = document.body.getAttribute('data-top-title');
    if (bodyTitle && bodyTitle.trim()) return bodyTitle.trim();

    // 2) buscar el section correspondiente (id="page-<pageId>" o id="<pageId>")
    let pageEl = null;
    if (pageId) {
      pageEl = document.getElementById('page-' + pageId) || document.getElementById(pageId);
    }
    if (!pageEl) pageEl = document.querySelector('.page.active');

    if (pageEl) {
      // 2a) data-top-title en la sección
      const attr = pageEl.getAttribute('data-top-title');
      if (attr && attr.trim()) return attr.trim();
      // 2b) buscar elementos internos habituales que contengan el título
      const sel = pageEl.querySelector('.page-header__title');
      if (sel && sel.textContent && sel.textContent.trim()) return sel.textContent.trim();
    }

    // 3) document.title
    if (document.title && document.title.trim()) return document.title.trim();

    // 4) fallback: transformar el id en texto bonito
    if (pageId) return pageId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return 'Espectre';
  }

  // fijar el título inicial según currentPageId
  const titleEl = topBar.querySelector('.top-bar__title');
  if (titleEl) titleEl.textContent = getPageTitle(currentPageId);

  // observar cambios en body[data-page] (si tu router actualiza ese atributo) y actualizar título
  if (document.body && !document.body._topbar_title_observer) {
    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'data-page') {
          const newId = document.body.getAttribute('data-page') || '';
          const el = document.querySelector('.top-bar__title');
          if (el) el.textContent = getPageTitle(newId);
        }
      }
    });
    mo.observe(document.body, { attributes: true });
    document.body._topbar_title_observer = mo;
  }

  // ── BOTTOM NAV ───────────────────────────────────────────
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav visible';
  bottomNav.id = 'bottom-nav';

  // usa img filenames en lugar de SVG; ajusta los nombres a los ficheros que tens en app/img
  const navItems = [
    { id: 'home',         img: 'Home.png',         label: 'Inici' },
    { id: 'profile-view', img: 'Perfil.png',      label: 'Perfil' },
    { id: 'info',         img: 'Recursos.png',     label: 'Recursos' },
    { id: 'community',    img: 'Comunidad.png',    label: 'Comunitat' },
    { id: 'reminders',    img: 'Recordatoris.png',    label: 'Recordatoris' },
  ];

  bottomNav.innerHTML = `
    <div class="bottom-nav__inner">
      ${navItems.map(n => `
        <button class="nav-btn ${activeNav === n.id ? 'active' : ''}" data-page="${n.id}">
          ${n.img ? `<img src="../img/${n.img}" alt="${n.label}" class="bottom-nav__icon">` : ''}
          <span>${n.label}</span>
        </button>
      `).join('')}
    </div>
  `;
  app.appendChild(bottomNav);

  // ── SIDE MENU ─────────────────────────────────────────────
  const sideMenu = document.createElement('aside');
  sideMenu.className = 'side-menu';
  sideMenu.id = 'side-menu';

  // build side menu items: use 'page' for navigation target and 'img' for image filename
  const sideItems = [
    { page: 'home',           img: 'Home.png',           label: 'Inici' },
    { page: 'profile-view',   img: 'Perfil.png',        label: 'Perfil de la Martina' },
    { page: '--divider--',    img: '',                  label: '' },
    { page: 'progress',       img: 'Progresos.png',       label: 'Progrés' },
    { page: 'reminders',      img: 'Recordatoris.png',      label: 'Recordatoris' },
    { page: 'info',           img: 'Recursos.png',           label: 'Recursos' },
    { page: 'professionals',  img: 'Profesionales.png',  label: 'Professionals' },
    { page: 'community',      img: 'Comunidad.png',      label: 'Comunitat' },
    { page: 'report-gen',     img: 'Informe.png',     label: 'Generar informe' },
    { page: '--divider--',    img: '',                  label: '' },
    { page: 'settings',       img: 'Configuracion.png',       label: 'Configuració' },
  ];

  sideMenu.innerHTML = `
    <div class="side-menu__header">
      <div class="side-menu__avatar"></div>
      <div class="side-menu__user">
        <div class="side-menu__name">Ana Molina</div>
        <div class="side-menu__email">anamolina@gmail.com</div>
      </div>
    </div>
    <nav class="side-menu__nav">
      ${sideItems.map(item => {
        if (item.page === '--divider--') return `<div class="side-menu__divider"></div>`;
        // use provided image filename (item.img). adjust filenames in app/img to match.
        const iconHtml = item.img ? `<img src="../img/${item.img}" alt="${item.label}" class="side-menu__icon">` : '';
        return `<button class="side-menu__item ${activeNav === item.page ? 'active' : ''}" data-page="${item.page}">${iconHtml}${item.label}</button>`;
      }).join('')}
    </nav>
    <div class="side-menu__footer">
      <button class="btn btn--ghost btn--sm" style="color:var(--color-red);width:100%" id="btn-logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Tancar sessió
      </button>
    </div>
  `;
  app.appendChild(sideMenu);

  // ── OVERLAY ───────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'overlay';
  app.appendChild(overlay);

  // ── EVENTS ────────────────────────────────────────────────
  document.getElementById('btn-menu').addEventListener('click', openMenu);
  document.getElementById('btn-avatar').addEventListener('click', () => { closeMenu(); goTo('profile-view'); });
  document.getElementById('overlay').addEventListener('click', closeMenu);
  document.getElementById('btn-logout').addEventListener('click', () => { State.reset(); goTo('welcome'); });

  document.querySelectorAll('.nav-btn[data-page], .side-menu__item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { closeMenu(); goTo(btn.dataset.page); });
  });
}

function openMenu() {
  document.getElementById('side-menu').classList.add('open');
  const overlay = document.getElementById('overlay');
  overlay.classList.add('visible');
  setTimeout(() => overlay.classList.add('active'), 10);
}

function closeMenu() {
  const menu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  if (menu) menu.classList.remove('open');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.classList.remove('visible'), 260);
  }
}
