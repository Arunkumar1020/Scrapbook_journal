import { getDb } from "../utils/db";

export async function getAllVendors(env) {
  const sql = getDb(env);

  return await sql`
    SELECT *
    FROM vendor_register
    ORDER BY created_at DESC
  `;
}

export async function createVendor(env, data) {
  const sql = getDb(env);

  const result = await sql`
    INSERT INTO vendor_register
    (
      vendor_name,
      service_type,
      purpose,
      data_shared,
      country,
      retention_period,
      dp_agreement_signed,
      website
    )
    VALUES
    (
      ${data.vendor_name},
      ${data.service_type},
      ${data.purpose},
      ${data.data_shared || ""},
      ${data.country || ""},
      ${data.retention_period || ""},
      ${Boolean(data.dp_agreement_signed)},
      ${data.website || ""}
    )
    RETURNING *
  `;

  return result[0];
}

export async function updateVendor(env, vendorId, data) {
  const sql = getDb(env);

  const result = await sql`
    UPDATE vendor_register
    SET
      vendor_name = COALESCE(${data.vendor_name || null}, vendor_name),
      service_type = COALESCE(${data.service_type || null}, service_type),
      purpose = COALESCE(${data.purpose || null}, purpose),
      data_shared = COALESCE(${data.data_shared || null}, data_shared),
      country = COALESCE(${data.country || null}, country),
      retention_period = COALESCE(${data.retention_period || null}, retention_period),
      dp_agreement_signed = COALESCE(${data.dp_agreement_signed ?? null}, dp_agreement_signed),
      website = COALESCE(${data.website || null}, website)
    WHERE id = ${vendorId}
    RETURNING *
  `;

  return result[0];
}

export async function deleteVendor(env, vendorId) {
  const sql = getDb(env);

  const result = await sql`
    DELETE FROM vendor_register
    WHERE id = ${vendorId}
    RETURNING *
  `;

  return result[0];
}

export async function getVendorAnalytics(env) {
  const sql = getDb(env);

  const result = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM vendor_register) AS total_vendors,
      (SELECT COUNT(*)::int FROM vendor_register WHERE dp_agreement_signed = true) AS agreements_signed,
      (SELECT COUNT(*)::int FROM vendor_register WHERE dp_agreement_signed = false) AS agreements_missing
  `;

  const row = result[0];

  return {
    totalVendors: row.total_vendors || 0,
    agreementsSigned: row.agreements_signed || 0,
    agreementsMissing: row.agreements_missing || 0,
  };
}