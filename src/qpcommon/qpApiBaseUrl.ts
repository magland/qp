// Base URL of the QP worker (CatalystNeuro Cloudflare account). Set
// VITE_QP_API_URL at build time to use a different deployment. The previous
// worker, qp-worker.neurosift.app, stays up for a while for embedded widgets.
export const QP_API_BASE_URL: string =
  import.meta.env.VITE_QP_API_URL || "https://qp-worker.ben-dichter.workers.dev";
