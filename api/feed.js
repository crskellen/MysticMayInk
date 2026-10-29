import { serveFeed } from "../src/feed/server.js";

export const maxDuration = 60;

export default async function handler() {
  const body = await serveFeed();
  const seconds = body.source === "catalog" ? 3600 : 60;
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${seconds}`,
    },
  });
}
