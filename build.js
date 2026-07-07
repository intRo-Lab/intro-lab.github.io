const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const postsDir = path.join(__dirname, 'posts');
const outputDir = path.join(__dirname, 'pages'); 

const ADSENSE_CODE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5588756282976438"
     crossorigin="anonymous"></script>`;

// 1. 본문 HTML 템플릿 (KaTeX 폰트 오버라이딩 간섭 문제 해결 버전)
const htmlTemplate = (title, content) => `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - intRo-Lab. Blog </title>
    ${ADSENSE_CODE} 
    <link rel="stylesheet" href="../github-markdown.min.css">
    <link rel="stylesheet" href="../github.min.css">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    
    <script src="../highlight.js" defer></script>
    <script src="../python.min.js" defer></script>
    
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" defer></script>

    <style>
        /* 💡 KaTeX가 일반 텍스트 폰트를 침범하지 못하도록 강제 우선순위(!important)를 부여합니다. */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Malgun Gothic", "맑은 고딕", sans-serif !important; 
            max-width: 900px; 
            margin: 40px auto; 
            padding: 0 20px; 
            line-height: 1.7; 
        }
        
        /* 💡 마크다운 영역 내부의 제목(H1 ~ H4) 폰트가 명조체로 깨지는 문제를 방지합니다. */
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Malgun Gothic", "맑은 고딕", sans-serif !important;
            font-weight: bold;
        }

        .blog-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 12px; margin-bottom: 20px; }
        .blog-header-title { font-size: 2rem; font-weight: bold; color: #24292e; text-decoration: none; }
        .blog-header-title:hover { color: #0066cc; }
        .home-btn { font-size: 0.95rem; font-weight: normal; color: #57606a; text-decoration: none; padding: 6px 12px; border: 1px solid #d0d7de; border-radius: 6px; background-color: #f6f8fa; transition: all 0.2s; }
        .home-btn:hover { background-color: #f3f4f6; color: #24292e; border-color: #8c959f; }
        .back-link { display: inline-block
