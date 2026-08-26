/**
 * Aravind Kumar R - Portfolio & Blog
 * Blog Engine & Dynamic Markdown Loader
 */

let allBlogs = [];
let activeTag = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initBlogEngine();
});

async function initBlogEngine() {
  const blogGrid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blog-search');
  const filterTagsContainer = document.getElementById('filter-tags');

  if (!blogGrid) return;

  try {
    const response = await fetch('content/blogs.json');
    if (!response.ok) throw new Error('Failed to fetch blogs index.');
    allBlogs = await response.json();

    renderFilterTags(allBlogs, filterTagsContainer);
    renderBlogs(allBlogs);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterAndRenderBlogs(query);
      });
    }

    // Check if URL hash specifies a post slug to open directly
    checkUrlHashForPost();
    window.addEventListener('hashchange', checkUrlHashForPost);

  } catch (error) {
    console.error('Error initializing blog engine:', error);
    blogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent-primary);"></i>
        <p>Unable to load blog posts at the moment. Please check back soon!</p>
      </div>
    `;
  }
}

function renderFilterTags(blogs, container) {
  if (!container) return;

  const tags = new Set();
  blogs.forEach(blog => {
    if (blog.tags && Array.isArray(blog.tags)) {
      blog.tags.forEach(t => tags.add(t));
    }
  });

  let tagsHTML = `<button class="filter-btn active" data-tag="all">All</button>`;
  tags.forEach(tag => {
    tagsHTML += `<button class="filter-btn" data-tag="${tag}">${tag}</button>`;
  });

  container.innerHTML = tagsHTML;

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeTag = e.target.getAttribute('data-tag');
      const searchInput = document.getElementById('blog-search');
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filterAndRenderBlogs(query);
    });
  });
}

function filterAndRenderBlogs(searchQuery = '') {
  const filtered = allBlogs.filter(blog => {
    const matchesTag = activeTag === 'all' || (blog.tags && blog.tags.includes(activeTag));
    const matchesSearch = !searchQuery || 
      blog.title.toLowerCase().includes(searchQuery) ||
      blog.summary.toLowerCase().includes(searchQuery) ||
      (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchQuery)));
    
    return matchesTag && matchesSearch;
  });

  renderBlogs(filtered);
}

function renderBlogs(blogs) {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;

  if (blogs.length === 0) {
    blogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">
        <p>No blog posts found matching your criteria.</p>
      </div>
    `;
    return;
  }

  blogGrid.innerHTML = blogs.map(blog => `
    <article class="blog-card" onclick="openBlogModal('${blog.slug}')">
      <div>
        <div class="blog-meta">
          <span><i class="far fa-calendar-alt"></i> ${blog.date}</span>
          <span>•</span>
          <span><i class="far fa-clock"></i> ${blog.readTime || '5 min read'}</span>
        </div>
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-summary">${blog.summary}</p>
      </div>
      <div class="blog-footer">
        <div class="tags-wrapper">
          ${(blog.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <span class="read-more">Read <i class="fas fa-arrow-right"></i></span>
      </div>
    </article>
  `).join('');
}

async function openBlogModal(slug) {
  const blog = allBlogs.find(b => b.slug === slug);
  if (!blog) return;

  const modalOverlay = document.getElementById('blog-modal');
  const modalBody = document.getElementById('modal-markdown-body');

  if (!modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; padding: 3rem 0; color: var(--text-muted);">
      <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent-primary);"></i>
      <p>Loading article...</p>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  window.location.hash = `post-${slug}`;

  try {
    const res = await fetch(`content/posts/${slug}.md`);
    if (!res.ok) throw new Error('Could not load markdown post file.');
    const markdownText = await res.text();

    // Render using marked library if available, otherwise simple fallback parser
    let renderedHTML = '';
    if (window.marked) {
      renderedHTML = window.marked.parse(markdownText);
    } else {
      renderedHTML = simpleMarkdownFallback(markdownText);
    }

    modalBody.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <div class="blog-meta" style="font-size: 0.9rem; margin-bottom: 0.5rem;">
          <span><i class="far fa-calendar-alt"></i> ${blog.date}</span>
          <span>•</span>
          <span><i class="far fa-clock"></i> ${blog.readTime}</span>
        </div>
        <div class="tags-wrapper" style="margin-bottom: 1.5rem;">
          ${(blog.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="markdown-body">
        ${renderedHTML}
      </div>
    `;

    // Highlight code blocks if Prism or hljs is available
    if (window.Prism) {
      window.Prism.highlightAllUnder(modalBody);
    }
  } catch (err) {
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 2rem 0; color: var(--text-muted);">
        <p>Error loading article content.</p>
      </div>
    `;
  }
}

function closeBlogModal() {
  const modalOverlay = document.getElementById('blog-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}

function checkUrlHashForPost() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#post-')) {
    const slug = hash.replace('#post-', '');
    openBlogModal(slug);
  }
}

// Simple fallback markdown renderer if external lib is blocked
function simpleMarkdownFallback(text) {
  return text
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '### $1')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^-(.*$)/gim, '<li>$1</li>');
}
