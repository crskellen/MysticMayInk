import { cronAuthorized, syncIfPossible } from "../../src/feed/server.js";

export const maxDuration = 60;

function unauthorized() {
  return new Response(
    JSON.stringify({ ok: false, reason: "unauthorized" }),
    {
      status: 401,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}

export default async function handler(request) {
  if (!cronAuthorized(request)) return unauthorized();

  const result = await syncIfPossible();
  return new Response(
    JSON.stringify({
      ok: result.ok,
      reason: result.reason,
      calledTikTok: result.calledTikTok,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    },
  );
}
