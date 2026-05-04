type TauriWindow = Window & {
  __TAURI__?: unknown;
};

export function isTauriRuntime() {
  return typeof window !== "undefined" && Boolean((window as TauriWindow).__TAURI__);
}

export function getRuntimeTarget() {
  return isTauriRuntime() ? "desktop" : "web";
}
