import detilAnomaliHaribacaAp2tModel from "./detil_anomali_haribaca_ap2t.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

const parsePositiveInteger = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw createBadRequest(`Parameter ${fieldName} harus angka bulat positif`);
  }

  return parsed;
};

const normalizeQuery = ({ thblrek, unitupi, idpel, search, sortField, sortOrder }) => {
  const finalThblrek = String(thblrek || "").trim();
  const finalSortOrder = String(sortOrder || "ASC").trim().toUpperCase();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202606");
  }

  if (finalSortOrder && !["ASC", "DESC"].includes(finalSortOrder)) {
    throw createBadRequest("Parameter sortOrder hanya boleh ASC atau DESC");
  }

  return {
    thblrek: finalThblrek,
    unitupi: String(unitupi || "").trim() || undefined,
    idpel: String(idpel || "").trim() || undefined,
    search: String(search || "").trim() || undefined,
    sortField: String(sortField || "").trim() || undefined,
    sortOrder: finalSortOrder,
  };
};

const getDetilAnomaliHaribacaAp2t = async ({
  thblrek,
  unitupi,
  idpel,
  search,
  sortField,
  sortOrder,
  limit,
  page,
}) => {
  const query = normalizeQuery({ thblrek, unitupi, idpel, search, sortField, sortOrder });
  const finalLimit = parsePositiveInteger(limit, "limit") || DEFAULT_LIMIT;
  const finalPage = parsePositiveInteger(page, "page") || 1;

  if (finalLimit > MAX_LIMIT) {
    throw createBadRequest(`Parameter limit maksimal ${MAX_LIMIT}`);
  }

  const result = await detilAnomaliHaribacaAp2tModel.getDetilAnomaliHaribacaAp2t({
    ...query,
    limit: finalLimit,
    offset: (finalPage - 1) * finalLimit,
  });

  return {
    page: finalPage,
    limit: finalLimit,
    total: result.total,
    data: result.data,
  };
};

const exportDetilAnomaliHaribacaAp2t = async ({
  thblrek,
  unitupi,
  idpel,
  search,
  sortField,
  sortOrder,
  stream,
}) => {
  const query = normalizeQuery({ thblrek, unitupi, idpel, search, sortField, sortOrder });

  return detilAnomaliHaribacaAp2tModel.exportDetilAnomaliHaribacaAp2t({
    ...query,
    stream,
  });
};

export default {
  getDetilAnomaliHaribacaAp2t,
  exportDetilAnomaliHaribacaAp2t,
};
