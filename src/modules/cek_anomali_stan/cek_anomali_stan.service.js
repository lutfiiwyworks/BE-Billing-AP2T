import getCekAnomaliStanModel from "./cek_anomali_stan.models.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekAnomaliStan = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekAnomaliStanModel.getCekAnomaliStan({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekAnomaliStan };
