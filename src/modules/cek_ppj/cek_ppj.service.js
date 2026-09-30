import cekPpjModel from "./cek_ppj.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekPpj = async ({ thblrek, onlyDifferent }) => {
  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202606");
  }

  return cekPpjModel.getCekPpj({
    thblrek: finalThblrek,
    onlyDifferent,
  });
};

export default { getCekPpj };
