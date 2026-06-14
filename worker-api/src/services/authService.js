import bcrypt from "bcryptjs";
import { getDb } from "../utils/db";

export async function registerUser(
  env,
  name,
  email,
  password
) {
  const sql = getDb(env);

  const existingUser = await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
  `;

  if (existingUser.length > 0) {
    throw new Error(
      "Email already exists"
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const result = await sql`
    INSERT INTO users
    (
      name,
      email,
      password_hash
    )
    VALUES
    (
      ${name},
      ${email},
      ${passwordHash}
    )
    RETURNING
      id,
      name,
      email,
      created_at
  `;

  return result[0];
}

export async function loginUser(
  env,
  email,
  password
) {
  const sql = getDb(env);

  const result = await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
  `;

  const user = result[0];

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const validPassword =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!validPassword) {
    throw new Error(
      "Invalid credentials"
    );
  }

  return user;
}