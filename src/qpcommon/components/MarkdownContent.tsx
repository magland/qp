import { FunctionComponent, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs as highlightStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownContentProps {
  content: string;
}

const MarkdownContent: FunctionComponent<MarkdownContentProps> = ({
  content,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a({ children, ...props }) {
          return (
            <a
              href={props.href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          );
        },
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [copied, setCopied] = useState(false);

          const handleCopy = () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
          };

          return match ? (
            <div style={{ position: "relative" }}>
              <SyntaxHighlighter
                PreTag="div"
                children={code}
                language={match[1]}
                style={highlightStyle}
              />
              <button
                onClick={handleCopy}
                style={{
                  color: "black",
                  position: "absolute",
                  right: "8px",
                  bottom: "24px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <code
              {...rest}
              className={className}
              style={{ background: "#eee" }}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
