import cekAnomaliJnLwbpModel from "./cek_anomali_jn_lwbp.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekAnomaliJnLwbp = async ({ thblrek, unitupi, idpel }) => {
  if (!thblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  const rows = await cekAnomaliJnLwbpModel.getCekAnomaliJnLwbp({
    thblrek,
    unitupi,
    idpel,
  });

  return rows;
};

export default { getCekAnomaliJnLwbp };
