import {
  getVendorsController,
  createVendorController,
  updateVendorController,
  deleteVendorController,
  getVendorAnalyticsController,
} from "../controllers/vendorController";

export async function handleVendorRoutes(request, env) {
  const url = new URL(request.url);

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/vendors"
  ) {
    return getVendorsController(env, request);
  }

  if (
    request.method === "POST" &&
    url.pathname === "/api/admin/vendors"
  ) {
    return createVendorController(env, request);
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/admin/vendors/analytics"
  ) {
    return getVendorAnalyticsController(env, request);
  }

  if (
    request.method === "PUT" &&
    url.pathname.startsWith("/api/admin/vendors/")
  ) {
    const vendorId = url.pathname.split("/").pop();

    return updateVendorController(env, request, vendorId);
  }

  if (
    request.method === "DELETE" &&
    url.pathname.startsWith("/api/admin/vendors/")
  ) {
    const vendorId = url.pathname.split("/").pop();

    return deleteVendorController(env, request, vendorId);
  }

  return null;
}