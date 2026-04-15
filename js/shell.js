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
    'profile-view': 'profile-view', 'profile-edit': 'profile-view',
    'profile-note': 'profile-view', 'profile-skill': 'profile-view',
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
    <span class="top-bar__logo">ESPECTRE</span>
    <button class="avatar-btn" id="btn-avatar" aria-label="Perfil">AM</button>
  `;
  app.appendChild(topBar);

  // ── BOTTOM NAV ───────────────────────────────────────────
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav visible';
  bottomNav.id = 'bottom-nav';
  const navItems = [
    { id: 'home',         icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`, label: 'Inici' },
    { id: 'progress',     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, label: 'Progrés' },
    { id: 'community',    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, label: 'Comunitat' },
    { id: 'reminders',    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`, label: 'Recordatoris' },
    { id: 'profile-view', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, label: 'Perfil' },
  ];
  bottomNav.innerHTML = `
    <div class="bottom-nav__inner">
      ${navItems.map(n => `
        <button class="nav-btn ${activeNav === n.id ? 'active' : ''}" data-page="${n.id}">
          ${n.icon}
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
  sideMenu.innerHTML = `
    <div class="side-menu__header">
      <div class="side-menu__avatar">AM</div>
      <div class="side-menu__user">
        <div class="side-menu__name">Ana Molina</div>
        <div class="side-menu__email">anamolina@gmail.com</div>
      </div>
    </div>
    <nav class="side-menu__nav">
      ${[
        { id:'home', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`, label:'Inici' },
          { id:'profile-view', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`, label:'Perfil de la Martina' },
          { id:'--divider--', label:'' },
          { id:'progress', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, label:'Progrés' },
          { id:'reminders', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`, label:'Recordatoris' },
          { id:'info', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`, label:'Recursos' },
          { id:'professionals', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.7a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`, label:'Professionals' },
          { id:'community', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, label:'Comunitat' },
          { id:'report-gen', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>`, label:'Generar informe' },
          { id:'--divider--', label:'' },
          { id:'settings', icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`, label:'Configuració' },
        ].map(item => item.id === '--divider--'
          ? `<div class="side-menu__divider"></div>`
          : `<button class="side-menu__item ${activeNav === item.id ? 'active' : ''}" data-page="${item.id}">${item.icon}${item.label}</button>`
        ).join('')}
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
