import { SignJWT, jwtVerify } from "jose";

function getSecret(env) {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return new TextEncoder().encode(env.JWT_SECRET);
}

export async function generateToken(user, env) {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role || "user",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret(env));
}

export async function verifyToken(token, env) {
  const { payload } = await jwtVerify(token, getSecret(env));

  return payload;
}