import {
  registerUser,
  loginUser,
} from "../services/authService";

import { generateToken } from "../utils/jwt";

export async function register(env, request) {
  try {
    const body = await request.json();

    const user = await registerUser(
      env,
      body.name,
      body.email,
      body.password
    );

    const token = await generateToken(user);

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

    const token = await generateToken(user);

    return Response.json({
      success: true,
  user: {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
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