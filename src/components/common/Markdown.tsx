"use client";
import React from "react";

type Props = {
  content: string;
};

export default function Markdown({ content }: Props) {
  const segments = content.split(/```/g);
  const elements: React.ReactNode[] = [];
  let inCode = false;

  segments.forEach((seg, idx) => {
    if (inCode) {
      const lines = seg.split("\n");
      if (lines.length && /^\w+$/.test(lines[0])) lines.shift();
      const code = lines.join("\n");
      elements.push(
        <pre key={`code-${idx}`} className="my-2 whitespace-pre-wrap overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-xs dark:border-white/10 dark:bg-white/10">
          <code>{code}</code>
        </pre>
      );
    } else {
      elements.push(
        <BlockRenderer key={`block-${idx}`} text={seg} />
      );
    }
    inCode = !inCode;
  });

  return <div>{elements}</div>;
}

function BlockRenderer({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const lines = text.split(/\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    // Heading
    const hx = /^(#{1,6})\s+(.+)$/;
    const hm = line.match(hx);
    if (hm) {
      const level = hm[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const Tag = ("h" + level) as unknown as React.ElementType;
      const cls =
        level === 1
          ? "text-2xl font-semibold mt-3 mb-1"
          : level === 2
          ? "text-xl font-semibold mt-3 mb-1"
          : level === 3
          ? "text-lg font-semibold mt-3 mb-1"
          : "text-base font-semibold mt-3 mb-1";
      out.push(
        <Tag key={`h-${i}`} className={`${cls} dark:text-white`}>
          {applyInline(line.replace(hx, "$2"))}
        </Tag>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(\*\s*\*\s*\*|-\s*-\s*-|_{3,})\s*$/.test(line)) {
      out.push(<hr key={`hr-${i}`} className="my-3 border-gray-200 dark:border-white/10" />);
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        <blockquote key={`q-${i}`} className="my-2 border-l-4 pl-3 border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200">
          <BlockRenderer text={quoteLines.join("\n")} />
        </blockquote>
      );
      continue;
    }

    // Lists
    const ulItem = /^\s*[-*]\s+(.+)$/;
    const olItem = /^\s*\d+\.\s+(.+)$/;
    if (ulItem.test(line) || olItem.test(line)) {
      const isOL = olItem.test(line);
      const items: string[] = [];
      while (i < lines.length && (ulItem.test(lines[i]) || olItem.test(lines[i]))) {
        const m = (isOL ? olItem : ulItem).exec(lines[i]);
        if (m) items.push(m[1]);
        i++;
      }
      const ListTag = (isOL ? "ol" : "ul") as unknown as React.ElementType;
      out.push(
        <ListTag key={`list-${i}`} className="my-2 ml-5 list-outside list-disc dark:text-gray-100">
          {items.map((it, idx) => (
            <li key={`li-${i}-${idx}`}>{applyInline(it)}</li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Paragraph: accumulate until blank line
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim()) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={`p-${i}`} className="my-1">
        {applyInline(para.join("\n"))}
      </p>
    );
  }

  return <>{out}</>;
}

function renderInlineText(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const remaining = text;
  const linkRegex = /\[([^\]]+)\]\((https?:[^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(remaining)) !== null) {
    if (match.index > last) nodes.push(applyEmphasisAndBreaks(remaining.slice(last, match.index)));
    nodes.push(
      <a
        key={`a-${last}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline dark:text-blue-400"
      >
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < remaining.length) nodes.push(applyEmphasisAndBreaks(remaining.slice(last)));
  return <>{nodes}</>;
}

// Compose inline markdown processing used by BlockRenderer
function applyInline(text: string): React.ReactNode {
  return renderInlineText(text);
}

function applyEmphasisAndBreaks(text: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let keySeq = 0;
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(text)) !== null) {
    if (m.index > last)
      parts.push(
        <span key={`seg-${keySeq++}`}>{applyEmphasis(text.slice(last, m.index))}</span>
      );
    parts.push(
      <a key={`url-${m.index}`} href={m[1]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length)
    parts.push(
      <span key={`seg-${keySeq++}`}>{applyEmphasis(text.slice(last))}</span>
    );
  return <>{parts}</>;
}

function applyEmphasis(text: string): React.ReactNode {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicRegex = /\*([^*]+)\*/g;
  const withBold: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = boldRegex.exec(text)) !== null) {
    if (m.index > last) withBold.push(text.slice(last, m.index));
    withBold.push(<strong key={`b-${m.index}`}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) withBold.push(text.slice(last));

  const result: React.ReactNode[] = [];
  withBold.forEach((chunk, idx) => {
    if (typeof chunk !== "string") {
      result.push(chunk);
      return;
    }
    let lastI = 0;
    let mi: RegExpExecArray | null;
    while ((mi = italicRegex.exec(chunk)) !== null) {
      if (mi.index > lastI) result.push(chunk.slice(lastI, mi.index));
      result.push(<em key={`i-${idx}-${mi.index}`}>{mi[1]}</em>);
      lastI = mi.index + mi[0].length;
    }
    if (lastI < chunk.length) result.push(chunk.slice(lastI));
  });
  return (
    <>
      {
        (() => {
          const interleaved: React.ReactNode[] = [];
          result.forEach((node, i) => {
            if (typeof node === "string") {
              const lines = node.split("\n");
              lines.forEach((ln, j) => {
                interleaved.push(ln);
                if (j < lines.length - 1) interleaved.push(<br key={`br-${i}-${j}`} />);
              });
            } else {
              interleaved.push(node);
            }
          });
          return interleaved;
        })()
      }
    </>
  );
}
