import getCekStanmundurModel from "./cek_stanmundur.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekStanmundur = async ({ thblrek, idpel, limit }) => {
  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202605");
  }

  return getCekStanmundurModel.getCekStanmundur({
    thblrek: finalThblrek,
    idpel,
  });
};

export default { getCekStanmundur };
