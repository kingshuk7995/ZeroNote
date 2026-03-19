import { decodeBase64, encodeBase64 } from "./codec";
import { updateRouteSilently } from "./router";
import { renderMarkdown } from "./markdown";

export async function initWriteMode(
  container: HTMLElement,
  encodedData: string,
) {
  container.innerHTML = `
    <div class="flex-1 flex flex-row w-full h-full relative">
      <div class="flex-1 flex flex-col w-full h-full md:w-1/2 md:border-r border-gray-800 p-4 md:p-6 lg:p-8 bg-gray-950">
        <textarea 
          class="editor-textarea flex-1 w-full h-full bg-transparent text-gray-200 border-none outline-none resize-none text-base md:text-lg leading-relaxed placeholder-gray-600 focus:ring-0" 
          id="note-editor" 
          placeholder="Start typing your markdown or LaTeX here..."></textarea>
      </div>
      <div class="hidden md:flex flex-col flex-1 w-1/2 h-full overflow-y-auto p-6 lg:p-8 bg-[#0d0d0d]">
        <div class="prose prose-invert prose-lg max-w-none break-words" id="note-preview"></div>
      </div>
    </div>
  `;

  const editor = document.getElementById("note-editor") as HTMLTextAreaElement;
  const preview = document.getElementById("note-preview") as HTMLDivElement;

  let timeout: ReturnType<typeof setTimeout> | null = null;

  async function updatePreview(text: string) {
    preview.innerHTML = await renderMarkdown(text);
  }

  if (encodedData) {
    const text = decodeBase64(encodedData);
    editor.value = text;
    await updatePreview(text);
  } else {
    preview.innerHTML = `<p class="text-gray-600 italic">Preview will appear here...</p>`;
  }

  editor.focus();
  editor.selectionStart = editor.selectionEnd = editor.value.length;

  editor.addEventListener("input", () => {
    const text = editor.value;
    const newData = encodeBase64(text);
    updateRouteSilently("write", newData);

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await updatePreview(text);
    }, 150);
  });
}
