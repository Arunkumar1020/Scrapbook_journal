import { getAuthenticatedUser } from "../middleware/authMiddleware";
import { createAuditLog } from "../services/auditService";

import {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorAnalytics,
} from "../services/vendorService";

function checkAdmin(user) {
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
}

export async function getVendorsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const vendors = await getAllVendors(env);

  return Response.json(vendors);
}

export async function createVendorController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const vendor = await createVendor(env, body);

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "VENDOR_CREATED",
    targetType: "vendor",
    targetId: vendor.id,
    metadata: {
      vendor_name: vendor.vendor_name,
      service_type: vendor.service_type,
    },
  });

  return Response.json({
    success: true,
    vendor,
  });
}

export async function updateVendorController(env, request, vendorId) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const body = await request.json();

  const vendor = await updateVendor(env, Number(vendorId), body);

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "VENDOR_UPDATED",
    targetType: "vendor",
    targetId: Number(vendorId),
    metadata: {
      vendor_name: vendor?.vendor_name,
      dp_agreement_signed: vendor?.dp_agreement_signed,
    },
  });

  return Response.json({
    success: true,
    vendor,
  });
}

export async function deleteVendorController(env, request, vendorId) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const vendor = await deleteVendor(env, Number(vendorId));

  await createAuditLog(env, {
    actorUserId: admin.id,
    action: "VENDOR_DELETED",
    targetType: "vendor",
    targetId: Number(vendorId),
    metadata: {
      vendor_name: vendor?.vendor_name,
    },
  });

  return Response.json({
    success: true,
    vendor,
  });
}

export async function getVendorAnalyticsController(env, request) {
  const admin = await getAuthenticatedUser(request, env);

  checkAdmin(admin);

  const analytics = await getVendorAnalytics(env);

  return Response.json(analytics);
}