import getCekRppnLebih0Model from "./cek_rppn_lebih0.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekRppnLebih0 = async ({ thblrek, idpel, limit }) => {
  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202605");
  }

  return getCekRppnLebih0Model.getCekRppnLebih0({
    thblrek: finalThblrek,
    idpel,
  });
};

export default { getCekRppnLebih0 };
