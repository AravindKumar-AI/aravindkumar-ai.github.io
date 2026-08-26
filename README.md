# Aravind Kumar - Personal Portfolio & Technical Blog

Minimalist, modern portfolio and Markdown blog engine for **Aravind Kumar** (Senior AI & Machine Learning Engineer with **7+ years of experience**). Hosted natively on **GitHub Pages**.

🔗 **Live Website**: [https://aravindkumar-ai.github.io/](https://aravindkumar-ai.github.io/)  
💼 **LinkedIn**: [https://www.linkedin.com/in/aravindkumar-ai/](https://www.linkedin.com/in/aravindkumar-ai/)

---

## 🌟 Key Features

- **GitHub Pages Native**: Zero build tools required. Built with clean HTML5, CSS3, and modern JavaScript.
- **7+ Years YOE Experience Timeline**: Detailed career progression spanning DIATOZ (2019-2021), LearnTube.ai (2021-2023), and KnowBe4 (2024-2026+).
- **Specialized AI Focus**: Highlighting Autonomous AI Agents (Claude Agent SDK), LLMs/SLMs fine-tuning, BERTopic/KeyBERT, Neo4j Knowledge Graphs, and Nvidia DeepStream/TensorRT video analytics.
- **Dark / Light Theme Toggle**: Persistent theme switcher (`localStorage`).
- **Markdown Blog Engine**: Automatically loads and renders `.md` blog posts with syntax highlighting for code blocks (Python, Bash, JSON).
- **Search & Tag Filters**: Search articles by title/keyword or filter by topic tags (`#AIAgents`, `#ClaudeSDK`, `#GenAI`, `#ComputerVision`).

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
     "summary": "Short description displayed on the blog card.",
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
