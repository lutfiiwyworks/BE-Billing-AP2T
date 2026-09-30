import cekAnomaliKelebihanKvarhModel from "./cek_anomali_kelebihan_kvarh.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekAnomaliKelebihanKvarh = async ({
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

  return cekAnomaliKelebihanKvarhModel.getCekAnomaliKelebihanKvarh({
    thblrek: finalThblrek,
    unitupi,
    idpel,
  });
};

export default { getCekAnomaliKelebihanKvarh };
