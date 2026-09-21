/**
 * Hackathon + lab mission board with looping GIF-like scenes.
 */

let allMissions = [];

document.addEventListener('DOMContentLoaded', () => {
  initMissions();
});

async function initMissions() {
  const grid = document.getElementById('mission-grid');
  if (!grid) return;

  try {
    const res = await fetch('content/projects.json');
    if (!res.ok) throw new Error('Could not load missions.');
    allMissions = await res.json();
    renderMissions(allMissions);
    bindMissionFilters();
    checkUrlHashForMission();
    window.addEventListener('hashchange', checkUrlHashForMission);
  } catch (err) {
    grid.innerHTML = `<p class="mission-empty">Missions are offline for a moment. Retry soon.</p>`;
  }
}

function bindMissionFilters() {
  const bar = document.getElementById('mission-filters');
  if (!bar) return;
  bar.querySelectorAll('[data-kind]').forEach((btn) => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('[data-kind]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const kind = btn.getAttribute('data-kind');
      const list = kind === 'all' ? allMissions : allMissions.filter((m) => m.kind === kind);
      renderMissions(list);
    });
  });
}

function renderMissions(missions) {
  const grid = document.getElementById('mission-grid');
  if (!grid) return;

  grid.innerHTML = missions.map((m, i) => `
    <article class="mission-card ${i === 0 ? 'featured' : ''}" data-slug="${escapeAttr(m.slug)}">
      <button type="button" class="mission-hit" aria-label="Open ${escapeAttr(m.title)}">
        <div class="mission-gif" data-scene="${escapeAttr(m.scene)}" aria-hidden="true">
          ${sceneMarkup(m.scene)}
          <span class="gif-chip"><i class="fas fa-circle"></i> LOOP</span>
        </div>
        <div class="mission-body">
          <div class="mission-kicker">
            <span class="rank-pip ${escapeAttr(m.rank)}">${escapeHtml(m.place)}</span>
            <span class="mission-year">${escapeHtml(m.year)}</span>
          </div>
          <h3 class="mission-title">${escapeHtml(m.title)}</h3>
          <p class="mission-event">${escapeHtml(m.event)}</p>
          <p class="mission-summary">${escapeHtml(m.summary)}</p>
          <div class="tags-wrapper">
            ${(m.tags || []).slice(0, 4).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      </button>
    </article>
  `).join('');

  grid.querySelectorAll('.mission-card').forEach((card) => {
    const slug = card.getAttribute('data-slug');
    card.querySelector('.mission-hit').addEventListener('click', () => openMission(slug));
  });
}

function sceneMarkup(scene) {
  const scenes = {
    redteam: `
      <div class="scene scene-redteam">
        <span class="orbit o1"></span>
        <span class="orbit o2"></span>
        <span class="radar"></span>
        <span class="node n1"></span>
        <span class="node n2"></span>
        <span class="node n3"></span>
        <span class="beam"></span>
      </div>`,
    agents: `
      <div class="scene scene-agents">
        <span class="agent a1"></span>
        <span class="agent a2"></span>
        <span class="agent a3"></span>
        <span class="packet p1"></span>
        <span class="packet p2"></span>
      </div>`,
    rover: `
      <div class="scene scene-rover">
        <span class="ground"></span>
        <span class="trash t1"></span>
        <span class="trash t2"></span>
        <span class="rover-body"></span>
      </div>`,
    illustrate: `
      <div class="scene scene-illustrate">
        <span class="page"></span>
        <span class="blob b1"></span>
        <span class="blob b2"></span>
        <span class="blob b3"></span>
        <span class="spark s1"></span>
        <span class="spark s2"></span>
      </div>`,
    tutor: `
      <div class="scene scene-tutor">
        <span class="bubble bq">Why?</span>
        <span class="bubble ba">Because…</span>
        <span class="wave w1"></span>
        <span class="wave w2"></span>
        <span class="wave w3"></span>
      </div>`,
    voice: `
      <div class="scene scene-voice">
        <span class="mic"></span>
        <span class="eq e1"></span>
        <span class="eq e2"></span>
        <span class="eq e3"></span>
        <span class="eq e4"></span>
        <span class="eq e5"></span>
        <span class="ring"></span>
      </div>`
  };
  return scenes[scene] || scenes.agents;
}

function openMission(slug, setHash = true) {
  const mission = allMissions.find((m) => m.slug === slug);
  if (!mission) return;
  const modal = document.getElementById('mission-modal');
  const body = document.getElementById('mission-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="mission-gif lg" data-scene="${escapeAttr(mission.scene)}" aria-hidden="true">
      ${sceneMarkup(mission.scene)}
      <span class="gif-chip"><i class="fas fa-circle"></i> LOOP</span>
    </div>
    <div class="mission-kicker">
      <span class="rank-pip ${escapeAttr(mission.rank)}">${escapeHtml(mission.place)}</span>
      <span class="mission-year">${escapeHtml(mission.year)}</span>
    </div>
    <h2 id="mission-modal-title">${escapeHtml(mission.title)}</h2>
    <p class="mission-event">${escapeHtml(mission.event)}</p>
    <p>${escapeHtml(mission.detail || mission.summary)}</p>
    <div class="tags-wrapper" style="margin: 1rem 0 1.5rem;">
      ${(mission.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
    </div>
    <div class="mission-links">
      ${(mission.links || []).map((l) => `
        <a class="btn btn-secondary" href="${escapeAttr(l.href)}" target="_blank" rel="noopener">
          <i class="fab fa-github"></i> ${escapeHtml(l.label)}
        </a>
      `).join('')}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (setHash && window.location.hash !== `#mission-${slug}`) {
    window.location.hash = `mission-${slug}`;
  }
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeMissionUI() {
  const modal = document.getElementById('mission-modal');
  if (modal) modal.classList.remove('active');
  if (!document.getElementById('blog-modal')?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function closeMission() {
  if (window.location.hash && window.location.hash.startsWith('#mission-')) {
    history.back();
  } else {
    closeMissionUI();
  }
}

function checkUrlHashForMission() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#mission-')) {
    openMission(hash.replace('#mission-', ''), false);
  } else {
    closeMissionUI();
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const missionModal = document.getElementById('mission-modal');
    if (missionModal && missionModal.classList.contains('active')) closeMission();
  }
});
