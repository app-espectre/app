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
 'community-post':       'community-post.html',
 'settings':             'settings.html',
 'profile-settings':     'profile-settings.html',
 'profile-edit':         'profile-edit.html',
 'profile-view':         'profile-view.html',
 'profile-note':         'profile-note.html',
};

/* Funció per obtenir el HTML de l'avatar amb imatge */
function getAvatarHTML(authorName, index = 0) {
  const s = State.load();
  // Si l'autor és l'Ana Molina o l'usuari principal
  if (authorName === 'Ana Molina' || authorName === s.profile.parentName) {
    return `<div class="avatar avatar--sm" style="background-image: url('../img/ana.jpg'); background-size: cover; background-position: center; color: transparent;"></div>`;
  }
  
  // Per a la resta, alternem entre pare1 i pare6
  const imgNum = (index % 6) + 1;
  const imgPath = `../img/pare${imgNum}.jpg`;
  
  return `<div class="avatar avatar--sm" style="background-image: url('${imgPath}'); background-size: cover; background-position: center; color: transparent;"></div>`;
}


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
     ${showDelete ? `<button class="btn btn--transparent btn--sm btn--delete" data-delete="${idx}" aria-label="Eliminar">
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6"/><path d="M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/></svg>
     </button>` : ''}
   </article>
 `;
}


function skillColor(name) {
 const map = { 'Comunicació': '#508bbf', 'Interacció social': '#508bbf', 'Autonomia': '#508bbf', 'Habilitats motrius': '#508bbf', 'Conducta emocional': '#508bbf' };
 return map[name] || 'var(--color-accent)';
}


function todayStr() {
 const d = new Date();
 const months = ['gen','feb','mar','abr','mai','jun','jul','ago','set','oct','nov','des'];
 return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}


function renderRadarChart(container, data, opts = {}) {
 if (!container || !data || data.length === 0) return;
 const width = opts.width || 360;
 const height = opts.height || 360;
 const padding = opts.padding || 24;
 const levels = opts.levels || 4;
 const maxValue = opts.maxValue || 100;
 const centerX = width / 2;
 const centerY = height / 2;
 const radius = Math.min(width, height) / 2 - padding;
 const angleStep = (Math.PI * 2) / data.length;


 container.innerHTML = '';
 const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
 svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
 svg.classList.add('radar-chart__svg');


 // Grid rings
 for (let level = levels; level >= 1; level--) {
   const levelRadius = (radius * level) / levels;
   const points = data.map((_, i) => {
     const angle = -Math.PI / 2 + angleStep * i;
     return `${centerX + Math.cos(angle) * levelRadius},${centerY + Math.sin(angle) * levelRadius}`;
   }).join(' ');
   const ring = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
   ring.setAttribute('points', points);
   ring.setAttribute('class', 'radar-chart__grid-line');
   ring.setAttribute('fill', 'none');
   svg.appendChild(ring);
 }


 // Axes
 data.forEach((item, i) => {
   const angle = -Math.PI / 2 + angleStep * i;
   const x = centerX + Math.cos(angle) * radius;
   const y = centerY + Math.sin(angle) * radius;
   const axis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
   axis.setAttribute('x1', centerX);
   axis.setAttribute('y1', centerY);
   axis.setAttribute('x2', x);
   axis.setAttribute('y2', y);
   axis.setAttribute('class', 'radar-chart__axis');
   svg.appendChild(axis);
 });


 // Data polygon
 const dataPoints = data.map((point, i) => {
   const ratio = Math.max(0, Math.min(1, point.value / maxValue));
   const angle = -Math.PI / 2 + angleStep * i;
   return {
     x: centerX + Math.cos(angle) * radius * ratio,
     y: centerY + Math.sin(angle) * radius * ratio,
     label: point.label,
     value: point.value,
     angle,
   };
 });
 const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
 polygon.setAttribute('points', dataPoints.map(p => `${p.x},${p.y}`).join(' '));
 polygon.setAttribute('class', 'radar-chart__area');
 svg.appendChild(polygon);


 dataPoints.forEach(point => {
   const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
   dot.setAttribute('cx', point.x);
   dot.setAttribute('cy', point.y);
   dot.setAttribute('r', 4);
   dot.setAttribute('class', 'radar-chart__point');
   svg.appendChild(dot);
 });


 dataPoints.forEach(point => {
   const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
   const offset = 14;
   const labelX = point.x + (Math.cos(point.angle) * offset);
   const labelY = point.y + (Math.sin(point.angle) * offset);
   label.setAttribute('x', labelX);
   label.setAttribute('y', labelY);
   label.setAttribute('class', 'radar-chart__label');
   label.setAttribute('text-anchor', Math.cos(point.angle) > 0.2 ? 'start' : Math.cos(point.angle) < -0.2 ? 'end' : 'middle');
   const firstSpace = point.label.indexOf(' ');
   if (firstSpace >= 0) {
     const firstPart = point.label.slice(0, firstSpace);
     const secondPart = point.label.slice(firstSpace + 1);
     const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
     tspan1.setAttribute('x', labelX);
     tspan1.setAttribute('dy', '0');
     tspan1.textContent = firstPart;
     const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
     tspan2.setAttribute('x', labelX);
     tspan2.setAttribute('dy', '16');
     tspan2.textContent = secondPart;
     label.appendChild(tspan1);
     label.appendChild(tspan2);
   } else {
     label.textContent = point.label;
   }
   svg.appendChild(label);
 });


 container.appendChild(svg);
}


/* ══════════════════════════════════════════════════════════
  TIMELINE SLIDER
══════════════════════════════════════════════════════════ */


function formatDateShort(dateStr) {
 const months = ['gen', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'des'];
 const parts = dateStr.split(' ');
 const day = parts[0];
 const monthText = parts[2];
 const year = parts[4];
 const monthIdx = months.findIndex(m => monthText.toLowerCase().includes(m));
 const monthAbbr = monthIdx >= 0 ? months[monthIdx] : monthText;
 return `${day} ${monthAbbr} ${year}`;
}


function renderTimelineSlider(state) {
 const radarChart = document.getElementById('radar-chart');
 const btnFullAssessment = document.getElementById('btn-full-assessment');
  if (!btnFullAssessment || !radarChart || !state.historialEvaluaciones || state.historialEvaluaciones.length === 0) return;


 const maxIdx = state.historialEvaluaciones.length - 1;
 const currentIdx = state.selectedEvaluationIndex || maxIdx;
 const currentEval = state.historialEvaluaciones[currentIdx];


 // Crear contenedor del slider si no existe
 let sliderContainer = document.getElementById('timeline-slider-container');
 if (!sliderContainer) {
   sliderContainer = document.createElement('div');
   sliderContainer.id = 'timeline-slider-container';
   sliderContainer.className = 'timeline-slider-container mb-12';
   btnFullAssessment.insertAdjacentElement('beforebegin', sliderContainer);
 }


 // Renderizar el contenido del slider (solo input + fecha)
 sliderContainer.innerHTML = `
   <span class="timeline-slider__date" id="timeline-date">${formatDateShort(currentEval?.fecha || 'Sense data')}</span>
   <input
     type="range"
     id="timeline-range"
     class="timeline-slider__input"
     min="0"
     max="${maxIdx}"
     value="${currentIdx}"
     aria-label="Selector de línea de tiempo"
   >
 `;


 // Evento del slider
 const rangeInput = document.getElementById('timeline-range');
 const dateDisplay = document.getElementById('timeline-date');


 rangeInput.addEventListener('input', (e) => {
   const idx = parseInt(e.target.value, 10);
   const selectedEval = state.historialEvaluaciones[idx];


   // Actualizar estado
   state.selectedEvaluationIndex = idx;
   State.save(state);


   // Actualizar la fecha mostrada
   dateDisplay.textContent = formatDateShort(selectedEval?.fecha || 'Sense data');


   // Actualizar el gráfico de radar con animación suave
   const skillsArray = Object.entries(selectedEval.datos).map(([name, skill]) => ({
     label: name,
     value: skill.pct
   }));
  
   // Animar el en cambio (fade effect)
   radarChart.style.opacity = '0.5';
   radarChart.style.transition = 'opacity 200ms ease';
  
   setTimeout(() => {
     renderRadarChart(radarChart, skillsArray);
     radarChart.style.opacity = '1';
   }, 100);


   // Actualizar las tarjetas de áreas de progreso
   const progressList = document.getElementById('progress-areas');
   progressList.innerHTML = Object.entries(selectedEval.datos).map(([name, skill]) => `
     <article class="area-card" data-skill="${name}" style="cursor:pointer">
       <div class="area-card__header">
         <span class="area-card__name">${name}</span>
         <span class="area-card__pct" style="color:${skillColor(name)}">${skill.pct}%</span>
       </div>
       <div class="progress-bar"><div class="progress-bar__fill" style="width:${skill.pct}%;background:${skillColor(name)}"></div></div>
       <div class="area-card__meta"><span class="area-card__meta-item">Avaluació a data: ${selectedEval?.fecha}</span></div>
     </article>
   `).join('');


   // Reattach event listeners to new cards
   progressList.querySelectorAll('.area-card').forEach(card => {
     card.addEventListener('click', () => {
       const s2 = State.load();
       s2.assessment = { currentQ: 0, answers: [], area: card.dataset.skill };
       State.save(s2);
       goTo('assessment');
     });
   });
 });
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
 const radarTarget = document.getElementById('radar-chart');
 const list = document.getElementById('progress-areas');
  if (!list) return;


 // Obtener el índice de la evaluación seleccionada
 const selectedIdx = s.selectedEvaluationIndex || (s.historialEvaluaciones?.length - 1) || 0;
 const evaluacionActual = s.historialEvaluaciones?.[selectedIdx];
 const datosActuales = evaluacionActual?.datos || s.skills;


 // Renderizar el gráfico de radar con los datos actuales
 const skillsArray = Object.entries(datosActuales).map(([name, skill]) => ({
   label: name,
   value: skill.pct
 }));
  renderRadarChart(radarTarget, skillsArray);


 // Renderizar las tarjetas de áreas
 list.innerHTML = Object.entries(datosActuales).map(([name, skill]) => `
   <article class="area-card" data-skill="${name}" style="cursor:pointer">
     <div class="area-card__header">
       <span class="area-card__name">${name}</span>
       <span class="area-card__pct" style="color:${skillColor(name)}">${skill.pct}%</span>
     </div>
     <div class="progress-bar"><div class="progress-bar__fill" style="width:${skill.pct}%;background:${skillColor(name)}"></div></div>
     <div class="area-card__meta"><span class="area-card__meta-item">Avaluació a data: ${evaluacionActual?.fecha || '5 abr 2026'}</span></div>
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


 // Renderizar el slider de línea de tiempo
 renderTimelineSlider(s);


 document.getElementById('btn-full-assessment')?.addEventListener('click', () => {
   const s2 = State.load();
   s2.assessment = { currentQ: 0, answers: [], area: 'Comunicació' };
   State.save(s2);
   goTo('assessment');
 });
}


function initInfo() {
 const input = document.querySelector('.search-bar input');
 const items = Array.from(document.querySelectorAll('.article-item'));
 if (!input || !items.length) return;


 // small no-results message element we'll append when needed
 const noMsg = document.createElement('p');
 noMsg.className = 'text-sm text-secondary mt-12';
 noMsg.textContent = 'Cap resultat.';
 let appended = false;


 const applyFilter = () => {
   const q = input.value.trim().toLowerCase();
   let visible = 0;
   items.forEach(it => {
     const tEl = it.querySelector('.article-item__text');
     const txt = tEl ? tEl.textContent.trim().toLowerCase() : it.textContent.trim().toLowerCase();
     if (!q || txt.includes(q)) { it.style.display = ''; visible++; }
     else it.style.display = 'none';
   });
   if (visible === 0 && !appended) {
     const container = document.querySelector('.page-scroll');
     container && container.appendChild(noMsg);
     appended = true;
   } else if (visible > 0 && appended) {
     noMsg.remove();
     appended = false;
   }
 };


 input.addEventListener('input', applyFilter);
 input.addEventListener('keydown', e => { if (e.key === 'Escape') { input.value = ''; applyFilter(); input.blur(); } });
  // Make each article-item open the external resource in a new tab and be keyboard accessible
 const targetUrl = 'https://www.sjdhospitalbarcelona.org/ca/patologies-tractaments/trastorns-lespectre-autista-tea';
 items.forEach(it => {
   // ensure accessible focusable
   if (!it.hasAttribute('tabindex')) it.setAttribute('tabindex', '0');
   it.setAttribute('role', 'link');
   it.addEventListener('click', (e) => {
     // if the click originated from a control that should stop propagation, respect it
     if (e.defaultPrevented) return;
     window.open(targetUrl, '_blank', 'noopener');
   });
   it.addEventListener('keydown', (e) => {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       window.open(targetUrl, '_blank', 'noopener');
     }
   });
 });
}


function initAssessment() { renderAssessmentQ(); }


function renderAssessmentQ() {
 const s = State.load();
 const { currentQ, answers } = s.assessment;
 const total = ASSESSMENT_QUESTIONS.length;
 const q = ASSESSMENT_QUESTIONS[currentQ];


 const stepsEl = document.getElementById('assessment-steps');
 if (stepsEl) {
   const percentage = ((currentQ + 1) / total) * 100;
   stepsEl.style.width = percentage + '%';
 }


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
   prevBtn.disabled = false;
   prevBtn.onclick = () => {
     const s2 = State.load();
     if (s2.assessment.currentQ > 0) {
       s2.assessment.currentQ--;
       State.save(s2);
       renderAssessmentQ();
     } else {
       goTo('progress');
     }
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
 let selectedDate = new Date();
 const prevBtn = document.querySelector('.mini-calendar__header [data-action="prev"]');
 const nextBtn = document.querySelector('.mini-calendar__header [data-action="next"]');


 const refresh = () => {
   renderReminderList(selectedDate);
   renderCalendar(selectedDate);
 };


 prevBtn?.addEventListener('click', () => {
   selectedDate.setMonth(selectedDate.getMonth() - 1);
   refresh();
 });


 nextBtn?.addEventListener('click', () => {
   selectedDate.setMonth(selectedDate.getMonth() + 1);
   refresh();
 });


 refresh();
 document.getElementById('fab')?.addEventListener('click', () => goTo('reminder-add'));
}


function renderReminderList(displayDate = new Date()) {
 const s = State.load();
 const list = document.getElementById('reminders-list');
 if (!list) return;
 list.innerHTML = s.reminders.map((r, i) => apptCardHTML(r, i, true)).join('') || '<p class="text-sm text-secondary text-center mt-24">Cap recordatori afegit.</p>';
 list.querySelectorAll('[data-delete]').forEach(btn => {
   btn.addEventListener('click', () => {
     const s2 = State.load();
     s2.reminders.splice(parseInt(btn.dataset.delete), 1);
     State.save(s2);
     renderReminderList(displayDate);
     renderCalendar(displayDate);
   });
 });
}


function renderCalendar(displayDate = new Date()) {
 const titleEl = document.querySelector('.mini-calendar__title');
 const grid = document.getElementById('calendar-grid');
 if (!grid || !titleEl) return;
 const s = State.load();
 const now = new Date();
 const year = displayDate.getFullYear();
 const month = displayDate.getMonth();


 const monthNames = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
 titleEl.textContent = `${monthNames[month]} ${year}`;


 const reminderMonthIndex = (abbr) => {
   const map = { GEN:0, FEB:1, MAR:2, ABR:3, MAI:4, JUN:5, JUL:6, AGO:7, SET:8, OCT:9, NOV:10, DES:11 };
   return map[String(abbr).toUpperCase()] ?? -1;
 };


 const currentMonthReminders = s.reminders
   .filter(r => reminderMonthIndex(r.month) === month)
   .reduce((acc, r) => {
     const day = Number(r.day);
     if (!acc[day]) acc[day] = [];
     acc[day].push(r);
     return acc;
   }, {});


 const days = ['Dl','Dt','Dc','Dj','Dv','Ds','Dg'];
 const cells = days.map(d => `<div class="mini-calendar__day header">${d}</div>`);


 const firstWeekday = new Date(year, month, 1).getDay();
 const offset = (firstWeekday + 6) % 7;
 for (let i = 0; i < offset; i++) cells.push('<div class="mini-calendar__day"></div>');


 const daysInMonth = new Date(year, month + 1, 0).getDate();
 for (let d = 1; d <= daysInMonth; d++) {
   const isToday = year === now.getFullYear() && month === now.getMonth() && d === now.getDate();
   const remindersForDay = currentMonthReminders[d] || [];
   const hasEvent = remindersForDay.length > 0;
   const eventColor = hasEvent ? remindersForDay[0].color : '';
   const classes = ['mini-calendar__day'];
   if (isToday) classes.push('today');
   if (hasEvent) classes.push('has-event');
   cells.push(`<div class="${classes.join(' ')}" style="${eventColor ? `--event-color:${eventColor};` : ''}">${d}</div>`);
 }


 grid.innerHTML = cells.join('');
}


function initReminderAdd() {
 document.querySelectorAll('.reminder-type-btn').forEach(btn => {
   btn.addEventListener('click', () => { document.querySelectorAll('.reminder-type-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); });
 });
 document.querySelector('.reminder-type-btn')?.classList.add('selected');
  // Set today's date as default
 const datePicker = document.getElementById('edit-reminder-date');
 if (datePicker) {
   const today = new Date();
   const year = today.getFullYear();
   const month = String(today.getMonth() + 1).padStart(2, '0');
   const day = String(today.getDate()).padStart(2, '0');
   datePicker.value = `${year}-${month}-${day}`;
 }
  document.getElementById('btn-save-reminder')?.addEventListener('click', () => {
   const title = document.getElementById('reminder-title')?.value?.trim();
   const time = document.getElementById('reminder-time')?.value || '10:00';
   const type = document.querySelector('.reminder-type-btn.selected')?.dataset.type || 'Teràpia';
   const dateStr = document.getElementById('edit-reminder-date')?.value;
  
   if (!title || !dateStr) return;
  
   // Parse the date
   const date = new Date(dateStr);
   const day = date.getDate();
   const monthIndex = date.getMonth();
   const monthMap = ['GEN', 'FEB', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DES'];
   const month = monthMap[monthIndex];
  
   const colorMap = { 'Teràpia':'#508bbf','Cita mèdica':'#ffb100','Medicació':'#e74c3c','Escola':'#00943a' };
   const s = State.load();
   s.reminders.push({ day, month, title, time: time + ' h', color: colorMap[type] || '#508bbf' });
   State.save(s);
   goTo('reminders');
 });
}


function initProfessionals() {
 const pros = [
   { initials: 'MP', name: 'Dra. Marta Puig', spec: 'Psicòloga especialista TEA', location: 'Barcelona · Presencial + Online', rating: 4.9, reviews: 227, color: '#508bbf', tipo: 'Psicòleg/a', zona: 'BCN', modalitat: ['Presencial', 'Online'] },
   { initials: 'MF', name: 'Marc Ferrer', spec: 'Logopeda · Comm. augmentativa', location: 'Gràcia, BCN · Presencial', rating: 4.8, reviews: 189, color: '#508bbf', tipo: 'Logopeda', zona: 'Gràcia', modalitat: ['Presencial'] },
   { initials: 'LS', name: 'Laura Sánchez', spec: 'Terapeuta ocupacional', location: 'Sarrià, BCN · Presencial', rating: 4.7, reviews: 117, color: '#508bbf', tipo: 'Terapeuta ocupacional', zona: 'Sarrià', modalitat: ['Presencial'] },
   { initials: 'PB', name: 'Pau Bosch', spec: 'Psiquiatre infantil TEA', location: 'L\'Eixample · Online + Presencial', rating: 4.9, reviews: 203, color: '#508bbf', tipo: 'Psicòleg/a', zona: 'BCN', modalitat: ['Online', 'Presencial'] },
 ];
 const list = document.getElementById('professionals-list');
 if (!list) return;
 list.innerHTML = pros.map((p, idx) => `
   <article class="pro-card" data-pro-index="${idx}">
     <div class="avatar avatar--lg" style="background-image:url('../img/professional${idx + 1}.jpg'); background-size:cover; background-position:center; background-repeat:no-repeat; color:transparent;">
       ${p.initials}
     </div>
     <div class="pro-card__body">
       <div class="pro-card__name">${p.name}</div>
       <div class="pro-card__spec">${p.spec}</div>
       <div class="pro-card__location">📍 ${p.location}</div>
       <div class="pro-card__meta mt-8">
         <div class="pro-card__rating">
           <span class="star">★</span>
           <span class="pro-card__rating-value">${p.rating}</span>
           <span class="text-xs text-secondary pro-card__reviews">(${p.reviews} ressenyes)</span>
         </div>
         <div class="pro-card__actions"></div>
       </div>
     </div>
   </article>
 `).join('');


 // Wire the search-bar and filter-chips to filter professionals in real time
 const searchInput = document.querySelector('.search-bar input');
 const typeSelect = document.querySelector('.filter-chip:nth-child(1) select');
 const zoneSelect = document.querySelector('.filter-chip:nth-child(2) select');
 const modeSelect = document.querySelector('.filter-chip:nth-child(3) select');
 const cards = Array.from(list.querySelectorAll('.pro-card'));
 const noMsg = document.createElement('p');
 noMsg.className = 'text-sm text-secondary mt-12';
 noMsg.textContent = 'Cap professional trobat.';
 let appended = false;


 const applyFilter = () => {
   const q = (searchInput?.value || '').trim().toLowerCase();
   const selectedType = (typeSelect?.value || 'Tots').trim();
   const selectedZone = (zoneSelect?.value || 'Tots').trim();
   const selectedMode = (modeSelect?.value || 'Tots').trim();
  
   let visible = 0;
   cards.forEach((card, idx) => {
     const pro = pros[idx];
     const name = card.querySelector('.pro-card__name')?.textContent.trim().toLowerCase() || '';
     const spec = card.querySelector('.pro-card__spec')?.textContent.trim().toLowerCase() || '';
     const loc = card.querySelector('.pro-card__location')?.textContent.trim().toLowerCase() || '';
    
     // Check search filter
     const matchSearch = !q || name.includes(q) || spec.includes(q) || loc.includes(q);
    
     // Check type filter
     const matchType = selectedType === 'Tots' || pro.tipo === selectedType;
    
     // Check zone filter
     const matchZone = selectedZone === 'Tots' || pro.zona === selectedZone;
    
     // Check mode filter
     const matchMode = selectedMode === 'Tots' || pro.modalitat.includes(selectedMode);
    
     if (matchSearch && matchType && matchZone && matchMode) {
       card.style.display = '';
       visible++;
     } else {
       card.style.display = 'none';
     }
   });
  
   if (visible === 0 && !appended) {
     list.appendChild(noMsg);
     appended = true;
   } else if (visible > 0 && appended) {
     noMsg.remove();
     appended = false;
   }
 };


 if (searchInput) {
   searchInput.addEventListener('input', applyFilter);
   searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { searchInput.value = ''; applyFilter(); searchInput.blur(); } });
 }


 // Wire filter-chip selects to trigger filtering
 [typeSelect, zoneSelect, modeSelect].forEach(sel => {
   if (sel) {
     sel.addEventListener('change', applyFilter);
   }
 });


 cards.forEach(card => {
   card.style.cursor = 'pointer';
   card.setAttribute('tabindex', '0');
   card.addEventListener('click', () => goTo('professional-detail'));
   card.addEventListener('keydown', e => {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       goTo('professional-detail');
     }
   });
 });
  // Autosize filter-chip selects so the chip width matches the selected option text.
 const autosizeSelect = (sel) => {
   if (!sel) return;
   const span = document.createElement('span');
   span.style.position = 'absolute';
   span.style.visibility = 'hidden';
   span.style.whiteSpace = 'nowrap';
   // inherit font styles from the select
   const cs = window.getComputedStyle(sel);
   span.style.font = cs.font || `${cs.fontSize} ${cs.fontFamily}`;
   span.textContent = sel.options[sel.selectedIndex]?.text || sel.value || '';
   document.body.appendChild(span);
   const w = Math.ceil(span.getBoundingClientRect().width);
   document.body.removeChild(span);
   // add some padding space to account for arrow and breathing room
   sel.style.width = (w + 34) + 'px';
 };


 // Find selects inside filter-chip and wire change event
 const chipSelects = Array.from(document.querySelectorAll('.filter-chip select'));
 chipSelects.forEach(s => {
   autosizeSelect(s);
   s.addEventListener('change', () => autosizeSelect(s));
   // also handle when options might change dynamically
   s.addEventListener('keyup', () => autosizeSelect(s));
 });
}


function initCommunity() {
 renderPosts();
 document.getElementById('fab')?.addEventListener('click', () => goTo('community-publish'));


 // Make the search-bar in community.html functional: it filters both recent discussions and groups.
 const searchInput = document.querySelector('#page-community .search-bar input');
 const postsContainer = document.getElementById('community-posts');
 // collect group-card elements directly (more robust than selecting a parent container)
 const groupCards = Array.from(document.querySelectorAll('#page-community .group-card'));


 const pageScroll = document.querySelector('#page-community .page-scroll');
 const noMsg = document.createElement('p');
 noMsg.className = 'text-sm text-secondary mt-12';
 noMsg.textContent = 'Cap resultat.';


 const applyFilter = () => {
   const q = (searchInput?.value || '').trim().toLowerCase();
   let visiblePosts = 0;
   let visibleGroups = 0;


   if (postsContainer) {
     const posts = Array.from(postsContainer.querySelectorAll('.post'));
     posts.forEach(p => {
       const author = p.querySelector('.post__author')?.textContent || '';
       const text = p.querySelector('.post__text')?.textContent || '';
       const meta = `${author} ${text}`.toLowerCase();
       if (!q || meta.includes(q)) { p.style.display = ''; visiblePosts++; }
       else p.style.display = 'none';
     });
   }


   if (groupCards && groupCards.length) {
     groupCards.forEach(g => {
       const name = g.querySelector('.group-card__name')?.textContent || '';
       const preview = g.querySelector('.group-card__preview')?.textContent || '';
       const members = g.querySelector('.group-card__members')?.textContent || '';
       const txt = `${name} ${preview} ${members}`.toLowerCase();
       if (!q || txt.includes(q)) { g.style.display = ''; visibleGroups++; }
       else g.style.display = 'none';
     });
   }


   // show no-results message if nothing visible
   const anyVisible = (visiblePosts + visibleGroups) > 0;
   if (!anyVisible && pageScroll && !pageScroll.contains(noMsg)) pageScroll.appendChild(noMsg);
   if (anyVisible && pageScroll && pageScroll.contains(noMsg)) noMsg.remove();
 };


 if (searchInput) {
   searchInput.addEventListener('input', applyFilter);
   searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { searchInput.value = ''; applyFilter(); searchInput.blur(); } });
 }
}


function renderPosts() {
  const s = State.load();
  const list = document.getElementById('community-posts');
  if (!list) return;

  list.innerHTML = s.posts.map((post, i) => {
    const numReplies = Array.isArray(post.replies) ? post.replies.length : post.replies;
    const avatarHTML = getAvatarHTML(post.author, i);

    return `
    <article class="post">
      <div class="post__header">
        ${avatarHTML}
        <div class="post__meta"><div class="post__author">${post.author}</div><div class="post__time">${post.time}</div></div>
      </div>
      <p class="post__text">${post.text}</p>
      <div class="post__actions">
        <button class="post__action ${post.liked ? 'liked' : ''}" data-like="${i}">
          <svg viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${post.likes}
        </button>
        <button class="post__action" onclick="viewPost(${i})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${numReplies} respostes
        </button>
      </div>
    </article>
    `;
  }).join('');

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
   <div class="chat-message-row flex flex-col ${m.from === 'out' ? 'items-end' : 'items-start'} gap-4">
     ${m.from === 'in' && m.author ? `<span class="text-xs text-secondary" style="padding-left:4px">${m.author}</span>` : ''}
     <div class="chat-bubble chat-bubble--${m.from}">${m.text}</div>
     <span class="chat-bubble__time chat-bubble__time--${m.from}">${m.time}</span>
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
 const s = State.load();
 const avatarEl = document.getElementById('settings-parent-avatar');
 const nameEl = document.getElementById('settings-parent-name');
 const emailEl = document.getElementById('settings-parent-email');
 if (avatarEl) {
   const avatar = s.profile.parentAvatar || 'ana.jpg';
   avatarEl.style.backgroundImage = `url('../img/ana.jpg')`;
   avatarEl.style.backgroundSize = 'cover';
   avatarEl.style.backgroundPosition = 'center';
   avatarEl.style.backgroundRepeat = 'no-repeat';
   avatarEl.style.color = 'transparent';
 }
 if (nameEl) nameEl.textContent = s.profile.parentName || 'Ana Molina';
 if (emailEl) emailEl.textContent = s.profile.parentEmail || 'anamolina@gmail.com';


 document.getElementById('btn-logout-settings')?.addEventListener('click', () => { State.reset(); goTo('welcome'); });


 // Dark mode toggle
 const toggle = document.getElementById('toggle-dark');
 if (toggle) {
   try {
     const stored = localStorage.getItem('theme');
     const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
     const isDark = stored ? stored === 'dark' : prefersDark;
     document.documentElement.classList.toggle('theme--dark', isDark);
     toggle.checked = isDark;
   } catch (e) {}
   toggle.addEventListener('change', () => {
     const enabled = toggle.checked;
     document.documentElement.classList.toggle('theme--dark', enabled);
     try { localStorage.setItem('theme', enabled ? 'dark' : 'light'); } catch (e) {}
   });
 }
}


function initProfileView() {
 const s = State.load();
 const setEl = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
 setEl('profile-child-name', s.profile.childName);
 setEl('profile-child-sub', `${s.profile.childAge} · ${s.profile.diagnosis}`);
 const avatarEl = document.getElementById('profile-child-avatar');
 if (avatarEl) {
   avatarEl.style.backgroundImage = `url('../img/${s.profile.childAvatar}')`;
   avatarEl.style.backgroundSize = 'cover';
   avatarEl.style.backgroundPosition = 'center';
   avatarEl.style.backgroundRepeat = 'no-repeat';
   avatarEl.style.color = 'transparent';
   avatarEl.addEventListener('click', () => {
     document.getElementById('avatar-modal').classList.remove('hidden');
   });
 }


 // Modal handlers
 document.getElementById('avatar-modal-close')?.addEventListener('click', () => {
   document.getElementById('avatar-modal').classList.add('hidden');
 });
 document.querySelectorAll('.avatar-option').forEach(img => {
   img.addEventListener('click', () => {
     const selected = img.dataset.avatar;
     const s2 = State.load();
     s2.profile.childAvatar = selected;
     State.save(s2);
     avatarEl.style.backgroundImage = `url('../img/${selected}')`;
     document.getElementById('avatar-modal').classList.add('hidden');
   });
 });


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
     <div class="flex flex-col gap-20">
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
     <div class="flex flex-col gap-20">
       <div class="flex justify-between items-center">
         <h2 class="section-title mb-0">Diari d'observacions</h2>
         <button class="btn btn--primary btn--sm" style="width:auto" onclick="goTo('profile-note')">+ Afegir</button>
       </div>
       ${s.diary.map(e => `
         <div class="diary-entry diary-entry--${e.type}">
           <span class="diary-entry__date">${e.date}</span>
           <p class="diary-entry__text">${e.text}</p>
           <span class="diary-entry__type tag tag--${e.type === 'achievement' ? 'green' : e.type === 'change' ? 'yellow' : e.type === 'difficulty' ? 'red' : 'blue'}">${e.typeLabel}</span>
         </div>`).join('')}
     </div>`;
 } else if (tab === 'skills') {
   active.innerHTML = `
     <div class="flex flex-col gap-12">
       <h2 class="section-title mb-0">Àrees de seguiment</h2>
       ${Object.entries(s.skills).map(([name, skill]) => `
         <div class="skill-row" data-skill="${name}">
           <div class="skill-row__header"><span class="skill-row__name">${name}</span><span class="skill-row__pct">${skill.pct}%</span></div>
           <div class="progress-bar"><div class="progress-bar__fill" style="width:${skill.pct}%"></div></div>
         </div>`).join('')}
         <button class="btn btn--primary" id="btn-full-assessment" style="margin-top: 1rem;">Fer avaluació completa</button>


     </div>`;
    
   active.querySelectorAll('.skill-row').forEach(row => {
     row.addEventListener('click', () => goTo('assessment'));
   });
   document.getElementById('btn-full-assessment')?.addEventListener('click', () => goTo('assessment'));
 }
}


function initProfileEdit() {
 const s = State.load();
 const nameEl = document.getElementById('edit-name');
 if (nameEl) nameEl.value = s.profile.childName;


 // Load diagnosis
 const diagnosisSelect = document.querySelector('.field__select');
 if (diagnosisSelect) diagnosisSelect.value = s.profile.diagnosis;


 // Load birth date (assuming childAge is in format "X anys")
 const birthEl = document.getElementById('edit-birth');
 if (birthEl && s.profile.childAge) {
   const age = parseInt(s.profile.childAge);
   const currentYear = new Date().getFullYear();
   const birthYear = currentYear - age;
   birthEl.value = `${birthYear}-03-15`; // Approximate
 }


 // Needs selection
 document.querySelectorAll('.needs-chip').forEach(chip => {
   const need = chip.dataset.need;
   if (s.profile.needs.includes(need)) chip.classList.add('selected');
 });


 // Avatar handling
 const avatarEl = document.getElementById('profile-child-avatar');
 if (avatarEl) {
   avatarEl.style.backgroundImage = `url('../img/${s.profile.childAvatar}')`;
   avatarEl.style.backgroundSize = 'cover';
   avatarEl.style.backgroundPosition = 'center';
   avatarEl.style.backgroundRepeat = 'no-repeat';
   avatarEl.style.color = 'transparent';
   avatarEl.addEventListener('click', () => {
     document.getElementById('avatar-modal').classList.remove('hidden');
   });
 }


 // Modal handlers
 document.getElementById('avatar-modal-close')?.addEventListener('click', () => {
   document.getElementById('avatar-modal').classList.add('hidden');
 });
 document.querySelectorAll('.avatar-option').forEach(img => {
   img.addEventListener('click', () => {
     const selected = img.dataset.avatar;
     const s2 = State.load();
     s2.profile.childAvatar = selected;
     State.save(s2);
     avatarEl.style.backgroundImage = `url('../img/${selected}')`;
     document.getElementById('avatar-modal').classList.add('hidden');
   });
 });


 document.getElementById('btn-save-profile')?.addEventListener('click', () => {
   const s2 = State.load();
   const name = document.getElementById('edit-name')?.value?.trim();
   if (name) s2.profile.childName = name;
   // Save birth date and calculate age
   const birthDate = document.getElementById('edit-birth')?.value;
   if (birthDate) {
     const birthYear = new Date(birthDate).getFullYear();
     const currentYear = new Date().getFullYear();
     const age = currentYear - birthYear;
     s2.profile.childAge = `${age} anys`;
   }
   // Save diagnosis
   const diagnosisSelect = document.querySelector('.field__select');
   if (diagnosisSelect) s2.profile.diagnosis = diagnosisSelect.value;
   // Save selected needs
   const selectedNeeds = Array.from(document.querySelectorAll('.needs-chip.selected')).map(chip => chip.dataset.need);
   s2.profile.needs = selectedNeeds;
   State.save(s2);
   goTo('profile-view');
 });
 document.getElementById('btn-delete-profile')?.addEventListener('click', () => {
   if (confirm('Segur que vols eliminar el perfil?')) { State.reset(); goTo('welcome'); }
 });
}


function initProfileSettings() {
 const s = State.load();
 const avatarEl = document.getElementById('profile-child-avatar');
 const avatarEditBtn = document.getElementById('profile-settings-avatar-edit');
 const nameEl = document.getElementById('profile-settings-name');
 const emailEl = document.getElementById('profile-settings-email');
 const heroNameEl = document.getElementById('profile-child-name');


 const avatarKey = 'parentAvatar';
 const currentAvatar = s.profile[avatarKey] || 'personatge1.svg';


 if (avatarEl) {
   avatarEl.style.backgroundImage = `url('../img/${currentAvatar}')`;
   avatarEl.style.backgroundSize = 'cover';
   avatarEl.style.backgroundPosition = 'center';
   avatarEl.style.backgroundRepeat = 'no-repeat';
   avatarEl.style.color = 'transparent';
 }


 if (heroNameEl) heroNameEl.textContent = s.profile.parentName || 'Ana Molina';
 if (nameEl) nameEl.value = s.profile.parentName || '';
 if (emailEl) emailEl.value = s.profile.parentEmail || '';


 nameEl?.addEventListener('input', () => {
   if (heroNameEl) heroNameEl.textContent = nameEl.value.trim() || 'Ana Molina';
 });


 const openAvatarModal = () => document.getElementById('avatar-modal')?.classList.remove('hidden');
 const closeAvatarModal = () => document.getElementById('avatar-modal')?.classList.add('hidden');


 avatarEditBtn?.addEventListener('click', openAvatarModal);
 document.getElementById('avatar-modal-close')?.addEventListener('click', closeAvatarModal);
 document.getElementById('avatar-modal-overlay')?.addEventListener('click', closeAvatarModal);


 document.querySelectorAll('.avatar-option').forEach(img => {
   img.addEventListener('click', () => {
     const selected = img.dataset.avatar;
     s.profile[avatarKey] = selected;
     State.save(s);
     if (avatarEl) avatarEl.style.backgroundImage = `url('../img/${selected}')`;
     closeAvatarModal();
   });
 });


 document.getElementById('btn-save-profile-settings')?.addEventListener('click', () => {
   const name = nameEl?.value?.trim();
   const email = emailEl?.value?.trim();
   if (!name || !email) return;
   s.profile.parentName = name;
   s.profile.parentEmail = email;
   State.save(s);
   if (heroNameEl) heroNameEl.textContent = name;
   goTo('settings');
 });


 document.getElementById('btn-cancel-profile-settings')?.addEventListener('click', () => goBack());
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


function initReportGen() {
 document.getElementById('btn-generate-report')?.addEventListener('click', () => goTo('report-done'));
}


/* ══════════════════════════════════════════════════════════
  BOOTSTRAP
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
 // Apply saved theme preference early to avoid flash of light mode
 try {
   const savedTheme = localStorage.getItem('theme');
   const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
   if (savedTheme === 'dark' || (!savedTheme && prefersDark)) document.documentElement.classList.add('theme--dark');
   else document.documentElement.classList.remove('theme--dark');
 } catch (e) {
   /* ignore */
 }


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
   'home': initHome, 'info': initInfo, 'progress': initProgress, 'assessment': initAssessment,
   'results': initResults, 'reminders': initReminders, 'reminder-add': initReminderAdd,
   'professionals': initProfessionals, 'community': initCommunity,
   'community-chat': initCommunityChat, 'community-publish': initCommunityPublish, 'community-post': initCommunityPost,
   'settings': initSettings, 'profile-view': initProfileView,
   'profile-settings': initProfileSettings, 'profile-edit': initProfileEdit, 'profile-note': initProfileNote,
   'report-gen': initReportGen,
 };
 PAGE_INITS[currentPage]?.();

/* ══════════════════════════════════════════════════════════
   COMMUNITY POST DETAIL & REPLIES
══════════════════════════════════════════════════════════ */

// 1. Funció que es crida quan fem clic a "respostes" des del mur principal
window.viewPost = function(idx) {
  const s = State.load();
  const post = s.posts[idx];
  
  // Si la publicació no té respostes detallades creades, li posem les de la imatge de mostra
  if (!Array.isArray(post.replies)) {
    post.repliesCount = post.replies; // Guardem quantes en deia originalment
    post.replies = [
       { author: 'Dolors L.', initials: 'D', time: 'fa 1 h', text: "Sí! El nostre fill hi va. La PT és excel·lent i molt implicada.", likes: 7, liked: true },
       { author: 'Andreu M.', initials: 'A', time: 'fa 45 m', text: "Nosaltres el coneixem bé! Escriu-nos per privat.", likes: 4, liked: true },
       { author: 'Jordina P.', initials: 'J', time: 'fa 30 m', text: "L'adaptació que van fer va ser molt bona. El recomano!", likes: 2, liked: false }
    ];
  }
  
  s.currentPost = post;
  s.currentPostIndex = idx; // Guardem quin número de post és per poder actualitzar els likes globals
  State.save(s);
  
  // Naveguem a la pàgina de la publicació
  goTo('community-post');
};


// 2. Inicialització i dibuix de la pantalla community-post
function initCommunityPost() {
  renderCommunityPost();
  document.getElementById('btn-send-reply')?.addEventListener('click', sendReply);
  document.getElementById('reply-input')?.addEventListener('keypress', e => { 
    if (e.key === 'Enter') sendReply(); 
  });
}

function renderCommunityPost() {
  const s = State.load();
  const post = s.currentPost;
  if(!post) return;

  const mainContainer = document.getElementById('community-main-post');
  if(mainContainer) {
    mainContainer.innerHTML = `
      <div class="post-detail-main">
        <div class="post-detail__header">
          ${getAvatarHTML(post.author, s.currentPostIndex || 0)}
          <div class="post-detail__author">${post.author}</div>
          <div class="post-detail__time">${post.time}</div>
        </div>
        ${post.title ? `<div class="post-detail__title">${post.title}</div>` : ''}
        <div class="post-detail__body">${post.text}</div>
        <div class="post-detail__actions">
          <button class="post-detail__action ${post.liked ? 'liked' : ''}" id="btn-like-main">
            <svg viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${post.likes}
          </button>
          <button class="post-detail__action" style="cursor:default;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ${post.replies.length} respostes
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-like-main')?.addEventListener('click', () => {
      const s2 = State.load();
      s2.currentPost.liked = !s2.currentPost.liked;
      s2.currentPost.likes += s2.currentPost.liked ? 1 : -1;
      if (s2.currentPostIndex !== undefined) {
         s2.posts[s2.currentPostIndex].liked = s2.currentPost.liked;
         s2.posts[s2.currentPostIndex].likes = s2.currentPost.likes;
      }
      State.save(s2);
      renderCommunityPost();
    });
  }

  const repliesTitle = document.getElementById('replies-count-title');
  if(repliesTitle) repliesTitle.textContent = `${post.replies.length} Respostes`;

  const repliesContainer = document.getElementById('community-replies');
  if(repliesContainer) {
    repliesContainer.innerHTML = post.replies.map((r, i) => `
      <div class="post-detail-reply">
        <div class="post-detail__header">
          ${getAvatarHTML(r.author, i + 5)}
          <div class="post-detail__author">${r.author}</div>
          <div class="post-detail__time">${r.time}</div>
        </div>
        <div class="post-detail__body">${r.text}</div>
        <div class="post-detail__actions">
          <button class="post-detail__action ${r.liked ? 'liked' : ''}" onclick="toggleReplyLike(${i})">
            <svg viewBox="0 0 24 24" fill="${r.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${r.likes}
          </button>
        </div>
      </div>
    `).join('');
  }
}

// 3. Funció per donar like a les respostes individuals
window.toggleReplyLike = function(idx) {
  const s = State.load();
  s.currentPost.replies[idx].liked = !s.currentPost.replies[idx].liked;
  s.currentPost.replies[idx].likes += s.currentPost.replies[idx].liked ? 1 : -1;
  
  if (s.currentPostIndex !== undefined) {
      s.posts[s.currentPostIndex].replies = s.currentPost.replies;
  }
  
  State.save(s);
  renderCommunityPost();
};

// 4. Funció per escriure una nova resposta (Ana Molina per defecte)
function sendReply() {
  const input = document.getElementById('reply-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  const s = State.load();
  const authorName = s.profile.parentName || 'Ana Molina';
  const authorInitial = authorName.charAt(0).toUpperCase();

  s.currentPost.replies.push({
    author: authorName,
    initials: authorInitial,
    time: 'ara',
    text: text,
    likes: 0,
    liked: false
  });
  
  if (s.currentPostIndex !== undefined) {
      s.posts[s.currentPostIndex].replies = s.currentPost.replies;
  }
  
  State.save(s);
  input.value = '';
  renderCommunityPost();
  
  // Fa scroll cap a baix perquè vegis el teu missatge automàticament
  const scrollArea = document.querySelector('#page-community-post .page-scroll');
  if(scrollArea) setTimeout(() => scrollArea.scrollTop = scrollArea.scrollHeight, 50);
}


 document.querySelectorAll('.diagnosis-chip').forEach(chip => {
   chip.addEventListener('click', () => { document.querySelectorAll('.diagnosis-chip').forEach(c => c.classList.remove('selected')); chip.classList.add('selected'); });
 });
 document.querySelectorAll('.needs-chip').forEach(chip => chip.addEventListener('click', () => chip.classList.toggle('selected')));
 document.querySelectorAll('.gender-chip').forEach(chip => {
   chip.addEventListener('click', () => { document.querySelectorAll('.gender-chip').forEach(c => c.classList.remove('selected')); chip.classList.add('selected'); });
 });
 document.querySelectorAll('.group-card').forEach(card => card.addEventListener('click', () => goTo('community-chat')));
});
