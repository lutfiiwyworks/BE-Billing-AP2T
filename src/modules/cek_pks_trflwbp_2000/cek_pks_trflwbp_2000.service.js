import cekPksTrflwbp2000Model from "./cek_pks_trflwbp_2000.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekPksTrflwbp2000 = async ({
  thblrek,
  unitupi,
  idpel,
  trflwbpLebih2000 = false,
}) => {
  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202604");
  }

  return cekPksTrflwbp2000Model.getCekPksTrflwbp2000({
    thblrek: finalThblrek,
    unitupi,
    idpel,
    trflwbpLebih2000,
  });
};

const getCekPksTrflwbpLebih2000 = async ({ thblrek, unitupi, idpel }) =>
  getCekPksTrflwbp2000({
    thblrek,
    unitupi,
    idpel,
    trflwbpLebih2000: true,
  });

export default { getCekPksTrflwbp2000, getCekPksTrflwbpLebih2000 };
