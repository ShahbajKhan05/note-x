import React from "react";
import { ExternalLink } from "lucide-react";

/**
 * Parses markdown bold (**bold**), clickable URLs, and rich link preview chips.
 */
export function formatNoteContent(
  text: string,
  richLinkPreviews = true
): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // URL matching regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(urlRegex);

    return (
      <span key={lineIdx} className="block min-h-[1.25em]">
        {parts.map((part, partIdx) => {
          if (part.match(urlRegex)) {
            if (richLinkPreviews) {
              let hostname = part;
              try {
                hostname = new URL(part).hostname.replace(/^www\./, "");
              } catch (_) {}

              return (
                <a
                  key={partIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 rounded-md bg-black/5 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-[#1a73e8] dark:text-[#8ab4f8] transition-colors font-medium text-xs break-all"
                  title={part}
                >
                  <ExternalLink size={12} className="shrink-0" />
                  <span>{hostname}</span>
                </a>
              );
            }

            return (
              <a
                key={partIdx}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#1a73e8] dark:text-[#8ab4f8] hover:underline break-all inline cursor-pointer font-medium"
              >
                {part}
              </a>
            );
          }

          // Parse **bold** markdown
          const boldRegex = /(\*\*[^*]+\*\*)/g;
          const subParts = part.split(boldRegex);

          return subParts.map((sub, subIdx) => {
            if (sub.startsWith("**") && sub.endsWith("**") && sub.length >= 4) {
              return (
                <strong
                  key={subIdx}
                  className="font-bold text-gray-900 dark:text-gray-100 break-words"
                >
                  {sub.slice(2, -2)}
                </strong>
              );
            }

            // Auto-detect common key-value headers (e.g., "User Name:", "Password:", "LDAP ID :", "UAN :")
            const kvMatch = sub.match(/^([A-Za-z0-9\s_-]+:)(\s+.*)?$/);
            if (kvMatch) {
              return (
                <span key={subIdx} className="break-words">
                  <strong className="font-bold text-gray-900 dark:text-gray-100">
                    {kvMatch[1]}
                  </strong>
                  {kvMatch[2] || ""}
                </span>
              );
            }

            return (
              <span key={subIdx} className="break-words">
                {sub}
              </span>
            );
          });
        })}
      </span>
    );
  });
}
