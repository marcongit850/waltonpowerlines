// POST /api/contact
// The destination inbox is CONTACT_EMAIL, a Worker variable or secret.
// Delivery uses the Resend HTTP API with RESEND_API_KEY. Neither value is
// returned to the browser.
//
// FROM is Resend's free onboarding sender, which works without a verified
// domain. It can deliver only to the Resend account's own address until a
// domain is verified. After that, switch FROM to an address on the verified
// domain.

const MAX_BODY = 16000;
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;
const RESEND_URL = "https://api.resend.com/emails";
const FROM = "Walton Power Lines <onboarding@resend.dev>";
const recentHits = new Map();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function html(body, status) {
  const heading = body.ok ? "Note received" : "Note not sent";
  const text = body.ok
    ? "Thank you. Your note is on its way."
    : body.error || "Could not send that note. Please try again.";
  const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(heading)} — Walton Power Lines</title>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
  <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
<body>
  <main>
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(text)}</p>
    <p><a href="/contact/">Back to the form</a></p>
  </main>
</body>
</html>`;
  return new Response(page, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clientIp(request) {
  return request.headers.get("cf-connecting-ip") || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const stamps = (recentHits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (stamps.length >= MAX_PER_WINDOW) {
    recentHits.set(ip, stamps);
    return true;
  }
  stamps.push(now);
  recentHits.set(ip, stamps);
  if (recentHits.size > 1000) {
    for (const [key, times] of recentHits) {
      const fresh = times.filter((time) => now - time < WINDOW_MS);
      if (fresh.length) recentHits.set(key, fresh);
      else recentHits.delete(key);
    }
  }
  return false;
}

function singleLine(value) {
  return String(value ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function resendApiKey(env) {
  const key = typeof env.RESEND_API_KEY === "string" ? env.RESEND_API_KEY.trim() : "";
  if (!key || /\s/.test(key)) return "";
  return key;
}

function resendFailure(status, result) {
  const name = result && typeof result.name === "string" ? result.name : "";
  const quota = name === "daily_quota_exceeded" || name === "monthly_quota_exceeded";
  const rateLimitedByResend = status === 429 || name === "rate_limit_exceeded" || quota;

  if (rateLimitedByResend) {
    return {
      status: 429,
      error: quota ? "Please try again later." : "Please wait a minute and try again.",
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    name === "missing_api_key" ||
    name === "restricted_api_key" ||
    name === "suspended_api_key"
  ) {
    return { status: 503, error: "The form is not available right now." };
  }

  if (
    status === 400 ||
    status === 422 ||
    name === "validation_error" ||
    name === "invalid_parameter" ||
    name === "missing_required_field"
  ) {
    return {
      status: 400,
      error: "Could not send that note. Please check the form and try again.",
    };
  }

  return { status: 502, error: "Could not send that note. Please try again." };
}

function noteText(fields) {
  return [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    "",
    fields.message || "(no message)",
  ].join("\n");
}

export async function handleContact(request, env = {}) {
  const accept = (request.headers.get("accept") || "").toLowerCase();
  const type = (request.headers.get("content-type") || "").toLowerCase();
  const asJson = type.includes("application/json") || accept.includes("application/json");
  const reply = (body, status) => (asJson ? json(body, status) : html(body, status));

  if (request.method !== "POST") {
    return reply({ ok: false, error: "Use the form to send a note." }, 405);
  }

  const lengthHeader = Number(request.headers.get("content-length") || 0);
  if (lengthHeader > MAX_BODY) {
    return reply({ ok: false, error: "That note is too long." }, 413);
  }

  const isJson = type.includes("application/json");
  const isForm = type.includes("application/x-www-form-urlencoded");
  if (!isJson && !isForm) {
    return reply({ ok: false, error: "Could not read that note." }, 415);
  }

  if (rateLimited(clientIp(request))) {
    return reply({ ok: false, error: "Please wait a minute and try again." }, 429);
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return reply({ ok: false, error: "Could not read that note." }, 400);
  }
  if (!raw.trim()) {
    return reply({ ok: false, error: "Please add your name and email." }, 400);
  }
  if (raw.length > MAX_BODY) {
    return reply({ ok: false, error: "That note is too long." }, 413);
  }

  let data;
  try {
    if (isJson) {
      data = JSON.parse(raw);
    } else {
      const params = new URLSearchParams(raw);
      data = {};
      for (const key of params.keys()) data[key] = params.get(key);
    }
  } catch {
    return reply({ ok: false, error: "Could not read that note." }, 400);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return reply({ ok: false, error: "Could not read that note." }, 400);
  }

  const honeypot = singleLine(data.company || data.hp_field || data.website);
  if (honeypot) {
    return reply({ ok: false, error: "Could not send that note." }, 400);
  }

  const name = singleLine(data.name);
  const email = singleLine(data.email);
  const message = String(data.message ?? "").replace(/\u0000/g, "").trim();

  if (!name || !email) {
    return reply({ ok: false, error: "Please add your name and email." }, 400);
  }
  if (name.length > 80) return reply({ ok: false, error: "That name is too long." }, 400);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return reply({ ok: false, error: "Please enter a valid email address." }, 400);
  }
  if (message.length > 4000) return reply({ ok: false, error: "That message is too long." }, 400);

  const to = typeof env.CONTACT_EMAIL === "string" ? env.CONTACT_EMAIL.trim() : "";
  if (!to || !EMAIL_RE.test(to)) {
    return reply({ ok: false, error: "The form is not available right now." }, 503);
  }

  const apiKey = resendApiKey(env);
  if (!apiKey) {
    return reply({ ok: false, error: "The form is not available right now." }, 503);
  }

  const payload = {
    from: FROM,
    to: [to],
    reply_to: email,
    subject: `Walton Power Lines note from ${name}`,
    text: noteText({ name, email, message }),
  };

  let upstream;
  try {
    upstream = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return reply({ ok: false, error: "Could not send that note. Please try again." }, 502);
  }

  let result = null;
  try {
    result = await upstream.json();
  } catch {
    result = null;
  }

  const delivered =
    upstream.ok && result && typeof result.id === "string" && result.id.trim().length > 0;
  if (!delivered) {
    const failure = resendFailure(upstream.status, result);
    return reply({ ok: false, error: failure.error }, failure.status);
  }

  return reply({ ok: true }, 200);
}
