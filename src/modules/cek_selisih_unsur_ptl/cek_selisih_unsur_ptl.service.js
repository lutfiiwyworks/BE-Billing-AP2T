import cekSelisihUnsurPtlModel from "./cek_selisih_unsur_ptl.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekSelisihUnsurPtl = async ({
  thblrek,
  unitupi,
  idpel,
  limit,
}) => {
  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202605");
  }

  return cekSelisihUnsurPtlModel.getCekSelisihUnsurPtl({
    thblrek: finalThblrek,
    unitupi,
    idpel,
  });
};

export default { getCekSelisihUnsurPtl };
