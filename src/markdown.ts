import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import DOMPurify from "dompurify";

marked.use(
  markedKatex({
    throwOnError: false,
  }),
);

marked.setOptions({ breaks: true });

export async function renderMarkdown(markdownText: string): Promise<string> {
  if (markdownText.startsWith("Error:")) {
    return markdownText;
  }

  const rawHtml = await marked.parse(markdownText);
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ADD_TAGS: [
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mspace",
      "mtext",
      "menclose",
      "merror",
      "mfrac",
      "mpadded",
      "mphantom",
      "mroot",
      "mrow",
      "msqrt",
      "mstyle",
      "mmultiscripts",
      "munder",
      "mover",
      "munderover",
      "mtable",
      "mtr",
      "mtd",
      "maligngroup",
      "malignmark",
      "annotation",
      "semantics",
      "annotation-xml",
    ],
    ADD_ATTR: ["display", "xmlns"],
  });

  return cleanHtml;
}
