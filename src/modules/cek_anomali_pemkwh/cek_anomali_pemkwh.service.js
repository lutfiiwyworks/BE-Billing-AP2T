import getCekAnomaliPemkwhModel from "./cek_anomali_pemkwh.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekAnomaliPemkwh = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekAnomaliPemkwhModel.getCekAnomaliPemkwh({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekAnomaliPemkwh };
