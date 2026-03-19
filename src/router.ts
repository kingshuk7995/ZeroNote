export type AppRoute =
  | { mode: "write"; data: string }
  | { mode: "read"; data: string };

export function parseRoute(): AppRoute {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#/") {
    return { mode: "write", data: "" };
  }

  const path = hash.slice(1);
  const parts = path.split("/");

  if (parts.length >= 3 && parts[1] === "write") {
    return { mode: "write", data: parts.slice(2).join("/") };
  } else if (parts.length >= 3 && parts[1] === "read") {
    return { mode: "read", data: parts.slice(2).join("/") };
  } else if (parts.length === 2 && parts[1] === "write") {
    return { mode: "write", data: "" };
  } else if (parts.length === 2 && parts[1] === "read") {
    return { mode: "read", data: "" };
  }

  return { mode: "write", data: "" };
}

export function updateRouteSilently(mode: "write" | "read", data: string) {
  const newHash = `#/${mode}/${data}`;
  window.history.replaceState(null, "", newHash);
}

export function navigateTo(mode: "write" | "read", data: string) {
  window.location.hash = `#/${mode}/${data}`;
}
