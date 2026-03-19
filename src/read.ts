import { decodeBase64 } from "./codec";
import { renderMarkdown } from "./markdown";

export async function initReadMode(
  container: HTMLElement,
  encodedData: string,
) {
  container.innerHTML = `
    <div class="flex-1 w-full max-w-4xl mx-auto overflow-y-auto p-4 md:p-6 lg:p-8">
      <div class="prose prose-invert prose-lg max-w-none break-words" id="note-reader"></div>
    </div>
  `;

  const reader = document.getElementById("note-reader") as HTMLDivElement;

  if (encodedData) {
    const markdownText = decodeBase64(encodedData);
    if (markdownText.startsWith("Error:")) {
      reader.textContent = markdownText;
      return;
    }

    const cleanHtml = await renderMarkdown(markdownText);
    reader.innerHTML = cleanHtml;
  } else {
    reader.innerHTML = `<p class="text-gray-500 italic">Nothing to read here.</p>`;
  }
}
