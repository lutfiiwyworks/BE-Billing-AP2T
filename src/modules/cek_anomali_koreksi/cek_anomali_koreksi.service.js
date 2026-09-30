import getCekAnomaliBillingKoreksiModel from "./cek_anomali_koreksi.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekAnomaliBillingKoreksi = async ({ thblrek, idpel, unitupi }) => {
  if (!thblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  const rows = await getCekAnomaliBillingKoreksiModel.getCekAnomaliBillingKoreksi({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekAnomaliBillingKoreksi };
