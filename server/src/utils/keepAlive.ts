import http from 'http';
import https from 'https';

export const startKeepAlive = (targetUrl?: string) => {
  const FIVE_MINUTES_MS = 5 * 60 * 1000;

  const pingServer = () => {
    const urlToPing =
      targetUrl ||
      process.env.RENDER_EXTERNAL_URL ||
      process.env.SERVER_URL ||
      `http://localhost:${process.env.PORT || 5000}`;

    const client = urlToPing.startsWith('https') ? https : http;

    client
      .get(urlToPing, (res) => {
        console.log(`⏱️ Auto Keep-Alive ping to ${urlToPing} status: ${res.statusCode}`);
      })
      .on('error', (err) => {
        console.error(`⚠️ Auto Keep-Alive ping failed for ${urlToPing}:`, err.message);
      });
  };

  setTimeout(pingServer, 10000);
  setInterval(pingServer, FIVE_MINUTES_MS);
};
