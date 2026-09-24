# Aravind Kumar - Personal Portfolio & Technical Blog

A short, type-only portfolio for **Aravind Kumar** (Senior AI & Machine Learning Engineer). Hosted natively on **GitHub Pages**.

🔗 **Live Website**: [https://aravindkumar-ai.github.io/](https://aravindkumar-ai.github.io/)  
💼 **LinkedIn**: [https://www.linkedin.com/in/aravindkumar-ai/](https://www.linkedin.com/in/aravindkumar-ai/)

---

## Key features

- **GitHub Pages native**: the site serves the generated HTML, CSS, and a small posts script.
- **Pages are Markdown**: edit `content/pages/`, then render HTML with `python3 scripts/render.py`.
- **Homepage**: a narrow column of prose, with the same links in the top bar.
- **Posts**: `posts.html` loads the Markdown posts in `content/posts/` from `content/blogs.json`.

---

## Editing a page

Home, posts, projects, resume, and the notes redirect are Markdown files in `content/pages/`:

| File | Page |
| --- | --- |
| `content/pages/index.md` | `index.html` |
| `content/pages/posts.md` | `posts.html` |
| `content/pages/projects.md` | `projects.html` |
| `content/pages/resume.md` | `resume.html` |
| `content/pages/notes.md` | `notes.html` (sends people to posts) |

```bash
python3 -m pip install -r scripts/requirements.txt
python3 scripts/render.py
```

Write normal Markdown. A paragraph that is only italics, such as `*2026 · Bengaluru*`, renders as the gray meta line. On the posts page, a link on its own followed by one of those lines becomes a listed article. A line that is exactly `{{posts}}` is where the on-site essays are inserted. Each essay is still a file in `content/posts/`, registered in `content/blogs.json`.

---

## 📝 How to Add a New Blog Post

Adding a new blog post is simple:

1. **Create a Markdown File**  
   Add a new `.md` file inside `content/posts/`, e.g. `content/posts/my-new-article.md`.

2. **Write Your Article**  
   Write standard Markdown:

   ```markdown
   # My New Article Title

   Summary of the article...

   ```python
   def hello_agent():
       print("Hello from Claude Agent SDK!")
   ```
   ```

3. **Register in `content/blogs.json`**  
   Add an entry in `content/blogs.json`:

   ```json
   {
     "slug": "my-new-article",
     "title": "My New Article Title",
     "summary": "Short description of the note.",
     "date": "August 2026",
     "readTime": "5 min read",
     "tags": ["AIAgents", "Python", "LLMs"]
   }
   ```

4. **Push to GitHub**  
   Push to the `master` branch. GitHub Pages will deploy it automatically!

---

## 🚀 Local Development & Preview

```bash
# Preview locally using Python built-in HTTP server
python3 -m http.server 8000
```
Open `http://localhost:8000` in your web browser.
