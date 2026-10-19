export type PushRegistration = { status: "registered"; token: string } | { status: "not-configured" | "unsupported" | "open-in-new-tab" | "denied" };
export async function registerProPush(): Promise<PushRegistration> {
  const appId = import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_APP_ID;
  const vapidKey = import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_VAPID_KEY;
  const config = {
    apiKey: import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_WEB_API_KEY,
    projectId: import.meta.env.VITE_LOVABLE_CONNECTOR_FIREBASE_MESSAGING_PROJECT_ID,
    appId, messagingSenderId: appId?.split(":")[1] ?? "",
  };
  if (!config.apiKey || !config.projectId || !appId || !vapidKey || !config.messagingSenderId) return { status: "not-configured" };
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return { status: "unsupported" };
  if (window.top !== window.self) return { status: "open-in-new-tab" };
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") return { status: "denied" };
  const [{ initializeApp, getApps }, { getMessaging, getToken, isSupported }] = await Promise.all([import("firebase/app"), import("firebase/messaging")]);
  if (!(await isSupported())) return { status: "unsupported" };
  const worker = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${new URLSearchParams(config)}`);
  const app = getApps().find(a => a.name === "pro-alerts") ?? initializeApp(config, "pro-alerts");
  const token = await getToken(getMessaging(app), { vapidKey, serviceWorkerRegistration: worker });
  return token ? { status: "registered", token } : { status: "denied" };
}