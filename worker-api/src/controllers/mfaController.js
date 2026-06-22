import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  generateMfaSecret,
  generateOtpAuthUrl,
  saveMfaSecret,
  enableMfaForUser,
  getUserMfaDetails,
  verifyMfaCode,
} from "../services/mfaService";

import { loginUser } from "../services/authService";
import { generateToken } from "../utils/jwt";

export async function setupMfa(env, request) {
  const user = await getAuthenticatedUser(request, env);

  const secret = generateMfaSecret();

  await saveMfaSecret(env, user.id, secret);

  const otpAuthUrl = generateOtpAuthUrl(user.email, secret);

  await createAuditLog(env, {
    actorUserId: user.id,
    action: "MFA_SETUP_STARTED",
    targetType: "user",
    targetId: user.id,
    metadata: {
      email: user.email,
    },
  });

  return Response.json({
    success: true,
    secret,
    otpAuthUrl,
  });
}

export async function enableMfa(env, request) {
  const user = await getAuthenticatedUser(request, env);
  const body = await request.json();

  const mfaUser = await getUserMfaDetails(env, user.id);

  if (!mfaUser?.mfa_secret) {
    return Response.json(
      {
        success: false,
        message: "MFA setup not started",
      },
      {
        status: 400,
      }
    );
  }

  const valid = await verifyMfaCode(
    mfaUser.mfa_secret,
    body.code
  );

  if (!valid) {
    return Response.json(
      {
        success: false,
        message: "Invalid MFA code",
      },
      {
        status: 400,
      }
    );
  }

  const updatedUser = await enableMfaForUser(env, user.id);

  await createAuditLog(env, {
    actorUserId: user.id,
    action: "MFA_ENABLED",
    targetType: "user",
    targetId: user.id,
    metadata: {
      email: user.email,
    },
  });

  return Response.json({
    success: true,
    user: updatedUser,
  });
}

export async function verifyMfaLogin(env, request) {
  try {
    const body = await request.json();

    const user = await loginUser(
      env,
      body.email,
      body.password
    );

    if (!user.mfa_enabled) {
      return Response.json(
        {
          success: false,
          message: "MFA is not enabled for this user",
        },
        {
          status: 400,
        }
      );
    }

    const valid = await verifyMfaCode(
      user.mfa_secret,
      body.code
    );

    if (!valid) {
      await createAuditLog(env, {
        actorUserId: user.id,
        action: "MFA_LOGIN_FAILED",
        targetType: "user",
        targetId: user.id,
        metadata: {
          email: user.email,
        },
      });

      return Response.json(
        {
          success: false,
          message: "Invalid MFA code",
        },
        {
          status: 401,
        }
      );
    }

    await createAuditLog(env, {
      actorUserId: user.id,
      action: "MFA_LOGIN_SUCCESS",
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
        mfa_enabled: user.mfa_enabled,
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