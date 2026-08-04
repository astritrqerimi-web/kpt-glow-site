/**
 * Loads `sonner` on demand so the toast runtime never ships in the critical
 * entry chunk of public pages. The API surface used by the app is preserved
 * (`toast.success` / `toast.error`), only the module is fetched lazily at the
 * moment a toast is actually shown.
 */
type ToastArgs = Parameters<typeof import("sonner").toast.success>;

function call(kind: "success" | "error" | "message", ...args: ToastArgs) {
  void import("sonner").then((mod) => {
    if (kind === "message") mod.toast(...args);
    else mod.toast[kind](...args);
  });
}

export const toast = {
  success: (...args: ToastArgs) => call("success", ...args),
  error: (...args: ToastArgs) => call("error", ...args),
  message: (...args: ToastArgs) => call("message", ...args),
};
