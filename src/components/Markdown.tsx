import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { preprocess } from "../lib/preprocess";

interface Props {
  source: string;
  onInternalLink?: (href: string) => void;
}

export default function Markdown({ source, onInternalLink }: Props) {
  const md = useMemo(() => preprocess(source), [source]);

  return (
    <div className="prose-claude max-w-3xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a({ href, children, ...rest }) {
            const isInternal =
              href?.startsWith("/en/") || href?.startsWith("#");
            if (isInternal && onInternalLink && href) {
              return (
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    onInternalLink(href);
                  }}
                  {...rest}
                >
                  {children}
                </a>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                {...rest}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
