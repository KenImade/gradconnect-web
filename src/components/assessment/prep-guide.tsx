import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * Renders a prep guide stored as Markdown text.
 * Prose styling is scoped — we explicitly style the expected HTML elements
 * rather than using a prose plugin, so it stays consistent with the design system.
 */
export function PrepGuide({ markdown }: { markdown: string }) {
    return (
        <div className="prep-guide max-w-prose">
            <MDXRemote source={markdown} />
            <style>{`
        .prep-guide h1, .prep-guide h2 {
          font-family: var(--font-display);
          color: var(--foreground);
          font-weight: 600;
          line-height: 1.25;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prep-guide h1 { font-size: 1.5rem; }
        .prep-guide h2 { font-size: 1.25rem; }
        .prep-guide h3 { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .prep-guide p {
          color: var(--text-dim);
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .prep-guide ul, .prep-guide ol {
          color: var(--text-dim);
          line-height: 1.6;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prep-guide ul { list-style-type: disc; }
        .prep-guide ol { list-style-type: decimal; }
        .prep-guide li { margin-bottom: 0.5rem; }
        .prep-guide a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prep-guide a:hover { color: var(--primary-hover); }
        .prep-guide code {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          background: var(--color-surface-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }
        .prep-guide strong { color: var(--foreground); font-weight: 600; }
      `}</style>
        </div>
    );
}