import {
  registerUser,
  loginUser,
} from "../services/authService";

import { generateToken } from "../utils/jwt";
import { createAuditLog } from "../services/auditService";

export async function register(env, request) {
  try {
    const body = await request.json();

    const user = await registerUser(
      env,
      body.name,
      body.email,
      body.password,
      body.consent_given
    );

    await createAuditLog(env, {
      actorUserId: user.id,
      action: "USER_REGISTERED",
      targetType: "user",
      targetId: user.id,
      metadata: {
        email: user.email,
        consent_given: user.consent_given,
      },
    });

    const token = await generateToken(user, env);

    return Response.json(
      {
        success: true,
        user,
        token,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function login(env, request) {
  try {
    const body = await request.json();

    const user = await loginUser(
      env,
      body.email,
      body.password
    );

    await createAuditLog(env, {
      actorUserId: user.id,
      action: "USER_LOGIN",
      targetType: "user",
      targetId: user.id,
      metadata: {
        email: user.email,
      },
    });

    const token = await generateToken(user, env);

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        consent_given: user.consent_given,
      },
      token,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 401,
      }
    );
  }
}