import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  getActivePrivacyContact,
  getAllPrivacyContacts,
  createPrivacyContact,
  updatePrivacyContact,
  deletePrivacyContact,
} from "../services/privacyContactService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function getPublicPrivacyContactController(env) {
  const contact = await getActivePrivacyContact(env);

  return Response.json(contact || null);
}

export async function getAdminPrivacyContactsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const contacts = await getAllPrivacyContacts(env);

  return Response.json(contacts);
}

export async function createPrivacyContactController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const contact = await createPrivacyContact(env, body);

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "PRIVACY_CONTACT_CREATED",
    targetType: "privacy_contact",
    targetId: contact.id,
    metadata: {
      email: contact.email,
      is_dpo: contact.is_dpo,
    },
  });

  return Response.json({
    success: true,
    contact,
  });
}

export async function updatePrivacyContactController(
  env,
  request,
  contactId
) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const contact = await updatePrivacyContact(
    env,
    Number(contactId),
    body
  );

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "PRIVACY_CONTACT_UPDATED",
    targetType: "privacy_contact",
    targetId: Number(contactId),
    metadata: {
      email: contact?.email,
      is_dpo: contact?.is_dpo,
      is_active: contact?.is_active,
    },
  });

  return Response.json({
    success: true,
    contact,
  });
}

export async function deletePrivacyContactController(
  env,
  request,
  contactId
) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const contact = await deletePrivacyContact(env, Number(contactId));

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "PRIVACY_CONTACT_DELETED",
    targetType: "privacy_contact",
    targetId: Number(contactId),
    metadata: {
      email: contact?.email,
    },
  });

  return Response.json({
    success: true,
    contact,
  });
}