/* ============================================================
   ESPECTRE — state.js
   Estat compartit entre pàgines via sessionStorage
   ============================================================ */

const State = (() => {
  const STORAGE_KEY = 'espectre_state';

  const defaults = {
    authenticated: false,
    profile: {
      childName: 'Martina',
      childAge: '7 anys',
      diagnosis: 'TEA nivell 1',
      needs: ['Comunicació', 'Sensorial', 'Social'],
      parentName: 'Ana Molina',
      parentEmail: 'anamolina@gmail.com',
    },
    skills: {
      'Comunicació':       { pct: 60, level: 2 },
      'Interacció social': { pct: 45, level: 1 },
      'Autonomia':         { pct: 70, level: 3 },
      'Habilitats motrius':{ pct: 55, level: 2 },
      'Conducta emocional':{ pct: 48, level: 1 },
    },
    assessment: { currentQ: 0, answers: [], area: 'Comunicació' },
    results: { score: 72, area: 'Comunicació' },
    reminders: [
      { day: 5,  month: 'ABR', title: 'Sessió de logopèdia',    time: '15:00 h', color: '#508bbf' },
      { day: 18, month: 'ABR', title: 'Revisió pediàtrica',     time: '10:00 h', color: '#ffb100' },
      { day: 20, month: 'ABR', title: 'Reunió PIA a l\'escola', time: '14:00 h', color: '#00943a' },
      { day: 22, month: 'ABR', title: 'Teràpia ocupacional',    time: '11:00 h', color: '#508bbf' },
    ],
    diary: [
      { date: '10 abr 2026', text: 'Gran dia a l\'escola. Ha fet contacte visual amb un nou company per primera vegada!', type: 'achievement', typeLabel: 'Assoliment' },
      { date: '8 abr 2026',  text: 'Ha tingut dificultats en les transicions entre activitats. Crisi de 10 min al canviar de classe.', type: 'difficulty', typeLabel: 'Dificultat' },
      { date: '5 abr 2026',  text: 'Ha après una paraula nova: "gràcies". La fa servir de forma espontània!', type: 'achievement', typeLabel: 'Assoliment' },
    ],
    posts: [
      { author: 'David L.', initials: 'DL', time: 'fa 1 h', text: 'Sí! El nostre fill hi va. La PT és excel·lent i molt implicada.', likes: 7, liked: false, replies: 4, color: '#508bbf' },
      { author: 'Maria G.', initials: 'MG', time: 'fa 2 h', text: 'Celebrant un gran avenç avui! La Martina ha dit la seva primera frase completa! 🎉', likes: 12, liked: false, replies: 8, color: '#00943a' },
      { author: 'Jordi P.', initials: 'JP', time: 'fa 4 h', text: 'Com gestioneu els matins escolars? Tenim moltes dificultats amb les transicions.', likes: 3, liked: false, replies: 6, color: '#9b59b6' },
    ],
    chatMessages: [
      { from: 'in', author: 'Maria G.', text: 'Hola! Algú té experiència amb el CEIP Montserrat?', time: '9:14' },
      { from: 'out', text: 'Nosaltres el coneixem bé! Molt bona atenció TEA', time: '9:16' },
      { from: 'in', author: 'David L.', text: 'Sí, el fill nostre hi va. La PT és excel·lent.', time: '9:20' },
    ],
    editingSkill: 'Comunicació',
    previousPage: null,
  };

  function load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaults));
      const saved = JSON.parse(raw);
      // Deep merge to add any new default keys
      return deepMerge(JSON.parse(JSON.stringify(defaults)), saved);
    } catch {
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function save(data) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  function reset() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return { load, save, reset };
})();
