# Aravind Kumar - Personal Portfolio & Technical Blog

A short, type-only portfolio for **Aravind Kumar** (Senior AI & Machine Learning Engineer). Hosted natively on **GitHub Pages**.

🔗 **Live Website**: [https://aravindkumar-ai.github.io/](https://aravindkumar-ai.github.io/)  
💼 **LinkedIn**: [https://www.linkedin.com/in/aravindkumar-ai/](https://www.linkedin.com/in/aravindkumar-ai/)

---

## Key features

- **GitHub Pages native**: HTML, CSS, and a small posts script. No build step.
- **Homepage**: a narrow column of prose, with the same links in the top bar.
- **Posts**: `posts.html` loads the Markdown posts in `content/posts/` from `content/blogs.json`.

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
