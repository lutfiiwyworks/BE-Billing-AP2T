import cekRppnR3Model from "./cek_rppn_r3.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekRppnR3 = async ({ thblrek, idpel, limit }) => {
  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202605");
  }

  return cekRppnR3Model.getCekRppnR3({
    thblrek: finalThblrek,
    idpel,
  });
};

export default { getCekRppnR3 };
