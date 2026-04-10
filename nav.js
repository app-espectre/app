// ═══════════════════════════════════════════
// ESPECTRE APP — Navigation & UI Helpers
// ═══════════════════════════════════════════

// Toggle drawer
function openDrawer() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('drawer-overlay')?.classList.add('open');
}
function closeDrawer() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.remove('open');
}

// Tab switching
function showTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('tab-' + tabId);
  const btn = document.querySelector(`[data-tab="${tabId}"]`);
  if (panel) panel.style.display = 'block';
  if (btn) btn.classList.add('active');
}

// Toggle switch
function toggleSwitch(el) {
  el.classList.toggle('on');
}

// Chip selection (single)
function selectChip(group, el) {
  document.querySelectorAll(`[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// Chip selection (multi)
function toggleChip(el) {
  el.classList.toggle('active');
}

// Skill slider update
function updateSkill(val) {
  const display = document.getElementById('skill-val');
  const bar = document.getElementById('skill-bar');
  if (display) display.textContent = val + '%';
  if (bar) bar.style.width = val + '%';
}

// Breathing exercise
let breathing = false, breathInterval = null, breathPhase = 0;
const breathPhases = [
  { text: 'Inspira...', emoji: '🌬️', scale: '1.18' },
  { text: 'Aguanta...', emoji: '😶', scale: '1.1' },
  { text: 'Expira...', emoji: '😮‍💨', scale: '0.88' },
  { text: 'Aguanta...', emoji: '😶', scale: '1.0' }
];

function startBreathing() {
  const circle = document.getElementById('breath-circle');
  const txt = document.getElementById('breath-text');
  const sub = document.getElementById('breath-sub');
  if (!circle) return;
  if (breathing) {
    breathing = false; clearInterval(breathInterval);
    circle.style.transform = 'scale(1)';
    if (txt) txt.textContent = 'Llest/a';
    if (sub) sub.textContent = 'Toca per iniciar';
    return;
  }
  breathing = true; breathPhase = 0;
  function step() {
    const p = breathPhases[breathPhase];
    if (txt) txt.textContent = p.text;
    if (sub) sub.textContent = 'Prem per aturar';
    circle.style.transform = `scale(${p.scale})`;
    breathPhase = (breathPhase + 1) % 4;
  }
  step();
  breathInterval = setInterval(step, 4000);
}

// Exercise timer
let exTimer = null, exCount = 4, exPhaseIdx = 0;
const exPhases = [
  { phase: 'Inspira...', emoji: '🌬️', scale: '1.12' },
  { phase: 'Aguanta...', emoji: '😶', scale: '1.05' },
  { phase: 'Expira...', emoji: '😮‍💨', scale: '0.9' },
  { phase: 'Aguanta...', emoji: '😶', scale: '1.0' }
];

function startExTimer() {
  const circle = document.getElementById('ex-circle');
  const phaseEl = document.getElementById('ex-phase');
  const emojiEl = document.getElementById('ex-emoji');
  const countEl = document.getElementById('ex-count');
  if (exTimer) clearInterval(exTimer);
  exCount = 4; exPhaseIdx = 0;
  function tick() {
    exCount--;
    if (countEl) countEl.textContent = exCount;
    if (exCount <= 0) {
      exPhaseIdx = (exPhaseIdx + 1) % 4;
      exCount = 4;
      const p = exPhases[exPhaseIdx];
      if (phaseEl) phaseEl.textContent = p.phase;
      if (emojiEl) emojiEl.textContent = p.emoji;
      if (circle) circle.style.transform = `scale(${p.scale})`;
    }
  }
  if (phaseEl) phaseEl.textContent = exPhases[0].phase;
  if (emojiEl) emojiEl.textContent = exPhases[0].emoji;
  if (circle) circle.style.transform = `scale(${exPhases[0].scale})`;
  exTimer = setInterval(tick, 1000);
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  // Drawer overlay click
  const ov = document.getElementById('drawer-overlay');
  if (ov) ov.addEventListener('click', closeDrawer);

  // Auto-start exercise timer if on exercise page
  if (document.getElementById('ex-count')) startExTimer();

  // Mark active nav item
  const page = location.pathname.split('/').pop().replace('.html','');
  const navMap = { home: 0, perfil_habilitats: 1, perfil_diari: 1, editar_perfil: 1,
    progres: 2, test: 2, resultats: 2, comunitat: 3, xat: 3, nova_pub: 3, post_detall: 3, benestar: 4, exercici: 4 };
  const idx = navMap[page];
  if (idx !== undefined) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach((it, i) => it.classList.toggle('active', i === idx));
  }
});
