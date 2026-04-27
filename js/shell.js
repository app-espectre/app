/* ============================================================
   ESPECTRE — shell.js
   Injecta la barra superior, la navegació inferior i el menú lateral
   S'executa en totes les pàgines autenticades
   ============================================================ */

/* ── HELP MODAL — 9 configuracions per grup de pàgines ─────
   img: ruta relativa des de pages/ → ../img/helpX.svg
   ─────────────────────────────────────────────────────────── */
const HELP_CONFIG = {

  ajuda: {
    title: 'AJUDA',
    img: '../img/help1.svg',
    cardTitle: 'Tens algun dubte?',
    cardSub: 'Pregunta\'m el que vulguis i t\'ajudaré al moment.',
    faqs: [
      { q: 'Com puc navegar per l\'app?', a: 'Utilitza la barra inferior per accedir ràpidament a Inici, Perfil, Recursos, Comunitat i Recordatoris.' },
      { q: 'Puc personalitzar l\'aplicació?', a: 'Sí! A Configuració pots activar el mode fosc, gestionar notificacions i editar les dades del compte.' },
      { q: 'Quins serveis ofereix ESPECTRE?', a: 'Seguiment del progrés, recordatoris, recursos sobre TEA, directori de professionals i comunitat de suport familiar.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE, una eina de suport per a famílies amb fills amb TEA. Respon en català de forma breu, càlida i clara sobre l\'ús general de l\'aplicació.',
  },

  perfil: {
    title: 'PERFIL',
    img: '../img/help2.svg',
    cardTitle: 'Gestiona el perfil',
    cardSub: 'Edita les dades del teu fill/a i afegeix observacions al diari.',
    faqs: [
      { q: 'Com edito les dades del perfil?', a: 'Prem el botó "Editar" a la part superior del perfil per modificar el nom, edat i diagnòstic.' },
      { q: 'Què és el diari d\'observacions?', a: 'Un espai per registrar assoliments, dificultats i canvis del teu fill/a per fer un seguiment personalitzat.' },
      { q: 'Puc eliminar el perfil?', a: 'Sí, des de la pantalla d\'edició trobaràs l\'opció "Eliminar perfil". Aquesta acció és irreversible.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre la gestió del perfil de l\'infant: editar dades, diari d\'observacions, habilitats i diagnòstic. Respon en català, breu i càlidament.',
  },

  progres: {
    title: 'PROGRÉS',
    img: '../img/help3.svg',
    cardTitle: 'Seguiment del progrés',
    cardSub: 'Avalua les habilitats del teu fill/a i consulta l\'evolució per àrees.',
    faqs: [
      { q: 'Com funciona l\'avaluació?', a: 'Respon les preguntes sobre el comportament dels últims 30 dies. Cada àrea té 12 preguntes amb tres opcions.' },
      { q: 'Amb quina freqüència haig de fer l\'avaluació?', a: 'Es recomana fer-la cada 4-6 setmanes per veure l\'evolució de manera significativa.' },
      { q: 'Quines àrees s\'avaluen?', a: 'Comunicació, Interacció social, Autonomia, Habilitats motrius i Conducta emocional.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre el seguiment del progrés, les avaluacions d\'habilitats i la interpretació dels resultats per a nens amb TEA. Respon en català, breu i càlidament.',
  },

  recordatoris: {
    title: 'RECORDATORIS',
    img: '../img/help4.svg',
    cardTitle: 'Gestiona les cites',
    cardSub: 'Afegeix i organitza teràpies, cites mèdiques i medicació.',
    faqs: [
      { q: 'Com afegeixo un nou recordatori?', a: 'Prem el botó "+" blau a la cantonada inferior dreta i omple el títol, tipus i hora.' },
      { q: 'Puc eliminar un recordatori?', a: 'Sí, prem la icona de la paperera a la dreta de cada recordatori a la llista.' },
      { q: 'Quins tipus de recordatoris hi ha?', a: 'Teràpia, Cita mèdica, Medicació i Escola.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre la gestió de recordatoris, cites mèdiques i teràpies per a nens amb TEA. Respon en català, breu i càlidament.',
  },

  recursos: {
    title: 'RECURSOS',
    img: '../img/help5.svg',
    cardTitle: 'Aprèn sobre el TEA',
    cardSub: 'Explora guies, articles i vídeos per acompanyar millor el teu fill/a.',
    faqs: [
      { q: 'On trobo informació sobre teràpies?', a: 'A "Educació i teràpies" trobaràs articles sobre ABA, teràpia de parla i adaptació curricular.' },
      { q: 'Puc cercar articles concrets?', a: 'Sí, utilitza la barra de cerca a la part superior per filtrar per paraula clau.' },
      { q: 'Els recursos són fiables?', a: 'Provenen de fonts especialitzades en TEA i estan revisats per professionals del sector.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre els recursos informatius, guies sobre TEA, teràpies i estratègies per a famílies. Respon en català, breu i càlidament.',
  },

  professionals: {
    title: 'PROFESSIONALS',
    img: '../img/help6.svg',
    cardTitle: 'Troba el professional ideal',
    cardSub: 'Cerca psicòlegs, logopedes i terapeutes especialitzats en TEA.',
    faqs: [
      { q: 'Com filtro els resultats?', a: 'Utilitza els filtres de tipus, zona geogràfica i modalitat (presencial o online) a la part superior.' },
      { q: 'Puc contactar directament?', a: 'Sí, accedeix al perfil i utilitza el botó "Enviar missatge" per iniciar el contacte.' },
      { q: 'Les valoracions són verificades?', a: 'Sí, les ressenyes provenen de famílies que han consultat realment amb el professional.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre com trobar i contactar professionals especialitzats en TEA (psicòlegs, logopedes, terapeutes). Respon en català, breu i càlidament.',
  },

  comunitat: {
    title: 'COMUNITAT',
    img: '../img/help7.svg',
    cardTitle: 'Tens algun dubte?',
    cardSub: 'Pregunta\'m el que vulguis i t\'ajudaré al moment.',
    faqs: [
      { q: 'Què puc fer dins la comunitat?', a: 'Pots publicar contingut, comentar, interactuar amb altres usuaris i participar en discussions de grup.' },
      { q: 'És gratuït utilitzar la comunitat?', a: 'Sí, l\'accés bàsic és completament gratuït.' },
      { q: 'Quines normes he de seguir?', a: 'Has de respectar els altres usuaris i evitar contingut ofensiu, inadequat o fora de context.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre la comunitat de famílies: publicar, grups, normes de conducta i interacció. Respon en català, breu i càlidament.',
  },

  informe: {
    title: 'INFORME',
    img: '../img/help8.svg',
    cardTitle: 'Genera informes professionals',
    cardSub: 'Crea documents per compartir amb metges, terapeutes i mestres.',
    faqs: [
      { q: 'Quina informació inclou l\'informe?', a: 'Pots seleccionar: dades bàsiques, progrés, avaluacions, diari d\'observacions i recomanacions automàtiques.' },
      { q: 'En quin format es genera?', a: 'En PDF, llest per descarregar o compartir per correu i WhatsApp.' },
      { q: 'Puc personalitzar el contingut?', a: 'Sí, marca o desmarca les seccions que vols incloure abans de generar l\'informe.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre la generació d\'informes de seguiment per a nens amb TEA: continguts, format i com compartir-los. Respon en català, breu i càlidament.',
  },

  configuracio: {
    title: 'CONFIGURACIÓ',
    img: '../img/help9.svg',
    cardTitle: 'Personalitza l\'app',
    cardSub: 'Gestiona el teu compte, notificacions i preferències d\'accessibilitat.',
    faqs: [
      { q: 'Com activo el mode fosc?', a: 'A "Accessibilitat" dins Configuració, activa el toggle "Mode fosc". Es guarda automàticament.' },
      { q: 'Puc gestionar les notificacions?', a: 'Sí, a "Notificacions" pots activar o desactivar cada tipus per separat.' },
      { q: 'Com tanco sessió?', a: 'Prem "Tancar sessió" al final de Configuració o al menú lateral.' },
    ],
    aiContext: 'Ets un assistent de l\'app ESPECTRE. Ajuda amb dubtes sobre la configuració: compte, notificacions, accessibilitat i preferències. Respon en català, breu i càlidament.',
  },

};

/* Mapa: pàgina → clau de HELP_CONFIG */
const PAGE_HELP_MAP = {
  'home':                'ajuda',
  'profile-edit':        'perfil',
  'profile-note':        'perfil',
  'profile-view':        'perfil',
  'profile-skill':       'perfil',
  'progress':            'progres',
  'assessment':          'progres',
  'results':             'progres',
  'reminders':           'recordatoris',
  'reminder-add':        'recordatoris',
  'info':                'recursos',
  'professionals':       'professionals',
  'professional-detail': 'professionals',
  'community':           'comunitat',
  'community-search':    'comunitat',
  'community-chat':      'comunitat',
  'community-publish':   'comunitat',
  'report-gen':          'informe',
  'report-done':         'informe',
  'settings':            'configuracio',
  'profile-settings':    'configuracio',
};

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
    'profile-note', 'profile-settings',
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
    'profile-note': 'profile-view',
    'report-gen': 'report-gen', 'report-done': 'report-gen',
    'settings': 'settings', 'profile-settings': 'settings',
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
    <button class="avatar-btn" id="btn-avatar" aria-label="Perfil"></button>
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

  const s = State.load();
  const parentName = s.profile.parentName || 'Ana Molina';
  const parentEmail = s.profile.parentEmail || 'anamolina@gmail.com';
  const parentAvatar = s.profile.parentAvatar || 'personatge1.svg';

  sideMenu.innerHTML = `
    <div class="side-menu__header">
      <div class="side-menu__avatar" style="background-image: url('../img/ana.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
      <div class="side-menu__user">
        <div class="side-menu__name">${parentName}</div>
        <div class="side-menu__email">${parentEmail}</div>
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
      <button class="btn btn--transparent btn--sm" style="color:var(--color-red);width:100%" id="btn-logout">
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

  // ── HELP MODAL (dinàmic per pàgina) ──────────────────────
  const helpKey = PAGE_HELP_MAP[currentPageId] || 'ajuda';
  const helpCfg = HELP_CONFIG[helpKey];

  const helpModal = document.createElement('div');
  helpModal.className = 'help-modal';
  helpModal.id = 'help-modal';
  helpModal.dataset.helpKey = helpKey;
  helpModal.innerHTML = `
    <button class="help-modal__close" id="btn-help-close" aria-label="Tancar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="help-modal__header">
      <p class="help-modal__label">${helpCfg.title}</p>
      <div class="help-modal__card">
        <div class="help-modal__img-wrap">
          <img src="${helpCfg.img}" alt="${helpCfg.title}">
        </div>
        <p class="help-modal__card-title">${helpCfg.cardTitle}</p>
        <p class="help-modal__card-sub">${helpCfg.cardSub}</p>
      </div>
    </div>
    <div class="help-modal__body" id="help-modal-body">
      <p class="help-modal__faq-title">Preguntes freqüents</p>
      <div class="help-modal__faq-list">
        ${helpCfg.faqs.map(f => `
          <div class="help-modal__faq-item">
            <div class="help-modal__faq-dot"></div>
            <div>
              <p class="help-modal__faq-q">${f.q}</p>
              <p class="help-modal__faq-a">${f.a}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="help-modal__replies" id="help-replies"></div>
    </div>
    <div class="help-modal__input-bar">
      <input class="help-modal__input" id="help-input" type="text" placeholder="Escriu la teva pregunta...">
      <button class="help-modal__send" id="btn-help-send" aria-label="Enviar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#023059" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
      </button>
    </div>
  `;
  app.appendChild(helpModal);

  document.getElementById('btn-help-close').addEventListener('click', closeHelpModal);
  document.getElementById('btn-help-send').addEventListener('click', sendHelpMessage);
  document.getElementById('help-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendHelpMessage();
  });

  // ── EVENTS ────────────────────────────────────────────────
  document.getElementById('btn-menu').addEventListener('click', openMenu);
document.getElementById('btn-avatar').addEventListener('click', () => { closeMenu(); openHelpModal(); });
  document.getElementById('overlay').addEventListener('click', closeMenu);
  document.getElementById('btn-logout').addEventListener('click', () => { State.reset(); goTo('welcome'); });
  document.querySelector('.side-menu__avatar').addEventListener('click', () => { closeMenu(); goTo('profile-settings'); });
  document.querySelector('.side-menu__name').addEventListener('click', () => { closeMenu(); goTo('profile-settings'); });
  document.querySelector('.side-menu__email').addEventListener('click', () => { closeMenu(); goTo('profile-settings'); });
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

function openHelpModal() {
  const m = document.getElementById('help-modal');
  if (!m) return;
  m.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('open')));
}

function closeHelpModal() {
  const m = document.getElementById('help-modal');
  if (!m) return;
  m.classList.remove('open');
  setTimeout(() => { m.style.display = 'none'; }, 400);
}

async function sendHelpMessage() {
  const input     = document.getElementById('help-input');
  const repliesEl = document.getElementById('help-replies');
  const body      = document.getElementById('help-modal-body');
  if (!input || !repliesEl) return;

  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.disabled = true;

  /* Missatge de l'usuari */
  const userBubble = document.createElement('div');
  userBubble.className = 'help-bubble help-bubble--out';
  userBubble.textContent = text;
  repliesEl.appendChild(userBubble);

  /* Indicador "escrivint..." amb tres punts animats */
  const typingBubble = document.createElement('div');
  typingBubble.className = 'help-bubble help-bubble--typing';
  typingBubble.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  repliesEl.appendChild(typingBubble);
  if (body) body.scrollTop = body.scrollHeight;

  /* Context de IA adaptat a la pàgina actual */
  const helpKey = document.getElementById('help-modal')?.dataset.helpKey || 'ajuda';
  const aiCtx   = HELP_CONFIG[helpKey]?.aiContext || HELP_CONFIG.ajuda.aiContext;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: aiCtx,
        messages: [{ role: 'user', content: text }],
      }),
    });
    const data = await res.json();
    typingBubble.remove();

    const aiText = data?.content?.[0]?.text || 'Ho sento, no he pogut respondre ara.';
    const aiBubble = document.createElement('div');
    aiBubble.className = 'help-bubble help-bubble--in';
    aiBubble.textContent = aiText;
    repliesEl.appendChild(aiBubble);
  } catch (e) {
    typingBubble.remove();
    const errBubble = document.createElement('div');
    errBubble.className = 'help-bubble help-bubble--in';
    errBubble.textContent = 'Ho sento, hi ha hagut un error. Torna a intentar-ho.';
    repliesEl.appendChild(errBubble);
  }

  input.disabled = false;
  input.focus();
  if (body) body.scrollTop = body.scrollHeight;
}