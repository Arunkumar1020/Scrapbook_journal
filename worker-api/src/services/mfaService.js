import { getDb } from "../utils/db";

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function bytesToBase32(bytes) {
  let bits = "";
  let output = "";

  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, "0");
  }

  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);

    if (chunk.length < 5) {
      output += base32Alphabet[parseInt(chunk.padEnd(5, "0"), 2)];
    } else {
      output += base32Alphabet[parseInt(chunk, 2)];
    }
  }

  return output;
}

function base32ToBytes(base32) {
  const clean = base32
    .replace(/=+$/, "")
    .replace(/\s/g, "")
    .toUpperCase();

  let bits = "";

  for (const char of clean) {
    const value = base32Alphabet.indexOf(char);

    if (value === -1) {
      continue;
    }

    bits += value.toString(2).padStart(5, "0");
  }

  const bytes = [];

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return new Uint8Array(bytes);
}

function counterToBytes(counter) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  const bigCounter = BigInt(counter);

  view.setUint32(
    0,
    Number((bigCounter >> 32n) & 0xffffffffn),
    false
  );

  view.setUint32(
    4,
    Number(bigCounter & 0xffffffffn),
    false
  );

  return new Uint8Array(buffer);
}

async function hmacSha1(keyBytes, messageBytes) {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    messageBytes
  );

  return new Uint8Array(signature);
}

async function generateTotp(secret, offset = 0) {
  const timeStep = 30;
  const counter =
    Math.floor(Date.now() / 1000 / timeStep) + offset;

  const keyBytes = base32ToBytes(secret);
  const counterBytes = counterToBytes(counter);

  const hmac = await hmacSha1(keyBytes, counterBytes);

  const dynamicOffset = hmac[hmac.length - 1] & 0x0f;

  const binaryCode =
    ((hmac[dynamicOffset] & 0x7f) << 24) |
    ((hmac[dynamicOffset + 1] & 0xff) << 16) |
    ((hmac[dynamicOffset + 2] & 0xff) << 8) |
    (hmac[dynamicOffset + 3] & 0xff);

  return String(binaryCode % 1000000).padStart(6, "0");
}

export function generateMfaSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return bytesToBase32(bytes);
}

export function generateOtpAuthUrl(email, secret) {
  const issuer = "ScrapBook";
  const label = `${issuer}:${email}`;

  return `otpauth://totp/${encodeURIComponent(
    label
  )}?secret=${secret}&issuer=${encodeURIComponent(
    issuer
  )}&algorithm=SHA1&digits=6&period=30`;
}

export async function saveMfaSecret(env, userId, secret) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE users
    SET mfa_secret = ${secret}
    WHERE id = ${userId}
    RETURNING id, email, mfa_enabled
  `;

  return result[0];
}

export async function enableMfaForUser(env, userId) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE users
    SET mfa_enabled = true
    WHERE id = ${userId}
    RETURNING id, email, mfa_enabled
  `;

  return result[0];
}

export async function getUserMfaDetails(env, userId) {
  const sql = getDb(env);

  const result = await sql`
    SELECT
      id,
      email,
      mfa_enabled,
      mfa_secret
    FROM users
    WHERE id = ${userId}
  `;

  return result[0];
}

export async function verifyMfaCode(secret, code) {
  const cleanCode = String(code).replace(/\s/g, "");

  for (const offset of [-2, -1, 0, 1, 2]) {
    const expectedCode = await generateTotp(secret, offset);

    if (expectedCode === cleanCode) {
      return true;
    }
  }

  return false;
}