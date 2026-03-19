import "./style.css";
import "katex/dist/katex.min.css";
import { parseRoute, navigateTo } from "./router";
import { initWriteMode } from "./write";
import { initReadMode } from "./read";

const appHtml = `
  <header class="h-14 min-h-[56px] flex items-center justify-between px-4 md:px-6 border-b border-gray-800 bg-gray-950 shadow-sm z-10 w-full relative">
    <div class="font-bold text-lg md:text-xl tracking-tight text-purple-400 select-none">ZeroNote</div>
    <div class="flex items-center gap-3" id="controls">
    </div>
  </header>
  <div id="size-warning" class="hidden w-full bg-amber-500 text-amber-950 text-center py-2 px-4 shadow-md text-sm font-semibold z-20">
    Warning: URL exceeds 4000 characters. Some browsers may truncate it.
  </div>
  <main id="main-content" class="flex-1 flex flex-col w-full overflow-hidden"></main>
  
  <div id="toast-container" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"></div>
`;

function showToast(message: string) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className =
    "px-4 py-2 bg-gray-800 text-gray-100 rounded shadow-lg border border-gray-700 text-sm font-medium transition-opacity duration-300 opacity-0 translate-y-2";
  toast.style.transition = "all 0.3s ease";
  toast.innerText = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function checkSizeGuard() {
  const warning = document.getElementById("size-warning");
  if (!warning) return;
  if (window.location.href.length > 4000) {
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

function copyShareLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      showToast("Share link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy link: ", err);
      showToast("Failed to copy link.");
    });
}

function renderControls(currentMode: "write" | "read", data: string) {
  const controls = document.getElementById("controls");
  if (!controls) return;
  controls.innerHTML = "";

  const copyBtn = document.createElement("button");
  copyBtn.className =
    "px-3 py-1.5 text-sm rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors font-medium";
  copyBtn.textContent = "Copy link";
  copyBtn.onclick = copyShareLink;
  controls.appendChild(copyBtn);

  const toggleBtn = document.createElement("button");
  toggleBtn.className =
    "px-4 py-1.5 text-sm rounded bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-sm transition-colors border border-purple-500";

  if (currentMode === "write") {
    toggleBtn.textContent = "Read";
    toggleBtn.onclick = () => {
      const route = parseRoute();
      navigateTo("read", route.data);
    };
  } else {
    toggleBtn.textContent = "Edit";
    toggleBtn.onclick = () => {
      navigateTo("write", data);
    };
  }
  controls.appendChild(toggleBtn);
}

function handleRoute() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  if (!document.getElementById("main-content")) {
    appContainer.innerHTML = appHtml;
  }

  const mainContent = document.getElementById("main-content")!;
  const route = parseRoute();

  if (
    !window.location.hash ||
    window.location.hash === "#" ||
    window.location.hash === "#/"
  ) {
    updateRouteExplicitHash();
    return;
  }

  renderControls(route.mode, route.data);
  checkSizeGuard();

  if (route.mode === "write") {
    initWriteMode(mainContent, route.data);
  } else if (route.mode === "read") {
    initReadMode(mainContent, route.data);
  }
}

function updateRouteExplicitHash() {
  window.history.replaceState(null, "", "#/write/");
  handleRoute();
}

const originalReplaceState = window.history.replaceState;
window.history.replaceState = function (...args) {
  originalReplaceState.apply(window.history, args);
  checkSizeGuard();

  const route = parseRoute();
  renderControls(route.mode, route.data);
};

window.addEventListener("hashchange", handleRoute);

handleRoute();
