/* ============================================================
   ESPECTRE — app.js
   Navegació, lògica de pàgina i renderitzat de components
   ============================================================ */

/* ── PAGE MAP ──────────────────────────────────────────────── */
const PAGE_MAP = {
  'welcome':              'welcome.html',
  'login':                'login.html',
  'register':             'register.html',
  'onboard-child':        'onboard-child.html',
  'onboard-diagnosis':    'onboard-diagnosis.html',
  'onboard-done':         'onboard-done.html',
  'home':                 'home.html',
  'progress':             'progress.html',
  'assessment':           'assessment.html',
  'results':              'results.html',
  'reminders':            'reminders.html',
  'reminder-add':         'reminder-add.html',
  'info':                 'info.html',
  'report-gen':           'report-gen.html',
  'report-done':          'report-done.html',
  'professionals':        'professionals.html',
  'professional-detail':  'professional-detail.html',
  'community':            'community.html',
  'community-search':     'community-search.html',
  'community-chat':       'community-chat.html',
  'community-publish':    'community-publish.html',
  'settings':             'settings.html',
  'profile-edit':         'profile-edit.html',
  'profile-view':         'profile-view.html',
  'profile-note':         'profile-note.html',
  'profile-skill':        'profile-skill.html',
};

function goTo(pageId, opts = {}) {
  const s = State.load();
  s.previousPage = document.body.dataset.page || null;
  if (opts.data) Object.assign(s, opts.data);
  State.save(s);
  const file = PAGE_MAP[pageId];
  if (!file) return;
  document.body.style.opacity = '0';
  setTimeout(() => { window.location.href = file; }, 120);
}

function goBack() {
  const s = State.load();
  const prev = s.previousPage;
  if (prev && PAGE_MAP[prev]) goTo(prev);
  else history.back();
}

/* ── ASSESSMENT DATA ─────────────────────────────────────── */
const ASSESSMENT_QUESTIONS = [
  { q: 'Utilitza paraules soles per comunicar-se?', area: 'Comunicació' },
  { q: 'Entén instruccions senzilles com "vine", "dona\'m això" o "seu"?', area: 'Comunicació' },
  { q: 'Mostra interès per interactuar amb altres persones?', area: 'Interacció social' },
  { q: 'Respon quan li diuen el seu nom o quan li parlen directament?', area: 'Comunicació' },
  { q: 'Pot fer algunes activitats quotidianes amb certa autonomia?', area: 'Autonomia' },
  { q: 'Intenta fer coses per si mateix sense demanar ajuda constantment?', area: 'Autonomia' },
  { q: 'Té coordinació en activitats com córrer, saltar o pujar escales?', area: 'Habilitats motrius' },
  { q: 'Pot manipular objectes petits amb les mans?', area: 'Habilitats motrius' },
  { q: 'Expressa les seves emocions d\'una manera que es pot entendre?', area: 'Conducta emocional' },
  { q: 'Pot tranquil·litzar-se amb ajuda després d\'un moment de frustració?', area: 'Conducta emocional' },
  { q: 'Accepta petits canvis en la rutina sense grans dificultats?', area: 'Conducta emocional' },
  { q: 'Pot mantenir l\'atenció en una activitat o joc durant uns minuts?', area: 'Conducta emocional' },
];

const ASSESSMENT_OPTIONS = [
  { label: 'Sí, de forma consistent', sub: 'Ho fa habitualment, sense necessitat de suport', value: 3 },
  { label: 'A vegades', sub: 'Ho fa en alguns contextos però no sempre', value: 2 },
  { label: 'Rarament o mai', sub: 'Necessita molt suport o no ho fa de forma verbal', value: 1 },
];

/* ── UTILITIES ───────────────────────────────────────────── */
function apptCardHTML(r, idx, showDelete = false) {
  return `
    <article class="appt-card">
      <div class="appt-card__date">
        <span class="appt-card__day">${r.day}</span>
        <span class="appt-card__month">${r.month}</span>
      </div>
      <div class="appt-card__divider" style="background:${r.color}"></div>
      <div class="appt-card__body">
        <p class="appt-card__title">${r.title}</p>
        <p class="appt-card__time">${r.time}</p>
      </div>
      ${showDelete ? `<button class="btn btn--ghost btn--sm" data-delete="${idx}" aria-label="Eliminar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6"/><path d="M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/></svg>
      </button>` : ''}
    </article>
  `;
}

function skillColor(name) {
  const map = { 'Comunicació': '#508bbf', 'Interacció social': '#9b59b6', 'Autonomia': '#00943a', 'Habilitats motrius': '#e67e22', 'Conducta emocional': '#e74c3c' };
  return map[name] || 'var(--color-accent)';
}

function todayStr() {
  const d = new Date();
  const months = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ══════════════════════════════════════════════════════════
   PAGE INITS
══════════════════════════════════════════════════════════ */

function initHome() {
  const s = State.load();
  const list = document.getElementById('home-reminder-list');
  if (list) list.innerHTML = s.reminders.slice(0, 3).map((r, i) => apptCardHTML(r, i)).join('') || '<p class="text-sm text-secondary">Cap recordatori pendent.</p>';
}

function initProgress() {
  const s = State.load();
  const list = document.getElementById('progress-areas');
  if (!list) return;
  list.innerHTML = Object.entries(s.skills).map(([name, skill]) => `
    <article class="area-card" data-skill="${name}" style="cursor:pointer">
      <div class="area-card__header">
        <span class="area-card__name">${name}</span>
        <span class="area-card__pct" style="color:${skillColor(name)}">${skill.pct}%</span>
      </div>
      <div class="progress-bar"><div class="progress-bar__fill" style="width:${skill.pct}%;background:${skillColor(name)}"></div></div>
      <div class="area-card__meta"><span class="area-card__meta-item">Darrera avaluació: 5 abr 2026</span></div>
    </article>
  `).join('');
  list.querySelectorAll('.area-card').forEach(card => {
    card.addEventListener('click', () => {
      const s2 = State.load();
      s2.assessment = { currentQ: 0, answers: [], area: card.dataset.skill };
      State.save(s2);
      goTo('assessment');
    });
  });
  document.getElementById('btn-full-assessment')?.addEventListener('click', () => {
    const s2 = State.load();
    s2.assessment = { currentQ: 0, answers: [], area: 'Comunicació' };
    State.save(s2);
    goTo('assessment');
  });
}

function initAssessment() { renderAssessmentQ(); }

function renderAssessmentQ() {
  const s = State.load();
  const { currentQ, answers } = s.assessment;
  const total = ASSESSMENT_QUESTIONS.length;
  const q = ASSESSMENT_QUESTIONS[currentQ];

  const stepsEl = document.getElementById('assessment-steps');
  if (stepsEl) stepsEl.innerHTML = ASSESSMENT_QUESTIONS.map((_, i) => `<div class="assessment-progress__step ${i < currentQ ? 'done' : i === currentQ ? 'active' : ''}"></div>`).join('');

  const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setEl('assessment-area', `Avalua la ${q.area}`);
  setEl('assessment-q-num', `Pregunta ${currentQ + 1} de ${total}`);
  setEl('assessment-q-text', q.q);

  const optionsEl = document.getElementById('assessment-options');
  if (optionsEl) {
    optionsEl.innerHTML = ASSESSMENT_OPTIONS.map((opt, i) => `
      <label class="radio-option ${answers[currentQ] === i ? 'selected' : ''}" data-opt="${i}">
        <span class="radio-option__main">${opt.label}</span>
        <span class="radio-option__sub">${opt.sub}</span>
      </label>
    `).join('');
    optionsEl.querySelectorAll('.radio-option').forEach(el => {
      el.addEventListener('click', () => {
        const s2 = State.load();
        s2.assessment.answers[s2.assessment.currentQ] = parseInt(el.dataset.opt);
        State.save(s2);
        renderAssessmentQ();
      });
    });
  }

  const prevBtn = document.getElementById('assessment-prev');
  const nextBtn = document.getElementById('assessment-next');
  if (prevBtn) {
    prevBtn.disabled = currentQ === 0;
    prevBtn.onclick = () => {
      const s2 = State.load();
      if (s2.assessment.currentQ > 0) { s2.assessment.currentQ--; State.save(s2); renderAssessmentQ(); }
    };
  }
  if (nextBtn) {
    const isLast = currentQ === total - 1;
    nextBtn.textContent = isLast ? 'Finalitzar' : 'Següent';
    nextBtn.onclick = () => {
      const s2 = State.load();
      if (s2.assessment.answers[s2.assessment.currentQ] === undefined) {
        document.querySelectorAll('.radio-option').forEach(o => { o.style.borderColor = 'var(--color-red)'; setTimeout(() => { o.style.borderColor = ''; }, 700); });
        return;
      }
      if (isLast) {
        const total2 = s2.assessment.answers.reduce((acc, a) => acc + ASSESSMENT_OPTIONS[a].value, 0);
        const pct = Math.min(100, Math.max(20, Math.round((total2 / (ASSESSMENT_QUESTIONS.length * 3)) * 100)));
        s2.skills[s2.assessment.area || 'Comunicació'].pct = pct;
        s2.results = { score: pct, area: s2.assessment.area || 'Comunicació' };
        State.save(s2);
        goTo('results');
      } else {
        s2.assessment.currentQ++;
        State.save(s2);
        renderAssessmentQ();
      }
    };
  }
}

function initResults() {
  const s = State.load();
  const { score, area } = s.results || { score: 72, area: 'Comunicació' };
  const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setEl('results-score', score + '%');
  setEl('results-area', area);
  setEl('results-rec', score >= 70 ? 'Excel·lent progrés! Continua amb les rutines actuals.' : score >= 50 ? `Parla amb el logopeda sobre ${area.toLowerCase()}.` : 'Es recomana consulta amb especialista aviat.');
  const subs = [
    { name: 'Comunicació verbal', val: Math.min(100, score + 8) },
    { name: 'Comm. no verbal', val: Math.max(20, score - 15) },
    { name: 'Iniciativa', val: Math.max(20, score - 22) },
    { name: 'Comprensió', val: Math.min(100, score + 14) },
  ];
  const subsEl = document.getElementById('results-subs');
  if (subsEl) subsEl.innerHTML = subs.map(sub => `
    <div class="flex items-center gap-12">
      <span class="text-sm text-secondary flex-1">${sub.name}</span>
      <div class="progress-bar flex-1" style="max-width:120px"><div class="progress-bar__fill" style="width:${sub.val}%"></div></div>
      <span class="text-sm fw-bold text-primary" style="min-width:32px;text-align:right">${sub.val}</span>
    </div>
  `).join('');
  document.getElementById('btn-results-done')?.addEventListener('click', () => goTo('progress'));
  document.getElementById('btn-results-back')?.addEventListener('click', () => {
    const s2 = State.load(); s2.assessment.currentQ = 0; s2.assessment.answers = []; State.save(s2); goTo('assessment');
  });
}

function initReminders() {
  renderReminderList();
  renderCalendar();
  document.getElementById('fab')?.addEventListener('click', () => goTo('reminder-add'));
}

function renderReminderList() {
  const s = State.load();
  const list = document.getElementById('reminders-list');
  if (!list) return;
  list.innerHTML = s.reminders.map((r, i) => apptCardHTML(r, i, true)).join('') || '<p class="text-sm text-secondary text-center mt-24">Cap recordatori afegit.</p>';
  list.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s2 = State.load();
      s2.reminders.splice(parseInt(btn.dataset.delete), 1);
      State.save(s2);
      renderReminderList();
    });
  });
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;
  const s = State.load();
  const eventDays = s.reminders.map(r => r.day);
  const days = ['Dl','Dt','Dc','Dj','Dv','Ds','Dg'];
  const cells = days.map(d => `<div class="mini-calendar__day header">${d}</div>`);
  for (let i = 0; i < 2; i++) cells.push('<div class="mini-calendar__day"></div>');
  for (let d = 1; d <= 30; d++) {
    const isToday = d === 14, hasEvent = eventDays.includes(d);
    cells.push(`<div class="mini-calendar__day ${isToday ? 'today' : ''} ${hasEvent && !isToday ? 'has-event' : ''}">${d}</div>`);
  }
  grid.innerHTML = cells.join('');
}

function initReminderAdd() {
  document.querySelectorAll('.reminder-type-btn').forEach(btn => {
    btn.addEventListener('click', () => { document.querySelectorAll('.reminder-type-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); });
  });
  document.querySelector('.reminder-type-btn')?.classList.add('selected');
  document.getElementById('btn-save-reminder')?.addEventListener('click', () => {
    const title = document.getElementById('reminder-title')?.value?.trim();
    const time = document.getElementById('reminder-time')?.value || '10:00';
    const type = document.querySelector('.reminder-type-btn.selected')?.dataset.type || 'Teràpia';
    if (!title) return;
    const colorMap = { 'Teràpia':'#508bbf','Cita mèdica':'#ffb100','Medicació':'#e74c3c','Escola':'#00943a' };
    const s = State.load();
    const day = (s.reminders.length + 14) % 28 + 1;
    s.reminders.push({ day, month: 'ABR', title, time: time + ' h', color: colorMap[type] || '#508bbf' });
    State.save(s);
    goTo('reminders');
  });
}

function initProfessionals() {
  const pros = [
    { initials: 'MP', name: 'Dra. Marta Puig', spec: 'Psicòloga especialista TEA', location: 'Barcelona · Presencial + Online', rating: 4.9, reviews: 127, color: '#508bbf' },
    { initials: 'MF', name: 'Marc Ferrer', spec: 'Logopeda · Comm. augmentativa', location: 'Gràcia, BCN · Presencial', rating: 4.8, reviews: 89, color: '#00943a' },
    { initials: 'LS', name: 'Laura Sánchez', spec: 'Terapeuta ocupacional', location: 'Sarrià, BCN · Presencial', rating: 4.7, reviews: 54, color: '#e67e22' },
    { initials: 'PB', name: 'Pau Bosch', spec: 'Psiquiatre infantil TEA', location: 'L\'Eixample · Online + Presencial', rating: 4.9, reviews: 203, color: '#9b59b6' },
  ];
  const list = document.getElementById('professionals-list');
  if (!list) return;
  list.innerHTML = pros.map(p => `
    <article class="pro-card" onclick="goTo('professional-detail')">
      <div class="avatar avatar--lg" style="background:${p.color}">${p.initials}</div>
      <div class="pro-card__body">
        <div class="pro-card__name">${p.name}</div>
        <div class="pro-card__spec">${p.spec}</div>
        <div class="pro-card__location">📍 ${p.location}</div>
        <div class="pro-card__rating mt-8"><span class="star">★</span>${p.rating} <span class="text-xs text-secondary">(${p.reviews} ressenyes)</span></div>
        <div class="pro-card__actions">
          <button class="btn btn--primary btn--sm" style="width:auto" onclick="event.stopPropagation();goTo('professional-detail')">Veure</button>
          <button class="btn btn--outline btn--sm" style="width:auto" onclick="event.stopPropagation()">Contactar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function initCommunity() {
  renderPosts();
  document.getElementById('fab')?.addEventListener('click', () => goTo('community-publish'));
  document.getElementById('btn-community-search')?.addEventListener('click', () => goTo('community-search'));
}

function renderPosts() {
  const s = State.load();
  const list = document.getElementById('community-posts');
  if (!list) return;
  const colors = ['#508bbf','#00943a','#9b59b6','#e67e22'];
  list.innerHTML = s.posts.map((post, i) => `
    <article class="post">
      <div class="post__header">
        <div class="avatar avatar--sm" style="background:${post.color || colors[i % colors.length]}">${post.initials}</div>
        <div class="post__meta"><div class="post__author">${post.author}</div><div class="post__time">${post.time}</div></div>
      </div>
      <p class="post__text">${post.text}</p>
      <div class="post__actions">
        <button class="post__action ${post.liked ? 'liked' : ''}" data-like="${i}">
          <svg viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${post.likes}
        </button>
        <button class="post__action" onclick="goTo('community-chat')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${post.replies} respostes
        </button>
      </div>
    </article>
  `).join('');
  list.querySelectorAll('[data-like]').forEach(btn => {
    btn.addEventListener('click', () => {
      const s2 = State.load();
      const idx = parseInt(btn.dataset.like);
      s2.posts[idx].liked = !s2.posts[idx].liked;
      s2.posts[idx].likes += s2.posts[idx].liked ? 1 : -1;
      State.save(s2);
      renderPosts();
    });
  });
}

function initCommunityChat() {
  renderChat();
  document.getElementById('btn-send-chat')?.addEventListener('click', sendChat);
  document.getElementById('chat-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
}

function renderChat() {
  const s = State.load();
  const list = document.getElementById('chat-messages');
  if (!list) return;
  list.innerHTML = s.chatMessages.map(m => `
    <div class="flex flex-col ${m.from === 'out' ? 'items-end' : 'items-start'} gap-4">
      ${m.from === 'in' && m.author ? `<span class="text-xs text-secondary" style="padding-left:4px">${m.author}</span>` : ''}
      <div class="chat-bubble chat-bubble--${m.from}">${m.text}<div class="chat-bubble__time">${m.time}</div></div>
    </div>
  `).join('');
  list.scrollTop = list.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  const s = State.load();
  s.chatMessages.push({ from: 'out', text, time });
  State.save(s);
  input.value = '';
  renderChat();
}

function initCommunityPublish() {
  const msgEl = document.getElementById('publish-msg');
  const countEl = document.getElementById('publish-char-count');
  msgEl?.addEventListener('input', () => { if (countEl) countEl.textContent = `${msgEl.value.length}/1000 caràcters`; });
  document.getElementById('btn-publish')?.addEventListener('click', () => {
    const title = document.getElementById('publish-title')?.value?.trim();
    const msg = msgEl?.value?.trim();
    if (!msg) return;
    const s = State.load();
    s.posts.unshift({ author: 'Ana Molina', initials: 'AM', time: 'ara', text: title ? `${title}: ${msg}` : msg, likes: 0, liked: false, replies: 0, color: '#023059' });
    State.save(s);
    goTo('community');
  });
}

function initSettings() {
  document.getElementById('btn-logout-settings')?.addEventListener('click', () => { State.reset(); goTo('welcome'); });
}

function initProfileView() {
  const s = State.load();
  const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  setEl('profile-child-name', s.profile.childName);
  setEl('profile-child-sub', `${s.profile.childAge} · ${s.profile.diagnosis}`);
  const avatarEl = document.getElementById('profile-child-avatar');
  if (avatarEl) avatarEl.textContent = s.profile.childName[0].toUpperCase();

  document.getElementById('tab-btn-info')?.addEventListener('click', () => renderProfileTab('info'));
  document.getElementById('tab-btn-diary')?.addEventListener('click', () => renderProfileTab('diary'));
  document.getElementById('tab-btn-skills')?.addEventListener('click', () => renderProfileTab('skills'));
  renderProfileTab('info');
}

function renderProfileTab(tab) {
  const s = State.load();
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-btn-${tab}`)?.classList.add('active');
  ['info','diary','skills'].forEach(p => { const el = document.getElementById(`profile-tab-${p}`); if (el) el.classList.add('hidden'); });
  const active = document.getElementById(`profile-tab-${tab}`);
  if (!active) return;
  active.classList.remove('hidden');

  if (tab === 'info') {
    active.innerHTML = `
      <div class="flex flex-col gap-12">
        <div class="flex justify-between items-center">
          <h2 class="section-title mb-0">Informació bàsica</h2>
          <button class="btn btn--outline btn--sm" style="width:auto" onclick="goTo('profile-edit')">Editar</button>
        </div>
        <div class="info-row"><span class="info-row__key">Nom</span><span class="info-row__val">${s.profile.childName}</span></div>
        <div class="info-row"><span class="info-row__key">Edat</span><span class="info-row__val">${s.profile.childAge}</span></div>
        <div class="info-row"><span class="info-row__key">Diagnòstic</span><span class="info-row__val">${s.profile.diagnosis}</span></div>
        <div class="info-row"><span class="info-row__key">Necessitats</span><span class="info-row__val">${s.profile.needs.join(', ')}</span></div>
        <button class="btn btn--primary mt-8" onclick="goTo('report-gen')">Generar informe</button>
      </div>`;
  } else if (tab === 'diary') {
    active.innerHTML = `
      <div class="flex flex-col gap-12">
        <div class="flex justify-between items-center">
          <h2 class="section-title mb-0">Diari d'observacions</h2>
          <button class="btn btn--primary btn--sm" style="width:auto" onclick="goTo('profile-note')">+ Afegir</button>
        </div>
        ${s.diary.map(e => `
          <div class="diary-entry diary-entry--${e.type}">
            <span class="diary-entry__date">${e.date}</span>
            <p class="diary-entry__text">${e.text}</p>
            <span class="diary-entry__type tag tag--${e.type === 'achievement' ? 'green' : e.type === 'difficulty' ? 'blue' : 'yellow'}">${e.typeLabel}</span>
          </div>`).join('')}
      </div>`;
  } else if (tab === 'skills') {
    active.innerHTML = `
      <div class="flex flex-col gap-12">
        <h2 class="section-title mb-0">Àrees de seguiment</h2>
        <p class="text-sm text-secondary">Toca l'apartat que vulguis editar</p>
        ${Object.entries(s.skills).map(([name, skill]) => `
          <div class="skill-row" data-skill="${name}">
            <div class="skill-row__header"><span class="skill-row__name">${name}</span><span class="skill-row__pct">${skill.pct}%</span></div>
            <div class="progress-bar"><div class="progress-bar__fill" style="width:${skill.pct}%"></div></div>
          </div>`).join('')}
      </div>`;
    active.querySelectorAll('.skill-row[data-skill]').forEach(row => {
      row.addEventListener('click', () => {
        const s2 = State.load(); s2.editingSkill = row.dataset.skill; State.save(s2); goTo('profile-skill');
      });
    });
  }
}

function initProfileEdit() {
  const s = State.load();
  const nameEl = document.getElementById('edit-name');
  if (nameEl) nameEl.value = s.profile.childName;
  document.getElementById('btn-save-profile')?.addEventListener('click', () => {
    const s2 = State.load();
    const name = document.getElementById('edit-name')?.value?.trim();
    if (name) s2.profile.childName = name;
    State.save(s2);
    goTo('profile-view');
  });
  document.getElementById('btn-delete-profile')?.addEventListener('click', () => {
    if (confirm('Segur que vols eliminar el perfil?')) { State.reset(); goTo('welcome'); }
  });
}

function initProfileNote() {
  document.querySelectorAll('.note-type-btn').forEach(btn => {
    btn.addEventListener('click', () => { document.querySelectorAll('.note-type-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); });
  });
  document.querySelector('.note-type-btn')?.classList.add('selected');
  const textarea = document.getElementById('note-text');
  const charCount = document.getElementById('note-char-count');
  textarea?.addEventListener('input', () => { if (charCount) charCount.textContent = `${textarea.value.length}/500 caràcters`; });
  document.getElementById('btn-save-note')?.addEventListener('click', () => {
    const type = document.querySelector('.note-type-btn.selected')?.dataset.type || 'note';
    const text = textarea?.value?.trim();
    if (!text) return;
    const typeMap = { achievement: 'Assoliment', difficulty: 'Dificultat', change: 'Canvi', note: 'Nota' };
    const s = State.load();
    s.diary.unshift({ date: todayStr(), text, type, typeLabel: typeMap[type] });
    State.save(s);
    goTo('profile-view');
  });
  document.getElementById('btn-cancel-note')?.addEventListener('click', goBack);
}

function initProfileSkill() {
  const s = State.load();
  const skillName = s.editingSkill;
  const titleEl = document.getElementById('skill-editor-title');
  if (titleEl) titleEl.textContent = skillName;
  renderSkillLevels(skillName);
  document.getElementById('btn-save-skill')?.addEventListener('click', () => goTo('profile-view'));
}

function renderSkillLevels(skillName) {
  const s = State.load();
  const skill = s.skills[skillName] || { pct: 50 };
  const currentLvl = Math.min(4, Math.floor((skill.pct - 1) / 20));
  const levels = [
    { label: 'Necessita suport constant', pct: '0–20%', lvl: 0, value: 10 },
    { label: 'Suport freqüent', pct: '21–40%', lvl: 1, value: 30 },
    { label: 'Suport moderat', pct: '41–60%', lvl: 2, value: 50 },
    { label: 'Suport ocasional', pct: '61–80%', lvl: 3, value: 70 },
    { label: 'Molt autònom/a', pct: '81–100%', lvl: 4, value: 90 },
  ];
  const listEl = document.getElementById('skill-editor-list');
  if (!listEl) return;
  listEl.innerHTML = levels.map(l => `
    <div class="skill-level-item ${l.lvl === currentLvl ? 'active' : ''}" data-lvl="${l.lvl}" data-value="${l.value}">
      <div class="skill-level-item__dot"></div>
      <div class="skill-level-item__body">
        <div class="skill-level-item__label">${l.label}</div>
        <div class="skill-level-item__pct">${l.pct}</div>
      </div>
    </div>`).join('');
  listEl.querySelectorAll('.skill-level-item').forEach(item => {
    item.addEventListener('click', () => {
      const s2 = State.load();
      s2.skills[skillName].pct = parseInt(item.dataset.value);
      s2.skills[skillName].level = parseInt(item.dataset.lvl);
      State.save(s2);
      renderSkillLevels(skillName);
    });
  });
}

function initReportGen() {
  document.getElementById('btn-generate-report')?.addEventListener('click', () => goTo('report-done'));
}

/* ══════════════════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => { document.body.style.transition = 'opacity 0.15s ease'; document.body.style.opacity = '1'; });

  const currentPage = document.body.dataset.page;
  if (!currentPage) return;

  if (typeof renderShell === 'function') renderShell(currentPage);

  document.querySelectorAll('[data-action="back"]').forEach(btn => btn.addEventListener('click', goBack));

  const authMap = {
    'btn-go-login':        () => goTo('login'),
    'btn-go-register':     () => goTo('register'),
    'btn-login':           () => { const s = State.load(); s.authenticated = true; State.save(s); goTo('home'); },
    'btn-google-login':    () => { const s = State.load(); s.authenticated = true; State.save(s); goTo('home'); },
    'btn-register-submit': () => goTo('onboard-child'),
    'btn-onboard-child':   () => goTo('onboard-diagnosis'),
    'btn-onboard-diag':    () => { const s = State.load(); s.authenticated = true; State.save(s); goTo('onboard-done'); },
    'btn-explore':         () => goTo('home'),
    'link-to-register':    () => goTo('register'),
    'link-to-login':       () => goTo('login'),
  };
  for (const [id, fn] of Object.entries(authMap)) document.getElementById(id)?.addEventListener('click', fn);

  const PAGE_INITS = {
    'home': initHome, 'progress': initProgress, 'assessment': initAssessment,
    'results': initResults, 'reminders': initReminders, 'reminder-add': initReminderAdd,
    'professionals': initProfessionals, 'community': initCommunity,
    'community-chat': initCommunityChat, 'community-publish': initCommunityPublish,
    'settings': initSettings, 'profile-view': initProfileView,
    'profile-edit': initProfileEdit, 'profile-note': initProfileNote,
    'profile-skill': initProfileSkill, 'report-gen': initReportGen,
  };
  PAGE_INITS[currentPage]?.();

  document.querySelectorAll('.diagnosis-chip').forEach(chip => {
    chip.addEventListener('click', () => { document.querySelectorAll('.diagnosis-chip').forEach(c => c.classList.remove('selected')); chip.classList.add('selected'); });
  });
  document.querySelectorAll('.needs-chip').forEach(chip => chip.addEventListener('click', () => chip.classList.toggle('selected')));
  document.querySelectorAll('.gender-chip').forEach(chip => {
    chip.addEventListener('click', () => { document.querySelectorAll('.gender-chip').forEach(c => c.classList.remove('selected')); chip.classList.add('selected'); });
  });
  document.querySelectorAll('.group-card').forEach(card => card.addEventListener('click', () => goTo('community-chat')));
});
