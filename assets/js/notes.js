const indexEl = document.getElementById('notes-index');
const listEl = document.getElementById('notes-list');
const noteEl = document.getElementById('note');

let notes = [];

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('hashchange', render);

async function init() {
  try {
    const response = await fetch('content/blogs.json');
    if (!response.ok) throw new Error('notes index missing');
    notes = await response.json();
  } catch (error) {
    listEl.innerHTML = '<p>notes are unavailable right now.</p>';
    return;
  }
  render();
}

function render() {
  const slug = location.hash.startsWith('#') ? location.hash.slice(1) : '';
  const note = notes.find((item) => item.slug === slug);

  if (!note) {
    noteEl.hidden = true;
    noteEl.innerHTML = '';
    indexEl.hidden = false;
    listEl.innerHTML = notes.map((item) => `
      <p class="note-item">
        <a href="#${item.slug}">${escapeHtml(item.title)}</a>
        <span class="note-meta">${escapeHtml(item.date)} · ${escapeHtml(item.readTime || '')}</span>
      </p>
    `).join('');
    return;
  }

  indexEl.hidden = true;
  noteEl.hidden = false;
  noteEl.innerHTML = '<p>loading…</p>';

  fetch(`content/posts/${note.slug}.md`)
    .then((response) => {
      if (!response.ok) throw new Error('note missing');
      return response.text();
    })
    .then((markdown) => {
      const body = window.marked ? window.marked.parse(markdown) : `<pre>${escapeHtml(markdown)}</pre>`;
      noteEl.innerHTML = `
        <p><a href="notes.html">all notes</a></p>
        <p class="note-meta">${escapeHtml(note.date)} · ${escapeHtml(note.readTime || '')}</p>
        ${body}
      `;
      window.scrollTo(0, 0);
    })
    .catch(() => {
      noteEl.innerHTML = `
        <p><a href="notes.html">all notes</a></p>
        <p>couldn't load this note.</p>
      `;
    });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
