import assert from "node:assert/strict";
import { handleContact } from "../src/contact.js";
import worker from "../src/worker.js";

const INBOX = "inbox@example.com";
const API_KEY = "re_test_secret";
const RESEND_URL = "https://api.resend.com/emails";
const FROM = "Walton Power Lines <onboarding@resend.dev>";
let fetchCalls = [];
const realFetch = globalThis.fetch;

function installFetch(handler) {
  fetchCalls = [];
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url, init });
    return handler(url, init);
  };
}

function restoreFetch() {
  globalThis.fetch = realFetch;
}

async function post(body, {
  ip = "203.0.113.10",
  env = { CONTACT_EMAIL: INBOX, RESEND_API_KEY: API_KEY },
  headers,
  raw,
} = {}) {
  const request = new Request("https://waltonpowerlines.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "cf-connecting-ip": ip,
      ...(headers || {}),
    },
    body: raw ?? JSON.stringify(body),
  });
  const response = await handleContact(request, env);
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { response, text, json };
}

function okResend() {
  return new Response(JSON.stringify({ id: "email_123" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

const valid = {
  name: "Ada Walton",
  email: "ada@example.com",
  place: "Miramar Beach",
  message: "Please study 30A.",
  study: "yes",
  company: "",
};

let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log("ok", name);
  } catch (error) {
    console.error("FAIL", name);
    console.error(error);
    process.exitCode = 1;
  } finally {
    restoreFetch();
  }
}

await check("sends a note through Resend", async () => {
  installFetch(async () => okResend());
  const { response, json, text } = await post(valid, { ip: "203.0.113.40" });
  assert.equal(response.status, 200);
  assert.equal(json.ok, true);
  assert.equal(text.includes(INBOX), false);
  assert.equal(text.includes(API_KEY), false);
  assert.equal(text.includes("@"), false);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0].url, RESEND_URL);
  const payload = JSON.parse(fetchCalls[0].init.body);
  assert.equal(payload.from, FROM);
  assert.deepEqual(payload.to, [INBOX]);
  assert.equal(payload.reply_to, "ada@example.com");
  assert.equal(payload.subject, "Walton Power Lines note from Ada Walton");
  assert.match(payload.text, /Name: Ada Walton/);
  assert.match(payload.text, /Neighborhood or community: Miramar Beach/);
  assert.match(payload.text, /Supports a feasibility study: Yes/);
  assert.match(payload.text, /Please study 30A\./);
  assert.equal(payload.text.includes(API_KEY), false);
  assert.equal(fetchCalls[0].init.headers.authorization, `Bearer ${API_KEY}`);
});

await check("records an unchecked study box as no", async () => {
  installFetch(async () => okResend());
  const { response } = await post({ ...valid, study: "" }, { ip: "203.0.113.41" });
  assert.equal(response.status, 200);
  const payload = JSON.parse(fetchCalls[0].init.body);
  assert.match(payload.text, /Supports a feasibility study: No/);
});

await check("accepts a form post without JavaScript", async () => {
  installFetch(async () => okResend());
  const body = new URLSearchParams({
    name: "Ada Walton",
    email: "ada@example.com",
    place: "30A",
    message: "A short note",
    study: "yes",
  });
  const { response, text } = await post(null, {
    ip: "203.0.113.42",
    raw: body.toString(),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      accept: "text/html",
    },
  });
  assert.equal(response.status, 200);
  assert.match(text, /Thank you\. Your note is on its way\./);
  assert.equal(text.includes(INBOX), false);
  assert.equal(text.includes("@"), false);
});

await check("rejects a note with no name", async () => {
  installFetch(async () => { throw new Error("should not send"); });
  const { response, json } = await post({ ...valid, name: "  " }, { ip: "203.0.113.43" });
  assert.equal(response.status, 400);
  assert.match(json.error, /name/i);
  assert.equal(fetchCalls.length, 0);
});

await check("rejects an invalid email", async () => {
  installFetch(async () => { throw new Error("should not send"); });
  const { response, json } = await post({ ...valid, email: "not-an-email" }, { ip: "203.0.113.44" });
  assert.equal(response.status, 400);
  assert.match(json.error, /email/i);
  assert.equal(json.error.includes("@"), false);
});

await check("rejects a filled honeypot", async () => {
  installFetch(async () => { throw new Error("should not send"); });
  const { response } = await post({ ...valid, company: "not-a-person" }, { ip: "203.0.113.45" });
  assert.equal(response.status, 400);
  assert.equal(fetchCalls.length, 0);
});

await check("returns 503 when secrets are missing", async () => {
  installFetch(async () => { throw new Error("should not send"); });
  const { response, json, text } = await post(valid, { ip: "203.0.113.46", env: {} });
  assert.equal(response.status, 503);
  assert.match(json.error, /not available/i);
  assert.equal(text.includes("@"), false);
  assert.equal(fetchCalls.length, 0);
});

await check("returns 503 when only one secret is set", async () => {
  installFetch(async () => { throw new Error("should not send"); });
  const { response } = await post(valid, {
    ip: "203.0.113.47",
    env: { CONTACT_EMAIL: INBOX },
  });
  assert.equal(response.status, 503);
  assert.equal(fetchCalls.length, 0);
});

await check("worker sends contact and leaves other paths to assets", async () => {
  installFetch(async () => okResend());
  const sent = await worker.fetch(new Request("https://waltonpowerlines.com/api/contact/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "cf-connecting-ip": "203.0.113.48",
    },
    body: JSON.stringify(valid),
  }), { CONTACT_EMAIL: INBOX, RESEND_API_KEY: API_KEY });
  assert.equal(sent.status, 200);

  const asset = await worker.fetch(new Request("https://waltonpowerlines.com/"), {
    ASSETS: {
      fetch: async () => new Response("home", { status: 200, headers: { "content-type": "text/html" } }),
    },
  });
  assert.equal(await asset.text(), "home");

  const missing = await worker.fetch(new Request("https://waltonpowerlines.com/why/"), {});
  assert.equal(missing.status, 404);
});

if (process.exitCode) {
  console.error("contact tests failed");
} else {
  console.log(`passed ${passed}`);
}
