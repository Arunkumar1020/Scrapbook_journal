import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  "super-secret-jwt-key"
);

export async function generateToken(user) {
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
    .sign(secret);
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(
    token,
    secret
  );

  return payload;
}