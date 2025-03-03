'use client'

import { useEffect, useState } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { createHighlighter } from 'shiki'
import { Button } from '@/components/ui/button'

export function MarkdownRenderer({ children }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const processMarkdown = async () => {
      // Create a custom rehype plugin for code highlighting with shiki
      const rehypeShiki = async () => {
        const highlighter = await createHighlighter({
          langs: ["javascript", "typescript", "jsx", "tsx", "html", "css", "json", "python", "bash", "markdown", "go", "yml"],
        });

        return () => (tree) => {
          const visit = (node, callback) => {
            callback(node);
            if (node.children) {
              node.children.forEach((child) => visit(child, callback))
            }
          };

          visit(tree, (node) => {
            if (node.tagName === "pre" && node.children?.[0]?.tagName === "code") {
              const codeNode = node.children[0];
              const className = codeNode.properties?.className || []
              const languageClass = className.find((cls) => cls.startsWith('language-'));
              const language = languageClass ? languageClass.replace("language-", "") : "text";

              const code = codeNode.children?.[0]?.value || "";

              try {
                const html = highlighter?.codeToHtml(code, { lang: language, theme: "ayu-dark" });

                // Extract the highlighted code
                const highlightedCode = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)?.[1] || "";

                // Create a header with language indicator and fake macOS buttons
                const header = `<div><span>${language}</span></div>`;

                // Replace the code content
                codeNode.children = [{
                  type: "raw",
                  value: highlightedCode
                }];

                // Add the header before the code
                node.children.unshift({
                  type: "raw",
                  value: header
                });

                // Add a class to the pre element for styling
                node.properties.className = ["shiki-highlighted"];
              } catch (error) {
                console.error(`Failed to highlight code for language: ${language}`, error);
              }
            }
          });
        };
      };

      const result = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(await rehypeShiki())
        .use(rehypeStringify)
        .process(children);

      setHtml(String(result));
    };

    processMarkdown();
  }, [children]);

  return (
    <div className="markdown-renderer">
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style jsx="true" global="true">{`
        .markdown-renderer pre {
          position: relative;
          background-color: #f6f8fa;
          border-radius: 0.5rem;
          overflow: hidden;
          margin: 1.5rem 0;
        }

        .markdown-renderer pre > div {
          background-color: #e4e6eb;
          height: 2rem;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .markdown-renderer pre > div:before {
          content: "";
          display: inline-block;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background-color: #ff5f56;
          margin-right: 0.25rem;
        }

        .markdown-renderer pre > div:after {
          content: "";
          display: inline-block;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background-color: #ffbd2e;
          margin-right: 0.25rem;
        }

        .markdown-renderer pre > div > span:before {
          content: "";
          display: inline-block;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background-color: #27c93f;
          margin-right: 0.5rem;
        }

        .markdown-renderer pre > div > span {
          display: flex;
          align-items: center;
        }

        .markdown-renderer pre > div > span {
          background-color: #f1f3f5;
          padding: 0.1rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4a5568;
          margin-left: 0.5rem;
        }

        .markdown-renderer pre > code {
          display: block;
          padding: 1rem;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .markdown-renderer code:not(pre code) {
          background-color: rgba(175, 184, 193, 0.2);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        .markdown-renderer .copy-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}

export function CodeBlock({ code, language, filename }) {
  const [highlightedCode, setHighlightedCode] = useState('')

  useEffect(() => {
    const highlight = async () => {
      try {
        const highlighter = await createHighlighter({
          theme: "ayu-dark",
          langs: ["javascript", "typescript", "jsx", "tsx", "html", "css", "json", "python", "bash", "markdown", "go", "yml"],
        });

        const html = highlighter.codeToHtml(code, { lang: language || "text", theme: "ayu-dark" });
        const codeContent = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)?.[1] || "";
        setHighlightedCode(codeContent);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlightedCode(code);
      }
    };

    highlight();
  }, [code, language]);

  return (
    <div className="relative group">
      <pre className="relative">
        <div>
          <span>
            {language && <span>{language}</span>}
          </span>
        </div>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button value={code}>Copy</Button>
        </div>
      </pre>
    </div>
  );
}

export function InlineCode({ code }) {
  return <code>{code}</code>;
}