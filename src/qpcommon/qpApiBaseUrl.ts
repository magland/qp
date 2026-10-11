// Base URL of the QP worker. Set VITE_QP_API_URL at build time to use a
// different deployment (for example a test worker on workers.dev).
export const QP_API_BASE_URL: string =
  import.meta.env.VITE_QP_API_URL || "https://qp-worker.neurosift.app";
