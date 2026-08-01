import axios from "axios";

/**
 * Starts a background timer that pings the server's health endpoint every 5 minutes (300,000 ms).
 * Keeps the server active and logs periodic health status updates.
 */
export const startHealthPing = (intervalMs: number = 300000): NodeJS.Timeout => {
  const port = process.env.PORT || 4000;
  const targetUrl = process.env.SERVER_URL || `http://localhost:${port}/health`;

  console.log(`[HealthPing] Initialized self-ping service targeting ${targetUrl} every ${intervalMs / 1000}s`);

  const ping = async (): Promise<void> => {
    try {
      const response = await axios.get(targetUrl);
      console.log(`[HealthPing] Status: ${response.status} (${response.data?.status || "OK"}) at ${new Date().toISOString()}`);
    } catch (error: any) {
      console.warn(`[HealthPing] Self-ping check notice: ${error?.message || error}`);
    }
  };

  const timer = setInterval(ping, intervalMs);
  return timer;
};
